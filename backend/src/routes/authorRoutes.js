const express = require('express');
const router = express.Router();
const c = require('../controllers/authorController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', c.getAuthors);
router.get('/:slug', c.getAuthorBySlug);
router.post('/', protect, authorize('admin', 'editor'), c.createAuthor);
router.put('/:id', protect, authorize('admin', 'editor'), c.updateAuthor);
router.delete('/:id', protect, authorize('admin'), c.deleteAuthor);

module.exports = router;