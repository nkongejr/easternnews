const mongoose = require('mongoose');
const slugify = require('slugify');

const authorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    title: { type: String, default: 'Staff Writer' }, // e.g. "Specialist in agricultural and economic matters"
    bio: { type: String },
    photo: { type: String, default: '' },
  },
  { timestamps: true }
);

authorSchema.pre('validate', function (next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Author', authorSchema);