const express = require('express');
const router = express.Router();
const c = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', c.getCategories);
router.get('/:slug', c.getCategoryBySlug);
router.post('/', protect, authorize('admin'), c.createCategory);
router.put('/:id', protect, authorize('admin'), c.updateCategory);
router.delete('/:id', protect, authorize('admin'), c.deleteCategory);

module.exports = router;