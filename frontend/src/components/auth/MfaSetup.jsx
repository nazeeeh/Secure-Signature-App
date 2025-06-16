import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  CircularProgress
} from '@mui/material';
import {QRCodeCanvas} from 'qrcode.react';
import authService from '../../services/authService';
import useAuth from '../../hooks/useAuth';

const MfaSetup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [qrCodeData, setQrCodeData] = useState('');
  const [secret, setSecret] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const setupMFA = async () => {
      try {
        const result = await authService.setupMFA();
        setQrCodeData(result.qrCode);
        setSecret(result.secret);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to setup MFA');
        setLoading(false);
      }
    };

    setupMFA();
  }, []);

  const handleEnableMFA = async () => {
    try {
      await authService.enableMFA(token);
      setSuccess('MFA enabled successfully');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to enable MFA');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xs">
        <Paper elevation={3} sx={{ p: 4, mt: 8, textAlign: 'center' }}>
          <CircularProgress />
          <Typography mt={2}>Setting up MFA...</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Setup Multi-Factor Authentication
        </Typography>
        {error && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        {success && (
          <Typography color="success" align="center" sx={{ mb: 2 }}>
            {success}
          </Typography>
        )}
        <Box textAlign="center" my={3}>
          <QRCodeCanvas value={qrCodeData} size={200} />
        </Box>
        <Typography variant="body1" align="center" gutterBottom>
          Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
        </Typography>
        <Typography variant="body2" align="center" gutterBottom>
          Or enter this secret manually: {secret}
        </Typography>
        <Box mt={3}>
          <TextField
            label="Verification Code"
            fullWidth
            value={token}
            onChange={(e) => setToken(e.target.value)}
            margin="normal"
            variant="outlined"
          />
          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleEnableMFA}
            >
              Enable MFA
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default MfaSetup;