const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createProject,
  getMyProjects,
  addUserToProject,
  removeUserFromProject, 
  getProjectMembers,
} = require('../controllers/projectController');


router.post('/', protect, createProject);


router.get('/my', protect, getMyProjects);


router.post('/:projectId/add-member', protect, addUserToProject);


router.delete('/:projectId/remove-member', protect, removeUserFromProject);


router.get('/:projectId/members', protect, getProjectMembers);

module.exports = router;
