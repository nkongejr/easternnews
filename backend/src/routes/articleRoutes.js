const express = require('express');
const router = express.Router();
const c = require('../controllers/articleController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', c.getArticles);
router.get('/most-read', c.getMostRead);
router.get('/id/:id', protect, authorize('admin', 'editor'), c.getArticleById); // for admin edit forms
router.get('/:slug', c.getArticleBySlug);
router.post('/', protect, authorize('admin', 'editor'), c.createArticle);
router.put('/:id', protect, authorize('admin', 'editor'), c.updateArticle);
router.delete('/:id', protect, authorize('admin'), c.deleteArticle);

module.exports = router;