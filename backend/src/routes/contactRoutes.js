const express = require('express');
const router = express.Router();
const c = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', c.sendContactMessage);
router.post('/newsletter', c.subscribeNewsletter);
router.get('/messages', protect, authorize('admin'), c.getMessages);

module.exports = router;