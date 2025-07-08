const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getCommentsForTask,
  postCommentToTask,
} = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getCommentsForTask);
router.post('/', protect, postCommentToTask);

module.exports = router;
