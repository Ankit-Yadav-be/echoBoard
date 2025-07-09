const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getCommentsForTask,
  postCommentToTask,
} = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:taskId/comments', protect, getCommentsForTask);
router.post('/:taskId/comments', protect, postCommentToTask);

module.exports = router;
