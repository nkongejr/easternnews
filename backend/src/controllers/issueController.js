const asyncHandler = require('express-async-handler');
const Issue = require('../models/Issue');
const Article = require('../models/Article');

// Fields the public library needs. Article ObjectIds are deliberately not
// serialised for the listing — /issues/current populates them for the
// "Inside This Issue" strip instead.
const LIST_FIELDS = 'issueNumber title month year coverImage coverHeadline pdfUrl isCurrent createdAt updatedAt';

// Only these keys may reach the database from an admin request, so a stray
// payload can never overwrite timestamps or the articles array.
const EDITABLE_FIELDS = [
  'issueNumber',
  'title',
  'month',
  'year',
  'coverImage',
  'coverHeadline',
  'pdfUrl',
  'isCurrent',
  'articles',
];

const getIssues = asyncHandler(async (req, res) => {
  const issues = await Issue.find().select(LIST_FIELDS).sort({ issueNumber: -1 });
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

// Admin editor endpoint. Distinct from /:issueNumber so an ObjectId is never
// parsed as an issue number.
const getIssueById = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.id);
  if (!issue) { res.status(404); throw new Error('Issue not found'); }
  res.json(issue);
});

/**
 * Whitelist + normalise an admin payload. `pdfUrl` is only stored when it is a
 * full public link, because the library renders it as a download button.
 */
const buildPayload = (body = {}, res) => {
  const updates = {};
  EDITABLE_FIELDS.forEach((field) => {
    if (body[field] !== undefined) updates[field] = body[field];
  });

  if (updates.issueNumber !== undefined) updates.issueNumber = Number(updates.issueNumber);
  if (updates.year !== undefined) updates.year = Number(updates.year);

  if (updates.pdfUrl !== undefined) {
    const url = String(updates.pdfUrl || '').trim();
    // A public PDF is either hosted elsewhere (https://…) or added to this
    // site's own /public folder (a path such as /pdfs/issue-33.pdf).
    const isPublicLink = /^https?:\/\//i.test(url) || /^\/(?!\/)/.test(url);
    if (url && !isPublicLink) {
      res.status(400);
      throw new Error('PDF link must be a public address (https://…) or a site path starting with /');
    }
    updates.pdfUrl = url;
  }

  return updates;
};

const createIssue = asyncHandler(async (req, res) => {
  const payload = buildPayload(req.body, res);
  if (payload.isCurrent) {
    await Issue.updateMany({}, { isCurrent: false });
  }
  const issue = await Issue.create(payload);
  res.status(201).json(issue);
});

const updateIssue = asyncHandler(async (req, res) => {
  const updates = buildPayload(req.body, res);
  if (updates.isCurrent) {
    await Issue.updateMany({ _id: { $ne: req.params.id } }, { isCurrent: false });
  }
  const issue = await Issue.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!issue) { res.status(404); throw new Error('Issue not found'); }
  res.json(issue);
});

const deleteIssue = asyncHandler(async (req, res) => {
  const issue = await Issue.findByIdAndDelete(req.params.id);
  if (!issue) { res.status(404); throw new Error('Issue not found'); }
  // Stories stay published — they simply stop being credited to a removed edition.
  await Article.updateMany({ issue: issue._id }, { $unset: { issue: 1 } });
  res.json({ message: 'Issue removed' });
});

module.exports = {
  getIssues,
  getCurrentIssue,
  getIssueByNumber,
  getIssueById,
  createIssue,
  updateIssue,
  deleteIssue,
};
