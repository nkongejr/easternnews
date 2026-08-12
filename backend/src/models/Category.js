const mongoose = require('mongoose');
const slugify = require('slugify');

const CATEGORY_NAMES = [
  'Meru', 'Tharaka Nithi', 'Isiolo', 'Embu', 'Samburu', 'Kirinyaga',
  'Laikipia', 'Kitui', 'Machakos', 'Makueni', 'Marsabit',
  'Business', 'Sports', 'Opinion', 'Editorial', 'National',
];

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, enum: CATEGORY_NAMES },
    slug: { type: String, unique: true },
    description: { type: String, default: '' },
    heroImage: { type: String, default: '' },
    colorAccent: { type: String, default: '#1a4d8f' }, // per-county color tag
    type: { type: String, enum: ['county', 'section'], default: 'county' },
  },
  { timestamps: true }
);

categorySchema.pre('validate', function (next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

categorySchema.statics.CATEGORY_NAMES = CATEGORY_NAMES;

module.exports = mongoose.model('Category', categorySchema);