import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

const register = async (username, email, password) => {
  const response = await axios.post(`${API_URL}/register`, {
    username,
    email,
    password
  });
  
  return response.data;
};

const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, {
    email,
    password
  });
  
  return response.data;
};

const verifyMFA = async (token, tempToken) => {
  const response = await axios.post(`${API_URL}/verify-mfa`, {
    token,
    tempToken
  });
  
  return response.data;
};

const setupMFA = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/setup-mfa`, {
    headers: {
      'x-auth-token': token
    }
  });
  
  return response.data;
};

const enableMFA = async (token) => {
  const authToken = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}/enable-mfa`, {
    token
  }, {
    headers: {
      'x-auth-token': authToken
    }
  });
  
  return response.data;
};

const disableMFA = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}/disable-mfa`, {}, {
    headers: {
      'x-auth-token': token
    }
  });
  
  return response.data;
};

export default {
  register,
  login,
  verifyMFA,
  setupMFA,
  enableMFA,
  disableMFA
};