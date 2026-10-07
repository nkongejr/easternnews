const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const uploadPdf = require('../middleware/uploadPdf');
const { uploadImage, uploadPdf: uploadPdfFile } = require('../controllers/uploadController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('admin', 'editor'), upload.single('image'), uploadImage);
router.post('/pdf', protect, authorize('admin', 'editor'), uploadPdf.single('file'), uploadPdfFile);

module.exports = router;
