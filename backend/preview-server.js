/**
 * Local preview API that serves seed content without MongoDB.
 * Used when Atlas is unreachable. Production still uses server.js + Mongo.
 *
 *   node preview-server.js
 *
 * The newsroom admin is demoable here too: sign in with ADMIN_EMAIL /
 * ADMIN_PASSWORD from .env and any publication you add is kept in memory for
 * the life of the process (a restart returns to the seed edition).
 */
const express = require('express');
const cors = require('cors');
const slugify = require('slugify');
const { categories, authors, articles, advertisers, issueMeta } = require('./src/seed/seedData');
const uploadImageMiddleware = require('./src/middleware/upload');
const uploadPdfMiddleware = require('./src/middleware/uploadPdf');

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const slug = (s) => slugify(String(s || ''), { lower: true, strict: true });

const authorDocs = authors.map((a, i) => ({
  _id: `author-${i}`,
  ...a,
  slug: slug(a.name),
}));
const authorByName = Object.fromEntries(authorDocs.map((a) => [a.name, a]));

const articleDocs = articles.map((a, i) => {
  const { authorName, ...rest } = a;
  return {
    _id: `article-${i}`,
    slug: slug(a.title),
    ...rest,
    author: authorByName[authorName] || null,
    status: 'published',
    publishDate: '2026-07-18T08:00:00.000Z',
    updatedAt: '2026-07-18T08:00:00.000Z',
    viewCount: Math.max(4, 80 - i * 3),
    commentCount: 0,
    createdAt: '2026-07-18T08:00:00.000Z',
  };
});

for (const article of articleDocs) {
  article.relatedArticles = articleDocs
    .filter((a) => a.category === article.category && a._id !== article._id)
    .slice(0, 3)
    .map(({ body, relatedArticles, ...rest }) => rest);
}

const categoryDocs = categories.map((c, i) => ({
  _id: `cat-${i}`,
  ...c,
  slug: slug(c.name),
}));

let advertiserDocs = advertisers.map((a, i) => ({
  _id: `ad-${i}`,
  slug: slug(a.businessName),
  isActive: true,
  ...a,
}));

/* ------------------------------------------------------------------
   Reader comments — in-memory, same shape as the Mongo-backed API.
   ------------------------------------------------------------------ */

const hoursAgo = (h) => new Date(Date.now() - h * 3600 * 1000).toISOString();

let commentCounter = 0;
let commentDocs = [
  {
    article: 'article-0',
    name: 'Jane Wanjiru',
    email: 'jane.wanjiru@example.com',
    body: 'Good reporting. Let the auditors publish the full debt registers for each county — ratepayers deserve to see who was paid.',
    status: 'approved',
    createdAt: hoursAgo(3),
  },
  {
    article: 'article-0',
    name: 'Peter Mutuma',
    email: '',
    body: 'This is the story every county assembly should be debating instead of allowances. Thank you Eastern Newspaper.',
    status: 'approved',
    createdAt: hoursAgo(26),
  },
  {
    article: 'article-1',
    name: 'Halima Noor',
    email: '',
    body: 'Please follow this up county by county and give us the figures for each treasury.',
    status: 'approved',
    createdAt: hoursAgo(9),
  },
].map((c) => {
  commentCounter += 1;
  return { _id: `comment-${commentCounter}`, ...c, updatedAt: c.createdAt };
});

/** Never hand a reader's email address to the website. */
const publicComment = ({ email: _email, article: _article, ...rest }) => rest;

const findCommentTarget = (idOrSlug) =>
  articleDocs.find((a) => a._id === idOrSlug || a.slug === idOrSlug);

const approvedComments = (articleId) =>
  commentDocs
    .filter((c) => c.article === articleId && c.status === 'approved')
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

const commentCountFor = (articleId) => approvedComments(articleId).length;

const syncCommentCount = (articleId) => {
  const article = articleDocs.find((a) => a._id === articleId);
  if (article) article.commentCount = commentCountFor(articleId);
};

// The cards on the homepage read this denormalised counter.
for (const article of articleDocs) syncCommentCount(article._id);

