import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Chip
} from '@mui/material';
import { Add, MoreVert } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import signatureService from '../../services/signatureService';
import useAuth from '../../hooks/useAuth';

const SignatureList = () => {
  const { isAuthenticated } = useAuth();
  const [signatures, setSignatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSignature, setSelectedSignature] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchSignatures = async () => {
        try {
          const result = await signatureService.getSignatures();
          setSignatures(result);
          setLoading(false);
        } catch (err) {
          setError(err.message || 'Failed to fetch signatures');
          setLoading(false);
        }
      };

      fetchSignatures();
    }
  }, [isAuthenticated]);

  const handleMenuOpen = (event, signature) => {
    setAnchorEl(event.currentTarget);
    setSelectedSignature(signature);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedSignature(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">My Signatures</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          component={Link}
          to="/signatures/sign"
        >
          Sign Document
        </Button>
      </Box>
      {error && (
        <Typography color="error" align="center" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Document Name</TableCell>
              <TableCell>Algorithm</TableCell>
              <TableCell>Signature</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {signatures.length > 0 ? (
              signatures.map((signature) => (
                <TableRow key={signature._id}>
                  <TableCell>{signature.documentName}</TableCell>
                  <TableCell>
                    <Chip 
                      label={signature.algorithm} 
                      color={signature.algorithm === 'RSA' ? 'primary' : 'secondary'} 
                    />
                  </TableCell>
                  <TableCell sx={{ wordBreak: 'break-word' }}>
                    {typeof signature.signature === 'string' 
                      ? signature.signature.substring(0, 30) + '...'
                      : 'Object'}
                  </TableCell>
                  <TableCell>
                    {new Date(signature.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={(e) => handleMenuOpen(e, signature)}>
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No signatures found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem 
          component={Link} 
          to={`/signatures/${selectedSignature?._id}`}
          onClick={handleMenuClose}
        >
          View Details
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default SignatureList;