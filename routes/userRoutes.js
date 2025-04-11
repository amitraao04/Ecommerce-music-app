const express = require('express');
const router = express.Router();
const { signupUser, loginUser,getProfile } = require('../controllers/userController');
const  {protect} = require('../middleware/authMiddleware');

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);

module.exports = router;
