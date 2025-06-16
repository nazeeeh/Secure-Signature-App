import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // You might want to verify the token with the server here
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

   const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      
      if (response.mfaRequired) {
        return { mfaRequired: true, tempToken: response.tempToken };
      }
      
      localStorage.setItem('token', response.token);
      setIsAuthenticated(true);
      setUser(response.user);
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    }
  };

  const verifyMFA = async (token, tempToken) => {
    try {
      const response = await authService.verifyMFA(token, tempToken);
      localStorage.setItem('token', response.token);
      setIsAuthenticated(true);
      setUser(response.user);
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, message: err.response?.data?.message || 'MFA verification failed' };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await authService.register(username, email, password);
      localStorage.setItem('token', response.token);
      setIsAuthenticated(true);
      setUser(response.user);
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, message: err.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        verifyMFA,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;