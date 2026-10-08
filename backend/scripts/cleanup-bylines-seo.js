/**
 * One-off newsroom cleanup for articles and authors:
 *
 *   1. Authors: strip a trailing "KNA" (plus any hyphen/space before it) from
 *      staff-writer names, e.g. "Christine Ngitori KNA" -> "Christine Ngitori",
 *      "Muguongo Judy- KNA" -> "Muguongo Judy", "Mary Wavinya-KNA" ->
 *      "Mary Wavinya". Profile slugs are regenerated to match. Articles
 *      reference authors by id, so bylines across all articles update
 *      automatically. "KNA Correspondent" (the wire-service byline) is
 *      intentionally left untouched.
 *   2. Articles: remove the "Eastern Correspondent" byline credit and the
 *      "Photo KNA" photo credit (featured image + gallery images).
 *   3. Articles: fill blank optional SEO fields (title, description,
 *      keywords) from the existing headline/deck/body/tags. Any SEO values
 *      an editor already wrote are preserved.
 *
 * Nothing else is modified.
 *
 * Usage (run from a machine that can reach MongoDB Atlas):
 *   cd backend
 *   npm install
 *   # ensure .env has MONGO_URI
 *   node scripts/cleanup-bylines-seo.js --dry-run
 *   node scripts/cleanup-bylines-seo.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const slugify = require('slugify');

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('MONGO_URI not set in .env');
  process.exit(1);
}

const DRY_RUN = process.argv.includes('--dry-run');

const Author = require('../src/models/Author');
const Article = require('../src/models/Article');
const { fillMissingSeoFields } = require('../src/utils/seo');

// Trailing "KNA" with any mix of hyphens/spaces/invisible marks before it,
// e.g. "Christine Ngitori KNA", "Muguongo Judy- KNA", "Dickson Mwiti - KNA",
// "Mary Wavinya-KNA", "Stella Mwebia<LRM>- KNA". Leading "KNA" (as in
// "KNA Correspondent") does not match.
const KNA_SUFFIX = /[\s\u00ad\u200b\u200e\u200f\ufeff-]*kna\s*$/i;

function cleanAuthorName(name) {
  return String(name || '').replace(KNA_SUFFIX, '').trim();
}

function isEasternCorrespondentCredit(value) {
  return /^\s*eastern\s+correspondent\s*$/i.test(String(value || ''));
}

function isPhotoKnaCredit(value) {
  return /^\s*photo\s*kna\s*$/i.test(String(value || ''));
}

/** Regenerate a unique author slug, mirroring the model's slugify options. */
async function uniqueAuthorSlug(base, authorId) {
  let slug = base;
  let count = 0;
  for (;;) {
    const clash = await Author.findOne({ slug, _id: { $ne: authorId } }).lean();
    if (!clash) return slug;
    count += 1;
    slug = `${base}-${count}`;
  }
}

const run = async () => {
  await mongoose.connect(MONGO_URI);
  console.log(`✅ MongoDB connected: ${mongoose.connection.host}`);

  // ---- 1. Rename authors (strip trailing hyphen + "KNA") ----------------
  const authors = await Author.find();
  const renameMap = new Map(); // normalised old name -> cleaned name
  const authorUpdates = [];
  for (const author of authors) {
    const cleaned = cleanAuthorName(author.name);
    if (!cleaned || cleaned === author.name) continue;
    const baseSlug = slugify(cleaned, { lower: true, strict: true });
    const slug = DRY_RUN ? baseSlug : await uniqueAuthorSlug(baseSlug, author._id);
    renameMap.set(author.name.trim().toLowerCase(), cleaned);
    authorUpdates.push({ id: author._id, name: cleaned, slug });
    console.log(`✏️  Author: "${author.name}" -> "${cleaned}" (slug "${author.slug}" -> "${slug}")`);
  }

  // ---- 2+3. Clean article byline/photo credits and fill SEO -------------
  const articles = await Article.find();
  const articleUpdates = [];
  for (const article of articles) {
    const set = {};

    // Remove the "Eastern Correspondent" byline credit; if a text byline
    // matches a renamed author, swap in the cleaned name.
    if (isEasternCorrespondentCredit(article.bylineCredit)) {
      set.bylineCredit = '';
    } else if (article.bylineCredit) {
      const renamed = renameMap.get(article.bylineCredit.trim().toLowerCase());
      if (renamed) set.bylineCredit = renamed;
    }

    // Remove the "Photo KNA" credit from the featured image and gallery.
    if (article.featuredImage && isPhotoKnaCredit(article.featuredImage.credit)) {
      set['featuredImage.credit'] = '';
    }
    (article.gallery || []).forEach((image, index) => {
      if (image && isPhotoKnaCredit(image.credit)) {
        set[`gallery.${index}.credit`] = '';
      }
    });

    // Fill blank optional SEO fields; existing editor-written SEO is kept.
    Object.assign(set, fillMissingSeoFields(article));

    if (Object.keys(set).length > 0) {
      articleUpdates.push({ id: article._id, set });
      console.log(`✏️  Article: "${article.title}" -> ${JSON.stringify(set)}`);
    }
  }

  console.log(`\nSummary: ${authorUpdates.length} author(s) renamed, ${articleUpdates.length} article(s) updated.`);

  if (DRY_RUN) {
    console.log('Dry run — no changes written.');
  } else {
    for (const update of authorUpdates) {
      await Author.updateOne({ _id: update.id }, { $set: { name: update.name, slug: update.slug } });
    }
    for (const update of articleUpdates) {
      await Article.updateOne({ _id: update.id }, { $set: update.set });
    }
    console.log('✅ Cleanup applied.');
  }

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error('❌ Cleanup failed:', err);
  process.exit(1);
});
