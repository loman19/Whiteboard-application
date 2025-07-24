const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signup', authController.signup); // changed from register to signup
router.post('/login', authController.login);

module.exports = router;
