import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Grid
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import SecurityIcon from '@mui/icons-material/Security';

const Home = () => {
  return (
    <Container maxWidth="lg">
      <Box textAlign="center" my={8}>
        <Typography variant="h2" gutterBottom>
          Secure Digital Signatures
        </Typography>
        <Typography variant="h5" color="textSecondary" paragraph>
          Protect your documents with cryptographic signatures using RSA or ECC algorithms
        </Typography>
        <Box mt={4}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            component={Link}
            to="/register"
            sx={{ mr: 2 }}
          >
            Get Started
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            component={Link}
            to="/login"
          >
            Login
          </Button>
        </Box>
      </Box>
      
      <Grid container spacing={4} my={6}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
            <LockIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Secure Signing
            </Typography>
            <Typography>
              Sign your documents using industry-standard cryptographic algorithms to ensure authenticity and integrity.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
            <FingerprintIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Multi-Factor Authentication
            </Typography>
            <Typography>
              Enhanced security with optional multi-factor authentication to protect your account and signatures.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
            <SecurityIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Easy Verification
            </Typography>
            <Typography>
              Quickly verify the authenticity of any signed document with just a few clicks.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;