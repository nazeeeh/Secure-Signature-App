import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Paper,
  Container,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
  Alert
} from '@mui/material';
import keyService from '../../services/keyService';

const GenerateKey = () => {
  const navigate = useNavigate();
  const [algorithm, setAlgorithm] = useState('RSA');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');
      await keyService.generateKeyPair(algorithm);
      setSuccess('Key pair generated successfully!');
      setTimeout(() => {
        navigate('/keys');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to generate key pair');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Generate New Key Pair</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/keys')}
        >
          Back to Keys
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}
      
      <Paper sx={{ p: 4 }}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Select Algorithm</FormLabel>
          <RadioGroup
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            sx={{ mt: 2, mb: 3 }}
          >
            <FormControlLabel
              value="RSA"
              control={<Radio />}
              label="RSA (Recommended for most use cases)"
            />
            <FormControlLabel
              value="ECC"
              control={<Radio />}
              label="ECC (Elliptic Curve Cryptography - More efficient)"
            />
          </RadioGroup>
        </FormControl>
        
        <Box mt={4}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSubmit}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={24} /> : null}
          >
            Generate Key Pair
          </Button>
        </Box>
      </Paper>
      
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          About Key Algorithms
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>RSA</strong> (Rivest-Shamir-Adleman) is one of the first public-key cryptosystems and is widely used for secure data transmission. It's based on the practical difficulty of factoring the product of two large prime numbers.
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>ECC</strong> (Elliptic Curve Cryptography) is an approach to public-key cryptography based on the algebraic structure of elliptic curves over finite fields. ECC requires smaller keys compared to non-EC cryptography to provide equivalent security.
        </Typography>
      </Box>
    </Container>
  );
};

export default GenerateKey;