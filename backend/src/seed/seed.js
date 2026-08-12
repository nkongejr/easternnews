require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const Category = require('../models/Category');
const Author = require('../models/Author');
const Article = require('../models/Article');
const Advertiser = require('../models/Advertiser');
const Issue = require('../models/Issue');
const User = require('../models/User');

const { categories, authors, articles, advertisers, issueMeta } = require('./seedData');

const destroy = process.argv.includes('--destroy');

const run = async () => {
  await connectDB();

  if (destroy) {
    await Promise.all([
      Category.deleteMany(),
      Author.deleteMany(),
      Article.deleteMany(),
      Advertiser.deleteMany(),
      Issue.deleteMany(),
    ]);
    console.log('🗑  All content collections cleared.');
    process.exit(0);
  }

  console.log('🌱 Seeding database...');

  // 1. Categories
  await Category.deleteMany();
  const createdCategories = await Category.insertMany(categories);
  console.log(`✅ ${createdCategories.length} categories created`);

  // 2. Authors
  await Author.deleteMany();
  const createdAuthors = await Author.insertMany(authors);
  console.log(`✅ ${createdAuthors.length} authors created`);
  const authorMap = {};
  createdAuthors.forEach((a) => { authorMap[a.name] = a._id; });

  // 3. Articles
  await Article.deleteMany();
  const articleDocs = articles.map(({ authorName, ...rest }) => ({
    ...rest,
    author: authorMap[authorName] || null,
    status: 'published',
  }));
  const createdArticles = await Article.insertMany(articleDocs);
  console.log(`✅ ${createdArticles.length} articles created`);

  // Link a few related articles per county for the "related articles" feature
  for (const article of createdArticles) {
    const related = createdArticles
      .filter((a) => a.category === article.category && String(a._id) !== String(article._id))
      .slice(0, 3)
      .map((a) => a._id);
    article.relatedArticles = related;
    await article.save();
  }
  console.log('🔗 Related articles linked');

  // 4. Advertisers
  await Advertiser.deleteMany();
  const createdAdvertisers = await Advertiser.insertMany(advertisers);
  console.log(`✅ ${createdAdvertisers.length} advertisers created`);

  // 5. Issue
  await Issue.deleteMany();
  const issue = await Issue.create({
    ...issueMeta,
    articles: createdArticles.map((a) => a._id),
  });
  await Article.updateMany({}, { issue: issue._id });
  console.log(`✅ Issue "${issue.title}" created with ${issue.articles.length} articles`);

  // 6. Default admin user
  const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (!adminExists) {
    await User.create({
      name: process.env.ADMIN_NAME || 'Newsroom Admin',
      email: process.env.ADMIN_EMAIL || 'admin@easternnewspaper.co.ke',
      password: process.env.ADMIN_PASSWORD || 'ChangeMe123!',
      role: 'admin',
    });
    console.log(`✅ Admin user created: ${process.env.ADMIN_EMAIL}`);
  } else {
    console.log('ℹ️  Admin user already exists, skipping creation');
  }

  console.log('🎉 Seeding complete!');
  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});