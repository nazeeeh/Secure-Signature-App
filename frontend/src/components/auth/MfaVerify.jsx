import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container
} from '@mui/material';
import useAuth from '../../hooks/useAuth';

const MfaVerify = ({ tempToken }) => {
  const { verifyMFA } = useAuth();
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  const handleVerify = async () => {
    try {
      await verifyMFA(token, tempToken);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'MFA verification failed');
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Multi-Factor Authentication
        </Typography>
        {error && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Typography variant="body1" align="center" gutterBottom>
          Enter the 6-digit code from your authenticator app
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
              onClick={handleVerify}
            >
              Verify
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default MfaVerify;