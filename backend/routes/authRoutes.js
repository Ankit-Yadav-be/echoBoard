
const express = require('express');
const { registerUser, loginUser, getAllUsers } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login',protect, loginUser);
router.get('/users', protect, getAllUsers);

module.exports = router;