app.get('/api/articles/:articleId/comments', (req, res) => {
  const article = findCommentTarget(req.params.articleId);
  if (!article) return res.status(404).json({ message: 'Article not found' });

  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);
  const list = approvedComments(article._id);

  res.json({
    data: list.slice((page - 1) * limit, page * limit).map(publicComment),
    page,
    totalPages: Math.ceil(list.length / limit) || 0,
    totalResults: list.length,
  });
});

app.post('/api/articles/:articleId/comments', (req, res) => {
  const article = findCommentTarget(req.params.articleId);
  if (!article) return res.status(404).json({ message: 'Article not found' });

  const { name, email, body, honeypot } = req.body || {};
  if (honeypot) return res.json({ ok: true, message: 'Thank you for your comment.' });

  const cleanName = String(name || '').trim();
  const cleanBody = String(body || '').trim();
  if (cleanName.length < 2) {
    return res.status(400).json({ message: 'Please give a name of at least 2 characters' });
  }
  if (cleanBody.length < 2) return res.status(400).json({ message: 'Please write a comment' });
  if (cleanBody.length > 2000) {
    return res.status(400).json({ message: 'Comments are limited to 2000 characters' });
  }

  commentCounter += 1;
  const now = new Date().toISOString();
  const comment = {
    _id: `comment-${commentCounter}`,
    article: article._id,
    name: cleanName,
    email: String(email || '').trim(),
    body: cleanBody,
    status: 'approved',
    createdAt: now,
    updatedAt: now,
  };
  commentDocs.push(comment);
  syncCommentCount(article._id);

  res.status(201).json({
    comment: publicComment(comment),
    commentCount: commentCountFor(article._id),
    pending: false,
    message: 'Thank you — your comment is now published.',
  });
});

/* ---------------- Publications ---------------- */
const stamp = '2026-07-18T08:00:00.000Z';
let issueDocs = [
  { _id: 'issue-1', ...issueMeta, articles: [], createdAt: stamp, updatedAt: stamp },
];
let issueCounter = issueDocs.length;

const publicIssue = ({ articles: _articles, ...rest }) => rest;

const findIssue = (id) => issueDocs.find((i) => i._id === id);

/**
 * Mirrors backend/src/controllers/issueController.js: whitelist the fields an
 * editor may change, then validate the ones the public library depends on.
 * Throws a 400-flavoured error that the route turns into JSON.
 */
const buildIssuePayload = (body = {}, res, existingId) => {
  const updates = {};
  ['issueNumber', 'title', 'month', 'year', 'coverImage', 'coverHeadline', 'pdfUrl', 'isCurrent']
    .forEach((field) => {
      if (body[field] !== undefined) updates[field] = body[field];
    });

  if (updates.issueNumber !== undefined) updates.issueNumber = Number(updates.issueNumber);
  if (updates.year !== undefined) updates.year = Number(updates.year);

  const bad = (message) => {
    res.status(400);
    throw new Error(message);
  };

  if (updates.title !== undefined && !String(updates.title).trim()) bad('An issue title is required');
  if (updates.issueNumber !== undefined && !Number.isFinite(updates.issueNumber)) {
    bad('An issue number is required');
  }
  if (
    updates.issueNumber !== undefined &&
    issueDocs.some((i) => i.issueNumber === updates.issueNumber && i._id !== existingId)
  ) {
    bad(`Issue ${updates.issueNumber} already exists`);
  }

  if (updates.pdfUrl !== undefined) {
    const url = String(updates.pdfUrl || '').trim();
    const isPublicLink = /^https?:\/\//i.test(url) || /^\/(?!\/)/.test(url);
    if (url && !isPublicLink) {
      bad('PDF link must be a public address (https://…) or a site path starting with /');
    }
    updates.pdfUrl = url;
  }

  return updates;
};

/* ------------------------------------------------------------------
   Newsroom sign-in (demo only — the real API issues a JWT)
   ------------------------------------------------------------------ */
const DEMO_USER = {
  _id: 'user-demo',
  name: process.env.ADMIN_NAME || 'Newsroom Admin',
  email: process.env.ADMIN_EMAIL || 'admin@easternnewspaper.co.ke',
  role: 'admin',
};
const DEMO_PASSWORD = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
const DEMO_TOKEN = 'preview-demo-token';

