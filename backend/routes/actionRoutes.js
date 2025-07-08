const express = require('express');
const { getRecentActions } = require('../controllers/actionLogController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// ✅ Pass projectId in URL
router.get('/:projectId/recent', protect, getRecentActions);

module.exports = router;
