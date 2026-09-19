/**
 * Local preview API that serves seed content without MongoDB.
 * Used when Atlas is unreachable. Production still uses server.js + Mongo.
 *
 *   node preview-server.js
 */
const express = require('express');
const cors = require('cors');
const slugify = require('slugify');
const { categories, authors, articles, advertisers, issueMeta } = require('./src/seed/seedData');

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

const advertiserDocs = advertisers.map((a, i) => ({
  _id: `ad-${i}`,
  slug: slug(a.businessName),
  isActive: true,
  ...a,
}));

const issue = {
  _id: 'issue-current',
  ...issueMeta,
  articles: articleDocs.map(({ body, relatedArticles, ...rest }) => rest),
};

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Eastern Newspaper API (preview)', time: new Date().toISOString() });
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

app.get('/api/issues/current', (_req, res) => res.json(issue));
app.get('/api/issues', (_req, res) => res.json([issue]));

app.post('/api/contact', (_req, res) => res.json({ ok: true }));
app.post('/api/contact/newsletter', (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Eastern Newspaper preview API on port ${PORT}`);
});