const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ') || header.slice(7) !== DEMO_TOKEN) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
  next();
};

/* ------------------------------------------------------------------
   Stored files (images / PDFs uploaded from the admin, kept in RAM)
   ------------------------------------------------------------------ */
const storedFiles = new Map();

const storeFile = (file) => {
  const id = `file-${storedFiles.size + 1}-${Date.now()}`;
  storedFiles.set(id, { buffer: file.buffer, mimetype: file.mimetype, originalname: file.originalname });
  return id;
};

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Eastern Newspaper API (preview)', time: new Date().toISOString() });
});

app.get('/api/preview-file/:id', (req, res) => {
  const file = storedFiles.get(req.params.id);
  if (!file) return res.status(404).json({ message: 'Not found' });
  res.type(file.mimetype);
  res.set('Content-Disposition', `inline; filename="${file.originalname || 'file'}"`);
  res.send(file.buffer);
});

app.get('/api/categories', (req, res) => {
  const { type } = req.query;
  const list = type ? categoryDocs.filter((c) => c.type === type) : categoryDocs;
  res.json(list);
});

app.get('/api/categories/:slug', (req, res) => {
  const cat = categoryDocs.find((c) => c.slug === req.params.slug);
  if (!cat) return res.status(404).json({ message: 'Not found' });
  res.json(cat);
});

app.get('/api/articles/most-read', (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 5;
  const list = [...articleDocs]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, limit)
    .map(({ title, slug: s, featuredImage, category, viewCount, publishDate, _id }) => ({
      _id, title, slug: s, featuredImage, category, viewCount, publishDate,
    }));
  res.json(list);
});

app.get('/api/articles', (req, res) => {
  const { category, search, featured, hero, breaking, page = 1, limit = 10, author } = req.query;
  let list = [...articleDocs];
  if (category) list = list.filter((a) => a.category === category);
  if (featured === 'true') list = list.filter((a) => a.isFeatured);
  if (hero === 'true') list = list.filter((a) => a.isHero);
  if (breaking === 'true') list = list.filter((a) => a.isBreaking);
  if (author) list = list.filter((a) => a.author?._id === author);
  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        (a.deck || '').toLowerCase().includes(q) ||
        (a.body || '').toLowerCase().includes(q) ||
        (a.tags || []).some((t) => t.toLowerCase().includes(q)),
    );
  }
  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(parseInt(limit, 10) || 10, 50);
  const total = list.length;
  const data = list.slice((pageNum - 1) * limitNum, pageNum * limitNum);
  res.json({ data, page: pageNum, totalPages: Math.ceil(total / limitNum) || 0, totalResults: total });
});

app.get('/api/articles/:slug', (req, res) => {
  const article = articleDocs.find((a) => a.slug === req.params.slug);
  if (!article) return res.status(404).json({ message: 'Not found' });
  res.json(article);
});

app.get('/api/authors', (_req, res) => res.json(authorDocs));

app.get('/api/authors/:slug', (req, res) => {
  const author = authorDocs.find((a) => a.slug === req.params.slug);
  if (!author) return res.status(404).json({ message: 'Not found' });
  res.json(author);
});

app.get('/api/advertisers', (req, res) => {
  const { placement } = req.query;
  let list = advertiserDocs.filter((a) => a.isActive);
  if (placement) list = list.filter((a) => a.adPlacement === placement);
  res.json(list);
});

/* Advertiser admin (demo, in-memory) — lets the newsroom book the article-page
   placements from the preview dashboard without touching MongoDB. */

const AD_PLACEMENTS = ['sidebar', 'banner', 'sponsored-post', 'article-inline', 'article-overlay'];

