const asyncHandler = require('express-async-handler');
const streamifier = require('streamifier');
const slugify = require('slugify');
const cloudinary = require('../config/cloudinary');

const streamUpload = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => (result ? resolve(result) : reject(error))
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

// PDFs are stored as raw assets so Cloudinary returns the file untouched.
// NOTE: delivery of PDF/ZIP files must be enabled in the Cloudinary account
// (Settings → Security); otherwise the returned URL answers 401.
const streamUploadPdf = (buffer, folder, publicId) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'raw', public_id: publicId },
      (error, result) => (result ? resolve(result) : reject(error))
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

// @route POST /api/upload  (multipart/form-data, field name "image")
const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No image file uploaded');
  }

  const result = await streamUpload(req.file.buffer, 'eastern-newspaper');

  res.status(201).json({
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
  });
});

// @route POST /api/upload/pdf  (multipart/form-data, field name "file")
const uploadPdf = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No PDF file uploaded');
  }

  const name = slugify(
    String(req.file.originalname || 'issue').replace(/\.pdf$/i, '') || 'issue',
    { lower: true, strict: true }
  );
  const publicId = `${name || 'issue'}-${Date.now()}`;

  const result = await streamUploadPdf(
    req.file.buffer,
    'eastern-newspaper/publications',
    publicId
  );

  res.status(201).json({
    url: result.secure_url,
    publicId: result.public_id,
    bytes: result.bytes,
  });
});

module.exports = { uploadImage, uploadPdf };
