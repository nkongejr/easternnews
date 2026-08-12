const express = require('express');
const router = express.Router();
const c = require('../controllers/advertiserController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', c.getAdvertisers);
router.get('/id/:id', protect, authorize('admin'), c.getAdvertiserById);
router.get('/:slug', c.getAdvertiserBySlug);
router.post('/', protect, authorize('admin'), c.createAdvertiser);
router.put('/:id', protect, authorize('admin'), c.updateAdvertiser);
router.delete('/:id', protect, authorize('admin'), c.deleteAdvertiser);

module.exports = router;