const buildAdvertiserPayload = (body = {}, res, existingId) => {
  const updates = {};
  ['businessName', 'category', 'logo', 'description', 'contact', 'adPlacement', 'linkURL', 'isActive']
    .forEach((field) => {
      if (body[field] !== undefined) updates[field] = body[field];
    });

  if (updates.businessName !== undefined && !String(updates.businessName).trim()) {
    res.status(400);
    throw new Error('A business name is required');
  }
  if (updates.adPlacement !== undefined && !AD_PLACEMENTS.includes(updates.adPlacement)) {
    res.status(400);
    throw new Error(`Placement must be one of: ${AD_PLACEMENTS.join(', ')}`);
  }
  if (updates.businessName !== undefined && !existingId) {
    updates.slug = slug(updates.businessName);
  }

  return updates;
};

app.get('/api/advertisers/id/:id', requireAuth, (req, res) => {
  const advertiser = advertiserDocs.find((a) => a._id === req.params.id);
  if (!advertiser) return res.status(404).json({ message: 'Advertiser not found' });
  res.json(advertiser);
});

app.post('/api/advertisers', requireAuth, (req, res) => {
  let payload;
  try {
    payload = buildAdvertiserPayload(req.body, res);
  } catch (err) {
    return res.status(res.statusCode).json({ success: false, message: err.message });
  }
  if (!payload.businessName) return res.status(400).json({ message: 'A business name is required' });

  const now = new Date().toISOString();
  const advertiser = {
    _id: `ad-${advertiserDocs.length + 1}-${Date.now()}`,
    category: 'Other',
    logo: '',
    description: '',
    contact: {},
    adPlacement: 'sidebar',
    linkURL: '',
    isActive: true,
    ...payload,
    createdAt: now,
    updatedAt: now,
  };
  advertiserDocs.push(advertiser);
  res.status(201).json(advertiser);
});

app.put('/api/advertisers/:id', requireAuth, (req, res) => {
  const advertiser = advertiserDocs.find((a) => a._id === req.params.id);
  if (!advertiser) return res.status(404).json({ message: 'Advertiser not found' });

  let updates;
  try {
    updates = buildAdvertiserPayload(req.body, res, advertiser._id);
  } catch (err) {
    return res.status(res.statusCode).json({ success: false, message: err.message });
  }

  Object.assign(advertiser, updates, { updatedAt: new Date().toISOString() });
  res.json(advertiser);
});

