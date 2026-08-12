const express = require('express');
const router = express.Router();
const c = require('../controllers/issueController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', c.getIssues);
router.get('/current', c.getCurrentIssue);
router.get('/:issueNumber', c.getIssueByNumber);
router.post('/', protect, authorize('admin', 'editor'), c.createIssue);
router.put('/:id', protect, authorize('admin', 'editor'), c.updateIssue);
router.delete('/:id', protect, authorize('admin'), c.deleteIssue);

module.exports = router;