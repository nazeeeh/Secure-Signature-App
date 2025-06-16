const Signature = require('../models/Signature');
const KeyPair = require('../models/KeyPair');
const { 
  signWithRSA, 
  signWithECC, 
  verifyWithRSA, 
  verifyWithECC,
  generateDocumentHash
} = require('../utils/cryptoUtils');

// Sign a document
exports.signDocument = async (req, res) => {
  try {
    const { document, keyPairId, algorithm } = req.body;
    
    // Get key pair
    const keyPair = await KeyPair.findOne({
      _id: keyPairId,
      userId: req.user.id
    });
    
    if (!keyPair) {
      return res.status(404).json({ message: 'Key pair not found' });
    }
    
    // Generate document hash
    const documentHash = generateDocumentHash(document);
    
    let signature;
    
    // Sign based on algorithm
    if (algorithm === 'RSA') {
      signature = signWithRSA(keyPair.privateKey, documentHash);
    } else if (algorithm === 'ECC') {
      signature = signWithECC(keyPair.privateKey, documentHash);
    } else {
      return res.status(400).json({ message: 'Invalid algorithm' });
    }
    
    // Save signature
    const newSignature = new Signature({
      userId: req.user.id,
      documentName: req.body.documentName || 'Untitled Document',
      documentHash,
      signature: JSON.stringify(signature),
      algorithm,
      publicKey: keyPair.publicKey
    });
    
    await newSignature.save();
    
    res.status(201).json({
      id: newSignature._id,
      documentName: newSignature.documentName,
      documentHash,
      signature,
      algorithm,
      publicKey: keyPair.publicKey,
      createdAt: newSignature.createdAt
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Verify a signature
exports.verifySignature = async (req, res) => {
  try {
    const { document, signature, publicKey, algorithm } = req.body;
    
    // Generate document hash
    const documentHash = generateDocumentHash(document);
    
    let isValid;
    
    // Verify based on algorithm
    if (algorithm === 'RSA') {
      isValid = verifyWithRSA(publicKey, documentHash, signature);
    } else if (algorithm === 'ECC') {
      isValid = verifyWithECC(publicKey, documentHash, JSON.parse(signature));
    } else {
      return res.status(400).json({ message: 'Invalid algorithm' });
    }
    
    res.status(200).json({ isValid });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get user's signatures
exports.getSignatures = async (req, res) => {
  try {
    const signatures = await Signature.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .select('-userId -__v');
    
    res.status(200).json(signatures);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get signature by ID
exports.getSignature = async (req, res) => {
  try {
    const signature = await Signature.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!signature) {
      return res.status(404).json({ message: 'Signature not found' });
    }
    
    res.status(200).json({
      id: signature._id,
      documentName: signature.documentName,
      documentHash: signature.documentHash,
      signature: JSON.parse(signature.signature),
      algorithm: signature.algorithm,
      publicKey: signature.publicKey,
      createdAt: signature.createdAt
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};