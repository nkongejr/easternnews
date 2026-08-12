const mongoose = require('mongoose');
const slugify = require('slugify');
require('./Category'); // ensure Category model is registered before we reference it below

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    caption: { type: String, default: '' },
    credit: { type: String, default: 'Photo KNA' },
  },
  { _id: false }
);

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    deck: { type: String, default: '' },
    body: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: mongoose.model('Category').schema.path('name').enumValues,
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
    bylineCredit: { type: String, default: 'Eastern Correspondent' },
    featuredImage: { type: imageSchema, required: true },
    gallery: [imageSchema],
    publishDate: { type: Date, default: Date.now },
    issue: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue' },
    isFeatured: { type: Boolean, default: false },
    isHero: { type: Boolean, default: false },
    tags: [{ type: String }],
    relatedArticles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }],
    status: { type: String, enum: ['draft', 'published'], default: 'published' },
    viewCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

articleSchema.index({ title: 'text', deck: 'text', body: 'text', tags: 'text' });

articleSchema.pre('validate', async function (next) {
  if (this.title && (!this.slug || this.isModified('title'))) {
    let baseSlug = slugify(this.title, { lower: true, strict: true });
    let slug = baseSlug;
    let count = 0;
    const Article = mongoose.model('Article');
    while (await Article.findOne({ slug, _id: { $ne: this._id } })) {
      count += 1;
      slug = `${baseSlug}-${count}`;
    }
    this.slug = slug;
  }
  next();
});

module.exports = mongoose.model('Article', articleSchema);