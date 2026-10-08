const mongoose = require('mongoose');

/**
 * A reader comment on a single article.
 *
 * Comments are deliberately small: a display name, an optional email that is
 * never returned by the public API, and the text. `status` lets the newsroom
 * hold a comment back without losing it — the public endpoint only ever serves
 * `approved` documents.
 */
const commentSchema = new mongoose.Schema(
  {
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Article',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'A name is required'],
      trim: true,
      minlength: [2, 'Please give a name of at least 2 characters'],
      maxlength: [80, 'Names are limited to 80 characters'],
    },
    /** Never exposed publicly — kept only so the newsroom can follow up. */
    email: {
      type: String,
      default: '',
      trim: true,
      lowercase: true,
      maxlength: 200,
    },
    body: {
      type: String,
      required: [true, 'A comment is required'],
      trim: true,
      minlength: [2, 'Please write a comment of at least 2 characters'],
      maxlength: [2000, 'Comments are limited to 2000 characters'],
    },
    status: {
      type: String,
      enum: ['approved', 'pending', 'rejected'],
      default: 'approved',
      index: true,
    },
  },
  { timestamps: true }
);

// Every reader-facing query is "approved comments for this article, newest
// first" — one compound index covers the list and the counter.
commentSchema.index({ article: 1, status: 1, createdAt: -1 });

/** Shape safe to hand to the public API or the website (no email, no refs). */
commentSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    _id: this._id,
    name: this.name,
    body: this.body,
    status: this.status,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('Comment', commentSchema);
