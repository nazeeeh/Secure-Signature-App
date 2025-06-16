import axios from 'axios';

const API_URL = 'http://localhost:5000/api/signatures';

const signDocument = async (document, keyPairId, algorithm, documentName) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}/sign`, {
    document,
    keyPairId,
    algorithm,
    documentName
  }, {
    headers: {
      'x-auth-token': token
    }
  });
  
  return response.data;
};

const verifySignature = async (document, signature, publicKey, algorithm) => {
  const response = await axios.post(`${API_URL}/verify`, {
    document,
    signature,
    publicKey,
    algorithm
  });
  
  return response.data;
};

const getSignatures = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(API_URL, {
    headers: {
      'x-auth-token': token
    }
  });
  
  return response.data;
};

const getSignature = async (id) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: {
      'x-auth-token': token
    }
  });
  
  return response.data;
};

export default {
  signDocument,
  verifySignature,
  getSignatures,
  getSignature
};