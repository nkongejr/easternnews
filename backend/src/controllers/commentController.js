const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Comment = require('../models/Comment');
const Article = require('../models/Article');

/**
 * Reader comments.
 *
 * The public side of the API accepts comments on an article (by id or slug) and
 * serves back approved comments only. Comments publish immediately by default —
 * a small newsroom cannot babysit a queue — but setting
 * `COMMENTS_REQUIRE_APPROVAL=true` flips new comments to `pending` so an editor
 * clears them first. Either way the newsroom can hide or delete a comment from
 * the admin endpoints below.
 */

const MAX_LINKS = 2;
const WINDOW_MS = 10 * 60 * 1000; // per-IP throttle window
const MAX_PER_WINDOW = 5;

const requiresApproval = () =>
  String(process.env.COMMENTS_REQUIRE_APPROVAL || '').trim().toLowerCase() === 'true';

/** In-memory per-IP throttle: enough to stop drive-by spam, no extra deps. */
const recentPosts = new Map();

const throttled = (key) => {
  const now = Date.now();
  const hits = (recentPosts.get(key) || []).filter((t) => now - t < WINDOW_MS);
  if (hits.length >= MAX_PER_WINDOW) {
    recentPosts.set(key, hits);
    return true;
  }
  hits.push(now);
  recentPosts.set(key, hits);
  // Opportunistic cleanup so the map cannot grow forever.
  if (recentPosts.size > 5000) {
    for (const [k, v] of recentPosts) {
      if (!v.some((t) => now - t < WINDOW_MS)) recentPosts.delete(k);
    }
  }
  return false;
};

const countLinks = (text) => (text.match(/https?:\/\/|www\./gi) || []).length;

/** Accept either an ObjectId or a slug so the website can post from the article URL. */
const findArticle = async (idOrSlug) => {
  if (!idOrSlug) return null;
  if (mongoose.Types.ObjectId.isValid(String(idOrSlug))) {
    const byId = await Article.findById(idOrSlug).select('_id slug');
    if (byId) return byId;
  }
  return Article.findOne({ slug: idOrSlug }).select('_id slug');
};

/** Recompute the denormalised counter the cards and article page read. */
const refreshCommentCount = async (articleId) => {
  const commentCount = await Comment.countDocuments({ article: articleId, status: 'approved' });
  await Article.findByIdAndUpdate(articleId, { commentCount });
  return commentCount;
};

const badRequest = (res, message) => {
  res.status(400);
  throw new Error(message);
};

// GET /api/articles/:articleId/comments — public, approved comments only.
const getArticleComments = asyncHandler(async (req, res) => {
  const article = await findArticle(req.params.articleId);
  if (!article) {
    res.status(404);
    throw new Error('Article not found');
  }

  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);
  const filter = { article: article._id, status: 'approved' };

  const totalResults = await Comment.countDocuments(filter);
  const data = await Comment.find(filter)
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({
    data: data.map((comment) => comment.toPublicJSON()),
    page,
    totalPages: Math.ceil(totalResults / limit) || 0,
    totalResults,
  });
});

// POST /api/articles/:articleId/comments — public.
const createComment = asyncHandler(async (req, res) => {
  const article = await findArticle(req.params.articleId);
  if (!article) {
    res.status(404);
    throw new Error('Article not found');
  }

  const { name, email, body, honeypot } = req.body || {};

  // Hidden field only a bot would fill: accept silently, store nothing.
  if (honeypot) {
    return res.status(200).json({ ok: true, message: 'Thank you for your comment.' });
  }

  const cleanName = String(name || '').trim();
  const cleanBody = String(body || '').trim();

  if (cleanName.length < 2) badRequest(res, 'Please give a name of at least 2 characters');
  if (cleanBody.length < 2) badRequest(res, 'Please write a comment');
  if (cleanBody.length > 2000) badRequest(res, 'Comments are limited to 2000 characters');
  if (countLinks(cleanBody) > MAX_LINKS) {
    badRequest(res, `Please keep links to a maximum of ${MAX_LINKS} per comment`);
  }

  const key = req.ip || req.headers['x-forwarded-for'] || 'unknown';
  if (throttled(key)) {
    res.status(429);
    throw new Error('You are commenting too quickly — please try again in a few minutes');
  }

  const status = requiresApproval() ? 'pending' : 'approved';
  const comment = await Comment.create({
    article: article._id,
    name: cleanName,
    email: String(email || '').trim().slice(0, 200),
    body: cleanBody,
    status,
  });

  const commentCount = await refreshCommentCount(article._id);

  res.status(201).json({
    comment: comment.toPublicJSON(),
    commentCount,
    pending: status === 'pending',
    message:
      status === 'pending'
        ? 'Thank you — your comment has been sent to the newsroom for review.'
        : 'Thank you — your comment is now published.',
  });
});

// GET /api/comments — newsroom moderation list (all statuses).
const getComments = asyncHandler(async (req, res) => {
  const { status, article } = req.query;
  const filter = {};
  if (status && ['approved', 'pending', 'rejected'].includes(status)) filter.status = status;
  if (article) filter.article = article;

  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);

  const totalResults = await Comment.countDocuments(filter);
  const data = await Comment.find(filter)
    .populate('article', 'title slug')
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({
    data: data.map((comment) => ({
      ...comment.toPublicJSON(),
      email: comment.email,
      article: comment.article,
    })),
    page,
    totalPages: Math.ceil(totalResults / limit) || 0,
    totalResults,
    pendingCount: await Comment.countDocuments({ status: 'pending' }),
  });
});

// PUT /api/comments/:id/status — approve / hide a comment.
const updateCommentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body || {};
  if (!['approved', 'pending', 'rejected'].includes(status)) {
    badRequest(res, 'Status must be approved, pending or rejected');
  }

  const comment = await Comment.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );
  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  const commentCount = await refreshCommentCount(comment.article);
  res.json({ comment: { ...comment.toPublicJSON(), email: comment.email }, commentCount });
});

// DELETE /api/comments/:id — remove for good.
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findByIdAndDelete(req.params.id);
  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  await refreshCommentCount(comment.article);
  res.json({ message: 'Comment removed' });
});

module.exports = {
  getArticleComments,
  createComment,
  getComments,
  updateCommentStatus,
  deleteComment,
};
