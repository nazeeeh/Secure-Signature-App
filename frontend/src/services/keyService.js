import axios from 'axios';

const API_URL = 'http://localhost:5000/api/keys';

const generateKeyPair = async (algorithm) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.post(API_URL, { algorithm }, {
      headers: { 'x-auth-token': token }
    });
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: err.message || 'Failed to generate key pair' };
  }
};

const getKeyPairs = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get(API_URL, {
      headers: { 'x-auth-token': token }
    });
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: err.message || 'Failed to fetch key pairs' };
  }
};

const getKeyPair = async (id) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: { 'x-auth-token': token }
    });
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: err.message || 'Failed to fetch key pair' };
  }
};

const deleteKeyPair = async (id) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: { 'x-auth-token': token }
    });
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: err.message || 'Failed to delete key pair' };
  }
};

export default {
  generateKeyPair,
  getKeyPairs,
  getKeyPair,
  deleteKeyPair
};