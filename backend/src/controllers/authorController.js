const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const Author = require('../models/Author');

const getAuthors = asyncHandler(async (req, res) => {
  const authors = await Author.find().sort('name');
  res.json(authors);
});

const getAuthorById = asyncHandler(async (req, res) => {
  const author = await Author.findById(req.params.id);
  if (!author) { res.status(404); throw new Error('Author not found'); }
  res.json(author);
});

const getAuthorBySlug = asyncHandler(async (req, res) => {
  const author = await Author.findOne({ slug: req.params.slug });
  if (!author) { res.status(404); throw new Error('Author not found'); }
  res.json(author);
});

const createAuthor = asyncHandler(async (req, res) => {
  const author = await Author.create(req.body);
  res.status(201).json(author);
});

const updateAuthor = asyncHandler(async (req, res) => {
  const updates = { ...req.body };
  // findByIdAndUpdate does not run the schema's validate hook, so keep the
  // public profile URL in sync when an editor changes the author's name.
  if (updates.name) updates.slug = slugify(updates.name, { lower: true, strict: true });
  const author = await Author.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!author) { res.status(404); throw new Error('Author not found'); }
  res.json(author);
});

const deleteAuthor = asyncHandler(async (req, res) => {
  const author = await Author.findByIdAndDelete(req.params.id);
  if (!author) { res.status(404); throw new Error('Author not found'); }
  res.json({ message: 'Author removed' });
});

module.exports = { getAuthors, getAuthorById, getAuthorBySlug, createAuthor, updateAuthor, deleteAuthor };