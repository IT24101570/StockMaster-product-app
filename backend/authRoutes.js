const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { validateRegister, validateLogin } = require('../utils/validators');

router.post('/register', validateRegister, validate, registerUser);
router.post('/login', validateLogin, validate, loginUser);
router.get('/profile', protect, getMe);

module.exports = router;