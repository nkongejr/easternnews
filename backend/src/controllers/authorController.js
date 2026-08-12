const asyncHandler = require('express-async-handler');
const Author = require('../models/Author');

const getAuthors = asyncHandler(async (req, res) => {
  const authors = await Author.find().sort('name');
  res.json(authors);
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
  const author = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!author) { res.status(404); throw new Error('Author not found'); }
  res.json(author);
});

const deleteAuthor = asyncHandler(async (req, res) => {
  const author = await Author.findByIdAndDelete(req.params.id);
  if (!author) { res.status(404); throw new Error('Author not found'); }
  res.json({ message: 'Author removed' });
});

module.exports = { getAuthors, getAuthorBySlug, createAuthor, updateAuthor, deleteAuthor };