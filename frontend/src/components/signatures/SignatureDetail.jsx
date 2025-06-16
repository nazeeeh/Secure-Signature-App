import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
  Tabs,
  Chip,
  IconButton,
  Tooltip,
  Grid,
  Divider,
  Badge
} from '@mui/material';
import {
  Verified as VerifiedIcon,
  ContentCopy as CopyIcon,
  ArrowBack as BackIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import signatureService from '../../services/signatureService';
import useAuth from '../../hooks/useAuth';
import { copyToClipboard, downloadFile } from '../../utils/helpers';
import { toast } from 'react-toastify';

const SignatureDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [signature, setSignature] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchSignature = async () => {
        try {
          const result = await signatureService.getSignature(id);
          setSignature(result);
          setLoading(false);
        } catch (err) {
          setError(err.message || 'Failed to fetch signature');
          setLoading(false);
        }
      };

      fetchSignature();
    }
  }, [id, isAuthenticated]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCopy = (text) => {
    copyToClipboard(text);
    toast.success('Copied to clipboard!');
  };

  const handleDownload = () => {
    if (!signature) return;
    
    const content = JSON.stringify({
      documentName: signature.documentName,
      documentHash: signature.documentHash,
      signature: signature.signature,
      algorithm: signature.algorithm,
      publicKey: signature.publicKey,
      createdAt: signature.createdAt
    }, null, 2);
    
    downloadFile(content, `${signature.documentName}-signature.json`);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await signatureService.deleteSignature(id);
      toast.success('Signature deleted successfully');
      navigate('/signatures');
    } catch (err) {
      setError(err.message || 'Failed to delete signature');
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    try {
      setVerifying(true);
      const result = await signatureService.verifySignature(
        signature.documentHash,
        signature.signature,
        signature.publicKey,
        signature.algorithm
      );
      setVerificationResult(result.isValid);
      toast.success(`Signature verification ${result.isValid ? 'succeeded' : 'failed'}`);
    } catch (err) {
      setError(err.message || 'Failed to verify signature');
      toast.error('Verification failed');
    } finally {
      setVerifying(false);
    }
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
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<BackIcon />}
          onClick={() => navigate('/signatures')}
        >
          Back to Signatures
        </Button>
      </Container>
    );
  }

  if (!signature) {
    return (
      <Container maxWidth="lg">
        <Alert severity="warning" sx={{ mb: 3 }}>
          Signature not found
        </Alert>
        <Button
          variant="outlined"
          startIcon={<BackIcon />}
          onClick={() => navigate('/signatures')}
        >
          Back to Signatures
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center">
          <IconButton 
            component={Link} 
            to="/signatures"
            sx={{ mr: 2 }}
          >
            <BackIcon />
          </IconButton>
          <Typography variant="h4">
            {signature.documentName}
          </Typography>
          {verificationResult !== null && (
            <Badge
              badgeContent={
                <VerifiedIcon 
                  color={verificationResult ? "success" : "error"} 
                  fontSize="small"
                />
              }
              sx={{ ml: 2 }}
            >
              <Chip 
                label={verificationResult ? "Verified" : "Invalid"} 
                color={verificationResult ? "success" : "error"} 
                variant="outlined"
              />
            </Badge>
          )}
        </Box>
        
        <Box>
          <Tooltip title="Download Signature">
            <IconButton onClick={handleDownload} sx={{ mr: 1 }}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          {user?.id === signature.userId && (
            <Tooltip title="Delete Signature">
              <IconButton onClick={handleDelete} color="error">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Signature Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box mb={2}>
              <Typography variant="subtitle2" color="textSecondary">
                Algorithm
              </Typography>
              <Chip 
                label={signature.algorithm} 
                color={signature.algorithm === 'RSA' ? 'primary' : 'secondary'} 
                sx={{ mt: 1 }}
              />
            </Box>
            
            <Box mb={2}>
              <Typography variant="subtitle2" color="textSecondary">
                Created
              </Typography>
              <Typography>
                {new Date(signature.createdAt).toLocaleString()}
              </Typography>
            </Box>
            
            <Box mb={2}>
              <Typography variant="subtitle2" color="textSecondary">
                Document Hash
              </Typography>
              <Box display="flex" alignItems="center">
                <Typography 
                  sx={{ 
                    fontFamily: 'monospace', 
                    fontSize: '0.8rem',
                    wordBreak: 'break-all'
                  }}
                >
                  {signature.documentHash}
                </Typography>
                <Tooltip title="Copy hash">
                  <IconButton 
                    size="small" 
                    onClick={() => handleCopy(signature.documentHash)}
                    sx={{ ml: 1 }}
                  >
                    <CopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleVerify}
              disabled={verifying}
              startIcon={
                verifying ? <CircularProgress size={20} /> : <VerifiedIcon />
              }
              sx={{ mt: 2 }}
            >
              Verify Signature
            </Button>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 0 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Signature Data" />
              <Tab label="Public Key" />
            </Tabs>
            
            <Box sx={{ p: 3 }}>
              {tabValue === 0 && (
                <TextField
                  label="Signature"
                  fullWidth
                  multiline
                  rows={8}
                  value={JSON.stringify(signature.signature, null, 2)}
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                    sx: { fontFamily: 'monospace' }
                  }}
                />
              )}
              
              {tabValue === 1 && (
                <>
                  <TextField
                    label="Public Key"
                    fullWidth
                    multiline
                    rows={8}
                    value={signature.publicKey}
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                      sx: { fontFamily: 'monospace' }
                    }}
                  />
                  <Box mt={2} display="flex" justifyContent="flex-end">
                    <Tooltip title="Copy public key">
                      <IconButton onClick={() => handleCopy(signature.publicKey)}>
                        <CopyIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SignatureDetail;