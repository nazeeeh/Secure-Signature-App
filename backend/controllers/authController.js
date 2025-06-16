const User = require('../models/User');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const bcrypt = require('bcryptjs');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    user = new User({ username, email, password });
    await user.save();
    
    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });
    
    res.status(201).json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check if MFA is enabled
    if (user.isMfaEnabled) {
      return res.status(200).json({ mfaRequired: true, tempToken: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '5m' }) });
    }
    
    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });
    
    res.status(200).json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Verify MFA token
exports.verifyMFA = async (req, res) => {
  try {
    const { token, tempToken } = req.body;
    
    // Verify temp token
    const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid token' });
    }
    
    // Verify MFA token
    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token
    });
    
    if (!verified) {
      return res.status(400).json({ message: 'Invalid MFA token' });
    }
    
    // Generate final token
    const finalToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });
    
    res.status(200).json({ token: finalToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Setup MFA
exports.setupMFA = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Generate MFA secret
    const  secret = speakeasy.generateSecret({
      name: `SecureSign:${user.email}`
    });
    
    // Generate QR code
    qrcode.toDataURL(secret.otpauth_url, async (err, imageUrl) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error generating QR code');
      }
      
      // Save secret temporarily (not enabling MFA yet)
      user.mfaSecret = secret.base32;
      await user.save();
      
      res.status(200).json({ secret: secret.base32, qrCode: imageUrl });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Enable MFA
exports.enableMFA = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user.mfaSecret) {
      return res.status(400).json({ message: 'Setup MFA first' });
    }
    
    // Verify token
    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token
    });
    
    if (!verified) {
      return res.status(400).json({ message: 'Invalid MFA token' });
    }
    
    // Enable MFA
    user.isMfaEnabled = true;
    await user.save();
    
    res.status(200).json({ message: 'MFA enabled successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Disable MFA
exports.disableMFA = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    user.mfaSecret = null;
    user.isMfaEnabled = false;
    await user.save();
    
    res.status(200).json({ message: 'MFA disabled successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};