app.delete('/api/advertisers/:id', requireAuth, (req, res) => {
  const index = advertiserDocs.findIndex((a) => a._id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Advertiser not found' });
  advertiserDocs.splice(index, 1);
  res.json({ message: 'Advertiser removed' });
});

/* ---------------- Publications ---------------- */

app.get('/api/issues/current', (_req, res) => {
  const issue = issueDocs.find((i) => i.isCurrent) || issueDocs[0];
  if (!issue) return res.status(404).json({ message: 'No current issue set' });
  res.json({
    ...issue,
    articles: articleDocs.map(({ body, relatedArticles, ...rest }) => rest),
  });
});

app.get('/api/issues/id/:id', requireAuth, (req, res) => {
  const issue = findIssue(req.params.id);
  if (!issue) return res.status(404).json({ message: 'Issue not found' });
  res.json(issue);
});

app.get('/api/issues/:issueNumber', (req, res) => {
  const issue = issueDocs.find((i) => String(i.issueNumber) === String(req.params.issueNumber));
  if (!issue) return res.status(404).json({ message: 'Issue not found' });
  res.json(issue);
});

app.get('/api/issues', (_req, res) => {
  res.json([...issueDocs].sort((a, b) => b.issueNumber - a.issueNumber).map(publicIssue));
});

app.post('/api/issues', requireAuth, (req, res) => {
  let payload;
  try {
    payload = buildIssuePayload(req.body, res);
  } catch (err) {
    return res.status(res.statusCode).json({ success: false, message: err.message });
  }

  if (payload.isCurrent) issueDocs.forEach((i) => { i.isCurrent = false; });

  issueCounter += 1;
  const now = new Date().toISOString();
  const issue = {
    _id: `issue-${issueCounter}`,
    coverImage: '',
    coverHeadline: '',
    pdfUrl: '',
    isCurrent: false,
    ...payload,
    articles: [],
    createdAt: now,
    updatedAt: now,
  };
  issueDocs.push(issue);
  res.status(201).json(issue);
});

app.put('/api/issues/:id', requireAuth, (req, res) => {
  const issue = findIssue(req.params.id);
  if (!issue) return res.status(404).json({ message: 'Issue not found' });

  let updates;
  try {
    updates = buildIssuePayload(req.body, res, issue._id);
  } catch (err) {
    return res.status(res.statusCode).json({ success: false, message: err.message });
  }

  if (updates.isCurrent) issueDocs.forEach((i) => { if (i._id !== issue._id) i.isCurrent = false; });

  Object.assign(issue, updates, { updatedAt: new Date().toISOString() });
  res.json(issue);
});

app.delete('/api/issues/:id', requireAuth, (req, res) => {
  const issue = findIssue(req.params.id);
  if (!issue) return res.status(404).json({ message: 'Issue not found' });
  issueDocs = issueDocs.filter((i) => i._id !== issue._id);
  res.json({ message: 'Issue removed' });
});

/* ---------------- Comment moderation (newsroom) ---------------- */

app.get('/api/comments', requireAuth, (req, res) => {
  const { status, article } = req.query;
  let list = [...commentDocs].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  if (status) list = list.filter((c) => c.status === status);
  if (article) list = list.filter((c) => c.article === article);

  res.json({
    data: list.map((c) => {
      const target = articleDocs.find((a) => a._id === c.article);
      return {
        ...publicComment(c),
        email: c.email,
        article: target ? { _id: target._id, title: target.title, slug: target.slug } : c.article,
      };
    }),
    page: 1,
    totalPages: 1,
    totalResults: list.length,
    pendingCount: commentDocs.filter((c) => c.status === 'pending').length,
  });
});

app.put('/api/comments/:id/status', requireAuth, (req, res) => {
  const comment = commentDocs.find((c) => c._id === req.params.id);
  if (!comment) return res.status(404).json({ message: 'Comment not found' });

  const { status } = req.body || {};
  if (!['approved', 'pending', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Status must be approved, pending or rejected' });
  }

  comment.status = status;
  comment.updatedAt = new Date().toISOString();
  syncCommentCount(comment.article);
  res.json({ comment: { ...publicComment(comment), email: comment.email }, commentCount: commentCountFor(comment.article) });
});

app.delete('/api/comments/:id', requireAuth, (req, res) => {
  const comment = commentDocs.find((c) => c._id === req.params.id);
  if (!comment) return res.status(404).json({ message: 'Comment not found' });

  commentDocs = commentDocs.filter((c) => c._id !== comment._id);
  syncCommentCount(comment.article);
  res.json({ message: 'Comment removed' });
});

/* ---------------- Auth (demo) ---------------- */

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  const matchesEmail = String(email || '').trim().toLowerCase() === DEMO_USER.email.toLowerCase();
  if (matchesEmail && password === DEMO_PASSWORD) {
    return res.json({ ...DEMO_USER, token: DEMO_TOKEN });
  }
  res.status(401).json({ success: false, message: 'Invalid email or password' });
});

app.get('/api/auth/me', requireAuth, (_req, res) => res.json(DEMO_USER));

/* ---------------- Uploads (kept in memory) ---------------- */

app.post('/api/upload', requireAuth, uploadImageMiddleware.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No image file uploaded' });
  const id = storeFile(req.file);
  res.status(201).json({ url: `/api/preview-file/${id}`, width: null, height: null });
});

app.post('/api/upload/pdf', requireAuth, uploadPdfMiddleware.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No PDF file uploaded' });
  const id = storeFile(req.file);
  res.status(201).json({ url: `/api/preview-file/${id}`, bytes: req.file.size });
});

// Multer rejections (wrong file type / too large) shouldn't surface as 500s.
app.use((err, _req, res, _next) => {
  const status = err.statusCode || (err.name === 'MulterError' ? 400 : res.statusCode >= 400 ? res.statusCode : 500);
  res.status(status).json({ success: false, message: err.message });
});

app.post('/api/contact', (_req, res) => res.json({ ok: true }));
app.post('/api/contact/newsletter', (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Eastern Newspaper preview API on port ${PORT}`);
  console.log(`Newsroom demo sign-in: ${DEMO_USER.email} / ${DEMO_PASSWORD}`);
});
