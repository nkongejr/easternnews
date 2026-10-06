const asyncHandler = require('express-async-handler');
const Article = require('../models/Article');

const listAuthorFields = 'name title photo slug';
const detailAuthorFields = 'name title bio photo slug';

const normaliseAuthorIds = (authors) => {
  const seen = new Set();
  return authors
    .map((authorId) => (typeof authorId === 'string' ? authorId.trim() : authorId))
    .filter(Boolean)
    .filter((authorId) => {
      const key = String(authorId);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};

const normaliseArticlePayload = (body) => {
  const payload = { ...body };

  if (Array.isArray(payload.authors)) {
    const authors = normaliseAuthorIds(payload.authors);
    payload.authors = authors;
    payload.author = authors[0] || null;
  } else if (payload.author) {
    payload.authors = normaliseAuthorIds([payload.author]);
  } else if (Object.prototype.hasOwnProperty.call(payload, 'author') && !payload.author) {
    payload.author = null;
    payload.authors = [];
  }

  return payload;
};

// @route GET /api/articles?category=Meru&search=debts&page=1&limit=10&featured=true&status=published
const getArticles = asyncHandler(async (req, res) => {
  const {
    category, search, page = 1, limit = 10, featured, hero, breaking, status, tag, issue, author,
  } = req.query;

  const filter = {};
  if (category) filter.category = category;
  if (status && status !== 'all') filter.status = status;
  else if (!status) filter.status = 'published'; // public default hides drafts
  // if status === 'all', no status filter applied (admin use only)
  if (featured === 'true') filter.isFeatured = true;
  if (hero === 'true') filter.isHero = true;
  if (breaking === 'true') filter.isBreaking = true;
  if (author) filter.$or = [{ author }, { authors: author }];
  if (tag) filter.tags = tag;
  if (issue) filter.issue = issue;
  if (search) filter.$text = { $search: search };


  const pageNum = Math.max(parseInt(page, 10), 1);
  const limitNum = Math.min(parseInt(limit, 10), 50);
  const skip = (pageNum - 1) * limitNum;

  const [articles, total] = await Promise.all([
    Article.find(filter)
      .populate('author', listAuthorFields)
      .populate('authors', listAuthorFields)
      .sort({ publishDate: -1 })
      .skip(skip)
      .limit(limitNum),
    Article.countDocuments(filter),
  ]);

  res.json({
    data: articles,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum),
    totalResults: total,
  });
});

const getArticleBySlug = asyncHandler(async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug })
    .populate('author', detailAuthorFields)
    .populate('authors', detailAuthorFields)
    .populate({
      path: 'relatedArticles',
      select: 'title slug deck featuredImage category publishDate bylineCredit commentCount author authors',
      populate: [
        { path: 'author', select: listAuthorFields },
        { path: 'authors', select: listAuthorFields },
      ],
    })
    .populate('issue', 'issueNumber title');

  if (!article) { res.status(404); throw new Error('Article not found'); }

  Article.updateOne({ _id: article._id }, { $inc: { viewCount: 1 } }).exec();

  res.json(article);
});

const getArticleById = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id)
    .populate('author')
    .populate('authors')
    .populate('relatedArticles');
  if (!article) { res.status(404); throw new Error('Article not found'); }
  res.json(article);
});

const createArticle = asyncHandler(async (req, res) => {
  const article = await Article.create(normaliseArticlePayload(req.body));
  res.status(201).json(article);
});

const updateArticle = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (!article) { res.status(404); throw new Error('Article not found'); }
  Object.assign(article, normaliseArticlePayload(req.body));
  const updated = await article.save(); // triggers slug re-check via pre-validate
  res.json(updated);
});

const deleteArticle = asyncHandler(async (req, res) => {
  const article = await Article.findByIdAndDelete(req.params.id);
  if (!article) { res.status(404); throw new Error('Article not found'); }
  res.json({ message: 'Article removed' });
});

// @route GET /api/articles/most-read?limit=5
const getMostRead = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 5;
  const articles = await Article.find({ status: 'published' })
    .sort({ viewCount: -1 })
    .limit(limit)
    .select('title slug featuredImage category viewCount publishDate author authors bylineCredit')
    .populate('author', listAuthorFields)
    .populate('authors', listAuthorFields);
  res.json(articles);
});

module.exports = {
  getArticles, getArticleBySlug, getArticleById,
  createArticle, updateArticle, deleteArticle, getMostRead,
};
