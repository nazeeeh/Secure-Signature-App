const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../config/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify-mfa', authController.verifyMFA);
router.get('/setup-mfa', auth, authController.setupMFA);
router.post('/enable-mfa', auth, authController.enableMFA);
router.post('/disable-mfa', auth, authController.disableMFA);

module.exports = router;