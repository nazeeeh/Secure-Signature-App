import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Container,
  TextField,
  CircularProgress,
  Alert,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import signatureService from '../../services/signatureService';

const VerifySignature = () => {
  const [document, setDocument] = useState('');
  const [signature, setSignature] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [algorithm, setAlgorithm] = useState('RSA');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);

  const { getRootProps: getDocRootProps, getInputProps: getDocInputProps } = useDropzone({
    accept: {
      'text/*': ['.txt', '.doc', '.docx', '.pdf'],
      'application/*': ['.pdf', '.doc', '.docx']
    },
    maxFiles: 1,
    onDrop: acceptedFiles => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = () => {
        setDocument(reader.result);
      };
      reader.readAsText(file);
    }
  });

  const { getRootProps: getSigRootProps, getInputProps: getSigInputProps } = useDropzone({
    maxFiles: 1,
    onDrop: acceptedFiles => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = () => {
        setSignature(reader.result);
      };
      reader.readAsText(file);
    }
  });

  const handleVerify = async () => {
    if (!document) {
      setError('Please upload the original document');
      return;
    }

    if (!signature) {
      setError('Please upload the signature file');
      return;
    }

    if (!publicKey) {
      setError('Please enter the public key');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const result = await signatureService.verifySignature(
        document,
        signature,
        publicKey,
        algorithm
      );
      setVerificationResult(result.isValid);
    } catch (err) {
      setError(err.message || 'Failed to verify signature');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box mb={3}>
        <Typography variant="h4">Verify Signature</Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {verificationResult !== null && (
        <Alert 
          severity={verificationResult ? 'success' : 'error'} 
          sx={{ mb: 3 }}
        >
          {verificationResult 
            ? 'Signature is valid!' 
            : 'Signature is invalid!'}
        </Alert>
      )}
      
      <Paper sx={{ p: 4, mb: 3 }}>
        <FormControl component="fieldset" sx={{ mb: 3 }}>
          <FormLabel component="legend">Algorithm</FormLabel>
          <RadioGroup
            row
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
          >
            <FormControlLabel value="RSA" control={<Radio />} label="RSA" />
            <FormControlLabel value="ECC" control={<Radio />} label="ECC" />
          </RadioGroup>
        </FormControl>
        
        <Box mb={3}>
          <Typography gutterBottom>Original Document</Typography>
          <div {...getDocRootProps({ className: 'dropzone' })} style={{
            border: '2px dashed #ccc',
            borderRadius: '4px',
            padding: '20px',
            textAlign: 'center',
            cursor: 'pointer'
          }}>
            <input {...getDocInputProps()} />
            <Typography>
              {document ? 'Document loaded' : 'Drag & drop document here, or click to select'}
            </Typography>
          </div>
        </Box>
        
        <Box mb={3}>
          <Typography gutterBottom>Signature File</Typography>
          <div {...getSigRootProps({ className: 'dropzone' })} style={{
            border: '2px dashed #ccc',
            borderRadius: '4px',
            padding: '20px',
            textAlign: 'center',
            cursor: 'pointer'
          }}>
            <input {...getSigInputProps()} />
            <Typography>
              {signature ? 'Signature loaded' : 'Drag & drop signature file here, or click to select'}
            </Typography>
          </div>
        </Box>
        
        <TextField
          label="Public Key"
          fullWidth
          multiline
          rows={4}
          value={publicKey}
          onChange={(e) => setPublicKey(e.target.value)}
          margin="normal"
          variant="outlined"
          placeholder="Enter the public key used for verification"
        />
      </Paper>
      
      <Box display="flex" justifyContent="center">
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleVerify}
          disabled={loading || !document || !signature || !publicKey}
          startIcon={loading ? <CircularProgress size={24} /> : null}
        >
          Verify Signature
        </Button>
      </Box>
    </Container>
  );
};

export default VerifySignature;