const multer = require('multer');

// Issue PDFs are streamed straight to Cloudinary, so the file stays in memory
// and never touches Render's ephemeral disk.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const ok =
    file.mimetype === 'application/pdf' || /\.pdf$/i.test(file.originalname || '');
  cb(ok ? null : new Error('Only PDF files are allowed'), ok);
};

const parser = multer({ storage, fileFilter, limits: { fileSize: 30 * 1024 * 1024 } });

/**
 * Wrap multer so a rejected file (wrong type, too large) answers 400 rather
 * than falling through as a server error.
 */
const single = (field) => (req, res, next) =>
  parser.single(field)(req, res, (err) => {
    if (err) {
      res.status(400);
      return next(err);
    }
    next();
  });

module.exports = { single, parser };
