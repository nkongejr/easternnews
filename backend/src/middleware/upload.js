const multer = require('multer');

// Store file in memory as a buffer instead of writing to local disk —
// required since Render's filesystem is ephemeral, and we now stream
// straight to Cloudinary instead.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif/;
  const ok = allowed.test(file.mimetype);
  cb(ok ? null : new Error('Only image files are allowed'), ok);
};

module.exports = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });