const crypto = require('crypto');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

// RSA Key Generation
const generateRSAKeys = () => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  });
  
  return { publicKey, privateKey };
};

// ECC Key Generation
const generateECCKeys = () => {
  const keyPair = ec.genKeyPair();
  const publicKey = keyPair.getPublic('hex');
  const privateKey = keyPair.getPrivate('hex');
  
  return { publicKey, privateKey };
};

// RSA Sign
const signWithRSA = (privateKey, data) => {
  const signer = crypto.createSign('SHA256');
  signer.update(data);
  signer.end();
  return signer.sign(privateKey, 'base64');
};

// ECC Sign
const signWithECC = (privateKey, data) => {
  const keyPair = ec.keyFromPrivate(privateKey, 'hex');
  const hash = crypto.createHash('sha256').update(data).digest('hex');
  const signature = keyPair.sign(hash);
  return {
    r: signature.r.toString('hex'),
    s: signature.s.toString('hex'),
    recoveryParam: signature.recoveryParam
  };
};

// RSA Verify
const verifyWithRSA = (publicKey, data, signature) => {
  const verifier = crypto.createVerify('SHA256');
  verifier.update(data);
  verifier.end();
  return verifier.verify(publicKey, signature, 'base64');
};

// ECC Verify
const verifyWithECC = (publicKey, data, signature) => {
  const keyPair = ec.keyFromPublic(publicKey, 'hex');
  const hash = crypto.createHash('sha256').update(data).digest('hex');
  return keyPair.verify(hash, signature);
};

// Generate document hash
const generateDocumentHash = (document) => {
  return crypto.createHash('sha256').update(document).digest('hex');
};

module.exports = {
  generateRSAKeys,
  generateECCKeys,
  signWithRSA,
  signWithECC,
  verifyWithRSA,
  verifyWithECC,
  generateDocumentHash
};