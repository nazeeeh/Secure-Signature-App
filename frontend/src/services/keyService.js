import axios from 'axios';

const API_URL = 'http://localhost:5000/api/keys';

const generateKeyPair = async (algorithm) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(API_URL, {
    algorithm
  }, {
    headers: {
      'x-auth-token': token
    }
  });
  
  return response.data;
};

const getKeyPairs = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(API_URL, {
    headers: {
      'x-auth-token': token
    }
  });
  
  return response.data;
};

const getKeyPair = async (id) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: {
      'x-auth-token': token
    }
  });
  
  return response.data;
};

const deleteKeyPair = async (id) => {
  const token = localStorage.getItem('token');
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      'x-auth-token': token
    }
  });
  
  return response.data;
};

export default {
  generateKeyPair,
  getKeyPairs,
  getKeyPair,
  deleteKeyPair
};