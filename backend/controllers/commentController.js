const Comment = require('../models/Comment');
const Task = require('../models/Task');

//  GET all comments for a task
const getCommentsForTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    console.log('🔹 GET Comments for task:', taskId);
    console.log('🔹 Authenticated User:', req.user);

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const task = await Task.findById(taskId).populate('assignedTo', '_id');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const isAuthorized =
      (task.assignedTo && task.assignedTo.equals(req.user._id)) ||
      task.creator.equals(req.user._id);

    if (!isAuthorized) {
      return res.status(403).json({ message: 'Not authorized for this task' });
    }

    const comments = await Comment.find({ task: taskId })
      .populate('user', 'name email')
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (err) {
    console.error(' Error fetching comments:', err);
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
};

//  POST a comment to a task
const postCommentToTask = async (req, res) => {
  const { taskId } = req.params;
  const { message } = req.body;



  if (!message || message.trim() === '') {
    return res.status(400).json({ message: 'Message cannot be empty' });
  }

  if (!req.user || !req.user._id) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    const task = await Task.findById(taskId).populate('assignedTo', '_id');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const isAuthorized =
      (task.assignedTo && task.assignedTo.equals(req.user._id)) ||
      task.creator.equals(req.user._id);

    if (!isAuthorized) {
      return res.status(403).json({ message: 'Not authorized to comment on this task' });
    }

    const comment = await Comment.create({
      task: taskId,
      user: req.user._id,
      message,
    });

    const populatedComment = await comment.populate('user', 'name email');
    res.status(201).json(populatedComment);
  } catch (err) {
    console.error(' Error posting comment:', err);
    res.status(500).json({ message: 'Failed to post comment' });
  }
};

module.exports = {
  getCommentsForTask,
  postCommentToTask,
};
