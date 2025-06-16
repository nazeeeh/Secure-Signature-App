import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Paper,
  Container,
  TextField,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import keyService from '../../services/keyService';
import signatureService from '../../services/signatureService';

const SignDocument = () => {
  const navigate = useNavigate();
  const [document, setDocument] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [keyPairId, setKeyPairId] = useState('');
  const [algorithm, setAlgorithm] = useState('RSA');
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'text/*': ['.txt', '.doc', '.docx', '.pdf'],
      'application/*': ['.pdf', '.doc', '.docx']
    },
    maxFiles: 1,
    onDrop: acceptedFiles => {
      const file = acceptedFiles[0];
      setDocumentName(file.name);
      
      const reader = new FileReader();
      reader.onload = () => {
        setDocument(reader.result);
      };
      reader.readAsText(file);
    }
  });

  // Fetch user's key pairs
  React.useEffect(() => {
    const fetchKeys = async () => {
      try {
        const result = await keyService.getKeyPairs();
        setKeys(result);
      } catch (err) {
        setError(err.message || 'Failed to fetch keys');
      }
    };

    fetchKeys();
  }, []);

  const handleSubmit = async () => {
    if (!document) {
      setError('Please upload a document');
      return;
    }

    if (!keyPairId) {
      setError('Please select a key pair');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await signatureService.signDocument(document, keyPairId, algorithm, documentName);
      setSuccess('Document signed successfully!');
      setTimeout(() => {
        navigate('/signatures');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to sign document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Sign Document</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/signatures')}
        >
          Back to Signatures
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
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <div {...getRootProps({ className: 'dropzone' })} style={{
              border: '2px dashed #ccc',
              borderRadius: '4px',
              padding: '20px',
              textAlign: 'center',
              cursor: 'pointer'
            }}>
              <input {...getInputProps()} />
              <Typography>
                {documentName || 'Drag & drop a document here, or click to select'}
              </Typography>
            </div>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Key Pair</InputLabel>
              <Select
                value={keyPairId}
                onChange={(e) => setKeyPairId(e.target.value)}
                label="Key Pair"
              >
                {keys.map((key) => (
                  <MenuItem key={key._id} value={key._id}>
                    {key.algorithm} - {key.publicKey.substring(0, 20)}...
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Algorithm</InputLabel>
              <Select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                label="Algorithm"
              >
                <MenuItem value="RSA">RSA</MenuItem>
                <MenuItem value="ECC">ECC</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          {document && (
            <Grid item xs={12}>
              <TextField
                label="Document Preview"
                fullWidth
                multiline
                rows={6}
                value={document}
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
          )}
        </Grid>
        
        <Box mt={4} display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSubmit}
            disabled={loading || !document || !keyPairId}
            startIcon={loading ? <CircularProgress size={24} /> : null}
          >
            Sign Document
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignDocument;