/**
 * Helpers for filling an article's optional SEO fields (title, description,
 * keywords) from content the newsroom has already written. Only blank fields
 * are filled — editor-written SEO values are always preserved.
 */

const MAX_DESCRIPTION_LENGTH = 160;

/** Strip markdown-ish syntax and collapse whitespace for plain-text use. */
function toPlainText(value) {
  return String(value || '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links keep their label
    .replace(/[#>*_`~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function truncate(value, max) {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1).trimEnd()}…`;
}

function buildSeoDescription({ deck, body }) {
  return truncate(toPlainText(deck || body || ''), MAX_DESCRIPTION_LENGTH);
}

function buildSeoKeywords({ tags, category }) {
  const keywords = [];
  const seen = new Set();
  for (const tag of [...(tags || []), category].filter(Boolean)) {
    const clean = String(tag).trim();
    const key = clean.toLowerCase();
    if (clean && !seen.has(key)) {
      seen.add(key);
      keywords.push(clean);
    }
  }
  return keywords.join(', ');
}

/**
 * Derive { seoTitle, seoDescription, seoKeywords } from an article. The
 * headline doubles as the SEO title because it is already written for
 * readers; the deck (or body lede) becomes the description; tags plus the
 * section become the keywords.
 */
function buildSeoFields(article) {
  return {
    seoTitle: String(article.title || '').trim(),
    seoDescription: buildSeoDescription(article),
    seoKeywords: buildSeoKeywords(article),
  };
}

/** Return only the SEO fields that are missing/blank on the article. */
function fillMissingSeoFields(article) {
  const generated = buildSeoFields(article);
  const filled = {};
  for (const field of ['seoTitle', 'seoDescription', 'seoKeywords']) {
    if (!String(article[field] || '').trim()) filled[field] = generated[field];
  }
  return filled;
}

module.exports = { buildSeoFields, fillMissingSeoFields };
