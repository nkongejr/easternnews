const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', registerUser); // lock down/remove in production, or protect+authorize('admin')
router.post('/login', loginUser);
router.get('/me', protect, getMe);

module.exports = router;