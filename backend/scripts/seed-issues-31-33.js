/**
 * Safely add Issues 31-33 to production MongoDB without wiping existing data.
 * Unlike src/seed/seed.js which deletes everything, this script only upserts Issues.
 * 
 * Usage (run from your local machine where MongoDB Atlas is reachable):
 *   cd backend
 *   npm install
 *   # ensure .env has MONGO_URI, CLOUDINARY_*, ADMIN_*
 *   node scripts/seed-issues-31-33.js --dry-run
 *   node scripts/seed-issues-31-33.js
 * 
 * If you have already uploaded PDFs to Cloudinary via /admin/publications/new,
 * you can pass existing URLs:
 *   PDF_URL_31=https://res.cloudinary.com/.../issue31.pdf PDF_URL_32=... PDF_URL_33=... node scripts/seed-issues-31-33.js
 * 
 * Or let the script upload from ../gmail/ folder if Cloudinary is reachable:
 *   node scripts/seed-issues-31-33.js --upload
 */

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('MONGO_URI not set in .env');
  process.exit(1);
}

const DRY_RUN = process.argv.includes('--dry-run');
const UPLOAD = process.argv.includes('--upload');

const Issue = require('../models/Issue');

const issuesMeta = [
  {
    issueNumber: 31,
    title: 'Issue 31, December 2025',
    month: 'December',
    year: 2025,
    coverImage: process.env.COVER_URL_31 || '/seed/cover-story.jpg',
    coverHeadline: 'Alarm in counties amid looming hunger',
    pdfUrl: process.env.PDF_URL_31 || '',
    isCurrent: false,
  },
  {
    issueNumber: 32,
    title: 'Issue 32, May-June 2026',
    month: 'May-June',
    year: 2026,
    coverImage: process.env.COVER_URL_32 || '/seed/cover-story.jpg',
    coverHeadline: 'Counties chocking in massive debts',
    pdfUrl: process.env.PDF_URL_32 || '',
    isCurrent: false,
  },
  {
    issueNumber: 33,
    title: 'Issue 33, September 2026',
    month: 'September',
    year: 2026,
    coverImage: process.env.COVER_URL_33 || '/seed/cover-story.jpg',
    coverHeadline: 'Mt Kenya and Ukambani at political crossroads',
    pdfUrl: process.env.PDF_URL_33 || '',
    isCurrent: true,
  },
];

async function uploadToCloudinaryIfRequested() {
  if (!UPLOAD) return;

  const cloudinary = require('../config/cloudinary');
  const streamifier = require('streamifier');

  const upload = (buffer, folder, publicId, resourceType = 'image') =>
    new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: resourceType, public_id: publicId },
        (err, result) => (result ? resolve(result) : reject(err))
      );
      streamifier.createReadStream(buffer).pipe(stream);
    });

  const gmailDir = path.join(__dirname, '..', '..', 'gmail');
  const mapping = {
    31: 'Eastern Issue 31-compressed.pdf',
    32: 'THE EASTERN issue32-compressed-1.pdf',
    33: 'THE EASTERN issue33.pdf',
  };

  for (const meta of issuesMeta) {
    const fileName = mapping[meta.issueNumber];
    if (!fileName) continue;
    const fullPath = path.join(gmailDir, fileName);
    if (!fs.existsSync(fullPath)) {
      console.warn(`PDF not found for Issue ${meta.issueNumber}: ${fullPath} — skipping Cloudinary upload`);
      continue;
    }
    const buffer = fs.readFileSync(fullPath);
    const publicId = `issue-${meta.issueNumber}-${Date.now()}`;
    console.log(`Uploading ${fileName} to Cloudinary...`);
    if (DRY_RUN) {
      console.log('DRY RUN — would upload');
      continue;
    }
    const result = await upload(buffer, 'eastern-newspaper/publications', publicId, 'raw');
    meta.pdfUrl = result.secure_url;
    console.log(`→ ${meta.pdfUrl}`);
  }
}

async function run() {
  console.log(`Connecting to ${MONGO_URI.slice(0, 30)}...`);
  await mongoose.connect(MONGO_URI);

  await uploadToCloudinaryIfRequested();

  for (const meta of issuesMeta) {
    console.log(`\nProcessing Issue ${meta.issueNumber}: ${meta.title}`);
    console.log(`  pdfUrl: ${meta.pdfUrl || '(empty — upload via admin UI later)'}`);
    console.log(`  coverImage: ${meta.coverImage}`);

    if (DRY_RUN) {
      console.log('  DRY RUN — not writing to DB');
      continue;
    }

    if (meta.isCurrent) {
      await Issue.updateMany({}, { isCurrent: false });
    }

    const existing = await Issue.findOne({ issueNumber: meta.issueNumber });
    if (existing) {
      Object.assign(existing, meta);
      await existing.save();
      console.log(`  Updated existing _id=${existing._id}`);
    } else {
      const created = await Issue.create(meta);
      console.log(`  Created new _id=${created._id}`);
    }
  }

  const all = await Issue.find().sort({ issueNumber: -1 }).select('issueNumber title month year isCurrent pdfUrl');
  console.log('\nCurrent issues in DB:');
  all.forEach((i) => console.log(`  ${i.issueNumber}: ${i.title} | current=${i.isCurrent} | pdf=${i.pdfUrl ? 'yes' : 'no'}`));

  await mongoose.connection.close();
  console.log('\nDone. Check /publications on main website.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
