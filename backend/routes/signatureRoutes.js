const express = require('express');
const router = express.Router();
const signatureController = require('../controllers/signatureController');
const auth = require('../config/auth');

router.post('/sign', auth, signatureController.signDocument);
router.post('/verify', signatureController.verifySignature);
router.get('/', auth, signatureController.getSignatures);
router.get('/:id', auth, signatureController.getSignature);

module.exports = router;