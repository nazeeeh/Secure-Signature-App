import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Container,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Tab,
  Tabs
} from '@mui/material';
import keyService from '../../services/keyService';
import useAuth from '../../hooks/useAuth';

const KeyDetail = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [keyPair, setKeyPair] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchKey = async () => {
        try {
          const result = await keyService.getKeyPair(id);
          setKeyPair(result);
          setLoading(false);
        } catch (err) {
          setError(err.message || 'Failed to fetch key');
          setLoading(false);
        }
      };

      fetchKey();
    }
  }, [id, isAuthenticated]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!keyPair) {
    return (
      <Container maxWidth="lg">
        <Alert severity="warning">Key pair not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Key Pair Details - {keyPair.algorithm}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/keys"
        >
          Back to Keys
        </Button>
      </Box>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Created: {new Date(keyPair.createdAt).toLocaleString()}
        </Typography>
      </Paper>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Public Key" />
          <Tab label="Private Key" />
        </Tabs>
      </Box>
      
      <Paper sx={{ p: 3, mt: 2 }}>
        {tabValue === 0 && (
          <TextField
            label="Public Key"
            fullWidth
            multiline
            rows={8}
            value={keyPair.publicKey}
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}
          />
        )}
        {tabValue === 1 && (
          <>
            <Alert severity="warning" sx={{ mb: 2 }}>
              Keep your private key secure! Never share it with anyone.
            </Alert>
            <TextField
              label="Private Key"
              fullWidth
              multiline
              rows={8}
              value={keyPair.privateKey}
              variant="outlined"
              InputProps={{
                readOnly: true,
              }}
            />
          </>
        )}
      </Paper>
    </Container>
  );
};

export default KeyDetail;