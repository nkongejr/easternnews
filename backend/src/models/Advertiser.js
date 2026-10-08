const mongoose = require('mongoose');
const slugify = require('slugify');

const advertiserSchema = new mongoose.Schema(
  {
    businessName: { type: String, required: true },
    slug: { type: String, unique: true },
    category: {
      type: String,
      enum: ['Hotel', 'TVET/College', 'University', 'Security Services', 'Other'],
      default: 'Other',
    },
    logo: { type: String, default: '' },
    description: { type: String, default: '' },
    contact: {
      phone: { type: String, default: '' },
      email: { type: String, default: '' },
      address: { type: String, default: '' },
    },
    /**
     * Where the advert runs on the website:
     *   sidebar          — module in the right-hand rail
     *   banner           — full-width strip on the homepage
     *   sponsored-post   — sponsored card inside editorial grids
     *   article-inline   — boxed advert inside the story body
     *   article-overlay  — floating bar that sits over the article while reading
     */
    adPlacement: {
      type: String,
      enum: ['sidebar', 'banner', 'sponsored-post', 'article-inline', 'article-overlay'],
      default: 'sidebar',
    },
    linkURL: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

advertiserSchema.pre('validate', function (next) {
  if (this.businessName && !this.slug) {
    this.slug = slugify(this.businessName, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Advertiser', advertiserSchema);