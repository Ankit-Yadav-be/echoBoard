const express = require('express');
const router = express.Router();
const {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');


router.post('/createtask', protect, createTask);


router.get('/:projectId', protect, getAllTasks);


router.put('/:id', protect, updateTask);


router.delete('/:id', protect, deleteTask);

module.exports = router;
