const express = require("express");
const router = express.Router();

const {
  getCommentsForTask,
  postCommentToTask,
} = require("../controllers/commentController");

const { protect } = require("../middleware/authMiddleware");

router.get("/task/:taskId/comments", protect, getCommentsForTask);
router.post("/task/:taskId/comments", protect, postCommentToTask);

module.exports = router;
