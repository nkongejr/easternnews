const express = require('express');
const router = express.Router();
const c = require('../controllers/articleController');
const comments = require('../controllers/commentController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', c.getArticles);
router.get('/most-read', c.getMostRead);
router.get('/id/:id', protect, authorize('admin', 'editor'), c.getArticleById); // for admin edit forms

// Reader comments — public. Registered before /:slug so the article is looked up
// by id *or* slug (the website can post straight from the article URL).
router.get('/:articleId/comments', comments.getArticleComments);
router.post('/:articleId/comments', comments.createComment);

router.get('/:slug', c.getArticleBySlug);
router.post('/', protect, authorize('admin', 'editor'), c.createArticle);
router.put('/:id', protect, authorize('admin', 'editor'), c.updateArticle);
router.delete('/:id', protect, authorize('admin'), c.deleteArticle);

module.exports = router;