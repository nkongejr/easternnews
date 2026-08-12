const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema(
  {
    issueNumber: { type: Number, required: true, unique: true },
    title: { type: String, required: true }, // "Issue 32, April-May 2026"
    month: { type: String, required: true },
    year: { type: Number, required: true },
    coverImage: { type: String, default: '' },
    coverHeadline: { type: String, default: '' },
    articles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }],
    pdfUrl: { type: String, default: '' },
    isCurrent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Issue', issueSchema);