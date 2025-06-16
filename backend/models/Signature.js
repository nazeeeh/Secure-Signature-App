const mongoose = require('mongoose');

const SignatureSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  documentName: {
    type: String,
    required: true,
  },
  documentHash: {
    type: String,
    required: true,
  },
  signature: {
    type: String,
    required: true,
  },
  algorithm: {
    type: String,
    enum: ['RSA', 'ECC'],
    required: true,
  },
  publicKey: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Signature', SignatureSchema);