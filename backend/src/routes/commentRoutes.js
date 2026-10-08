const express = require('express');
const router = express.Router();
const c = require('../controllers/commentController');
const { protect, authorize } = require('../middleware/auth');

// Newsroom moderation. Reader-facing create/list endpoints live on
// /api/articles/:articleId/comments so they sit with the article they belong to.
router.get('/', protect, authorize('admin', 'editor'), c.getComments);
router.put('/:id/status', protect, authorize('admin', 'editor'), c.updateCommentStatus);
router.delete('/:id', protect, authorize('admin'), c.deleteComment);

module.exports = router;
