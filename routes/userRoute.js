const express = require('express');
const router = express.Router();

// Import your controller functions
const { register, login } = require('../controllers/userController');

// Define routes
router.post('/register', register);
router.post('/login', login);

module.exports = router;
