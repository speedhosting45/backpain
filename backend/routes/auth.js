const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { 
  registerValidation, 
  loginValidation, 
  handleValidationErrors 
} = require('../middleware/validation');

// POST /api/auth/register
router.post('/register', registerValidation, handleValidationErrors, register);

// POST /api/auth/login
router.post('/login', loginValidation, handleValidationErrors, login);

module.exports = router;
