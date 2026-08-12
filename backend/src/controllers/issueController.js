const asyncHandler = require('express-async-handler');
const Issue = require('../models/Issue');

const getIssues = asyncHandler(async (req, res) => {
  const issues = await Issue.find().sort({ issueNumber: -1 });
  res.json(issues);
});

const getCurrentIssue = asyncHandler(async (req, res) => {
  const issue = await Issue.findOne({ isCurrent: true })
    .populate({ path: 'articles', select: 'title slug category featuredImage isHero publishDate' });
  if (!issue) { res.status(404); throw new Error('No current issue set'); }
  res.json(issue);
});

const getIssueByNumber = asyncHandler(async (req, res) => {
  const issue = await Issue.findOne({ issueNumber: req.params.issueNumber })
    .populate({ path: 'articles', select: 'title slug category featuredImage isHero publishDate' });
  if (!issue) { res.status(404); throw new Error('Issue not found'); }
  res.json(issue);
});

const createIssue = asyncHandler(async (req, res) => {
  if (req.body.isCurrent) {
    await Issue.updateMany({}, { isCurrent: false });
  }
  const issue = await Issue.create(req.body);
  res.status(201).json(issue);
});

const updateIssue = asyncHandler(async (req, res) => {
  if (req.body.isCurrent) {
    await Issue.updateMany({}, { isCurrent: false });
  }
  const issue = await Issue.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!issue) { res.status(404); throw new Error('Issue not found'); }
  res.json(issue);
});

const deleteIssue = asyncHandler(async (req, res) => {
  const issue = await Issue.findByIdAndDelete(req.params.id);
  if (!issue) { res.status(404); throw new Error('Issue not found'); }
  res.json({ message: 'Issue removed' });
});

module.exports = { getIssues, getCurrentIssue, getIssueByNumber, createIssue, updateIssue, deleteIssue };