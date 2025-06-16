const KeyPair = require('../models/KeyPair');
const { generateRSAKeys, generateECCKeys } = require('../utils/cryptoUtils');

// Generate new key pair
exports.generateKeyPair = async (req, res) => {
  try {
    const { algorithm } = req.body;
    
    let publicKey, privateKey;
    
    if (algorithm === 'RSA') {
      const keys = generateRSAKeys();
      publicKey = keys.publicKey;
      privateKey = keys.privateKey;
    } else if (algorithm === 'ECC') {
      const keys = generateECCKeys();
      publicKey = keys.publicKey;
      privateKey = keys.privateKey;
    } else {
      return res.status(400).json({ message: 'Invalid algorithm' });
    }
    
    // Save key pair
    const keyPair = new KeyPair({
      userId: req.user.id,
      algorithm,
      publicKey,
      privateKey
    });
    
    await keyPair.save();
    
    res.status(201).json({ 
      id: keyPair._id,
      algorithm,
      publicKey,
      privateKey,
      createdAt: keyPair.createdAt
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get user's key pairs
exports.getKeyPairs = async (req, res) => {
  try {
    const keyPairs = await KeyPair.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .select('-privateKey -userId -__v');
    
    res.status(200).json(keyPairs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get key pair by ID
exports.getKeyPair = async (req, res) => {
  try {
    const keyPair = await KeyPair.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!keyPair) {
      return res.status(404).json({ message: 'Key pair not found' });
    }
    
    res.status(200).json({
      id: keyPair._id,
      algorithm: keyPair.algorithm,
      publicKey: keyPair.publicKey,
      privateKey: keyPair.privateKey,
      createdAt: keyPair.createdAt
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Delete key pair
exports.deleteKeyPair = async (req, res) => {
  try {
    const keyPair = await KeyPair.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!keyPair) {
      return res.status(404).json({ message: 'Key pair not found' });
    }
    
    res.status(200).json({ message: 'Key pair deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};