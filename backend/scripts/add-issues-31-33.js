/**
 * Helper to add Issues 31-33 from the Gmail downloads.
 * 
 * Usage:
 *   cd backend
 *   node scripts/add-issues-31-33.js --dry-run
 *   node scripts/add-issues-31-33.js
 *   API_URL=http://localhost:5000/api node scripts/add-issues-31-33.js --preview
 * 
 * - By default talks to production API via CLIENT_URLS? Set API_URL env.
 * - --preview uses preview-server's in-memory file store (no Cloudinary needed)
 * - Requires ADMIN_EMAIL/PASSWORD from .env for login
 * - Expects PDFs in ../gmail/ (relative to backend) or /home/user/easternnews/gmail/
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios'); // axios is not in backend deps, will try require, fallback to fetch

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@easternnewspaper.co.ke';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
const DRY_RUN = process.argv.includes('--dry-run');
const PREVIEW = process.argv.includes('--preview');

const gmailDirCandidates = [
  path.join(__dirname, '..', '..', 'gmail'),
  path.join(__dirname, '..', 'gmail'),
  '/home/user/easternnews/gmail',
];

let gmailDir = null;
for (const d of gmailDirCandidates) {
  if (fs.existsSync(d)) { gmailDir = d; break; }
}
if (!gmailDir) {
  console.error('Could not find gmail/ folder. Tried:', gmailDirCandidates);
  process.exit(1);
}

const issuesMeta = [
  {
    issueNumber: 31,
    title: 'Issue 31, December 2025',
    month: 'December',
    year: 2025,
    coverHeadline: 'Alarm in counties amid looming hunger',
    pdfFile: 'Eastern Issue 31-compressed.pdf',
    coverFile: null, // will need manual screenshot — use logo placeholder if missing
    isCurrent: false,
  },
  {
    issueNumber: 32,
    title: 'Issue 32, May-June 2026',
    month: 'May-June',
    year: 2026,
    coverHeadline: 'Counties chocking in massive debts',
    pdfFile: 'THE EASTERN issue32-compressed-1.pdf',
    coverFile: null,
    isCurrent: false,
  },
  {
    issueNumber: 33,
    title: 'Issue 33, September 2026',
    month: 'September',
    year: 2026,
    coverHeadline: 'Mt Kenya and Ukambani at political crossroads',
    pdfFile: 'THE EASTERN issue33.pdf', // manually downloaded from Drive
    coverFile: 'Deputy President Professor Kithure Kindiki greets residents of Meru County  during a development tour.jpg',
    isCurrent: true,
  },
];

async function login() {
  console.log(`Logging in as ${ADMIN_EMAIL} to ${API_URL}/auth/login ...`);
  if (DRY_RUN) return 'dry-run-token';
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Login failed ${res.status}: ${txt}`);
  }
  const data = await res.json();
  if (!data.token) throw new Error('No token in login response');
  console.log(`Logged in, token ${data.token.slice(0,10)}...`);
  return data.token;
}

async function uploadFile(token, filePath, type = 'pdf') {
  const fileName = path.basename(filePath);
  if (!fs.existsSync(filePath)) {
    console.warn(`  File missing: ${filePath} — skipping upload`);
    return null;
  }
  console.log(`  Uploading ${type}: ${fileName} (${(fs.statSync(filePath).size/1024/1024).toFixed(2)} MB)`);
  if (DRY_RUN) return `https://res.cloudinary.com/dtxojyixv/${type === 'pdf' ? 'raw/upload' : 'image/upload'}/eastern-newspaper/${fileName}`;

  const formData = new FormData();
  const blob = new Blob([fs.readFileSync(filePath)]);
  if (type === 'pdf') {
    formData.append('file', blob, fileName);
    const res = await fetch(`${API_URL}/upload/pdf`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`PDF upload failed ${res.status}: ${txt}`);
    }
    const data = await res.json();
    console.log(`    → ${data.url}`);
    return data.url;
  } else {
    formData.append('image', blob, fileName);
    const res = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Image upload failed ${res.status}: ${txt}`);
    }
    const data = await res.json();
    console.log(`    → ${data.url}`);
    return data.url;
  }
}

async function getIssues(token) {
  const res = await fetch(`${API_URL}/issues`);
  if (!res.ok) throw new Error(`GET /issues failed ${res.status}`);
  return await res.json();
}

async function createOrUpdateIssue(token, meta, pdfUrl, coverImageUrl) {
  const payload = {
    issueNumber: meta.issueNumber,
    title: meta.title,
    month: meta.month,
    year: meta.year,
    coverHeadline: meta.coverHeadline,
    coverImage: coverImageUrl || '',
    pdfUrl: pdfUrl || '',
    isCurrent: meta.isCurrent,
  };

  console.log(`\nProcessing Issue ${meta.issueNumber}: ${meta.title}`);
  console.log(`  Payload:`, payload);

  if (DRY_RUN) {
    console.log('  DRY RUN — not creating');
    return;
  }

  const existingIssues = await getIssues(token);
  const existing = existingIssues.find(i => i.issueNumber === meta.issueNumber);

  if (existing) {
    console.log(`  Found existing Issue ${meta.issueNumber} with _id ${existing._id} — updating via PUT`);
    const res = await fetch(`${API_URL}/issues/${existing._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`PUT /issues/${existing._id} failed ${res.status}: ${txt}`);
    }
    const data = await res.json();
    console.log(`  Updated: ${data._id}`);
  } else {
    console.log(`  No existing Issue ${meta.issueNumber} — creating via POST`);
    const res = await fetch(`${API_URL}/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`POST /issues failed ${res.status}: ${txt}`);
    }
    const data = await res.json();
    console.log(`  Created: ${data._id}`);
  }
}

(async () => {
  try {
    console.log(`Gmail dir: ${gmailDir}`);
    console.log(`API: ${API_URL}  dryRun=${DRY_RUN} preview=${PREVIEW}`);
    console.log(`Issues to process:`, issuesMeta.map(i => i.issueNumber).join(', '));

    const token = await login();

    for (const meta of issuesMeta) {
      const pdfPath = path.join(gmailDir, meta.pdfFile);
      const coverPath = meta.coverFile ? path.join(gmailDir, meta.coverFile) : null;

      let pdfUrl = null;
      let coverUrl = null;

      if (fs.existsSync(pdfPath)) {
        pdfUrl = await uploadFile(token, pdfPath, 'pdf');
      } else {
        console.warn(`  PDF not found for Issue ${meta.issueNumber}: ${pdfPath}`);
        if (meta.issueNumber === 33) {
          console.warn(`  For Issue 33, manually download from Drive: https://drive.google.com/file/d/1HeoYu4DqdHO8KX8ajFLoAHkdlJ4CtN8r/view?usp=drive_web`);
        }
      }

      if (coverPath && fs.existsSync(coverPath)) {
        coverUrl = await uploadFile(token, coverPath, 'image');
      } else if (meta.issueNumber === 33) {
        // fallback to second front photo if first missing
        const alt = path.join(gmailDir, 'Former Deputy President Rigathi Gachagua and other leaders of the opposition adressing residents of Sipili area in Laikipia West recently.jpg');
        if (fs.existsSync(alt)) {
          coverUrl = await uploadFile(token, alt, 'image');
        }
      }

      await createOrUpdateIssue(token, meta, pdfUrl, coverUrl);
    }

    console.log('\nDone. Verify at /admin/publications and /publications');
  } catch (err) {
    console.error('Error:', err.message);
    console.error(err.stack);
    process.exit(1);
  }
})();
