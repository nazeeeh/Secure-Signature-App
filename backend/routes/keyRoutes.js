const express = require('express');
const router = express.Router();
const keyController = require('../controllers/keyController');
const auth = require('../config/auth');

router.post('/', auth, keyController.generateKeyPair);
router.get('/', auth, keyController.getKeyPairs);
router.get('/:id', auth, keyController.getKeyPair);
router.delete('/:id', auth, keyController.deleteKeyPair);

module.exports = router;