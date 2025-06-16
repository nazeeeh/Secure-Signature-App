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
  CircularProgress
} from '@mui/material';
import { Add, MoreVert } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import keyService from '../../services/keyService';
import useAuth from '../../hooks/useAuth';

const KeyList = () => {
  const { isAuthenticated } = useAuth();
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedKey, setSelectedKey] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchKeys = async () => {
        try {
          const result = await keyService.getKeyPairs();
          setKeys(result);
          setLoading(false);
        } catch (err) {
          setError(err.message || 'Failed to fetch keys');
          setLoading(false);
        }
      };

      fetchKeys();
    }
  }, [isAuthenticated]);

  const handleMenuOpen = (event, key) => {
    setAnchorEl(event.currentTarget);
    setSelectedKey(key);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedKey(null);
  };

  const handleDelete = async () => {
    try {
      await keyService.deleteKeyPair(selectedKey._id);
      setKeys(keys.filter(key => key._id !== selectedKey._id));
      handleMenuClose();
    } catch (err) {
      setError(err.message || 'Failed to delete key');
    }
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
        <Typography variant="h4">My Key Pairs</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          component={Link}
          to="/keys/generate"
        >
          Generate New Key
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
              <TableCell>Algorithm</TableCell>
              <TableCell>Public Key</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {keys.length > 0 ? (
              keys.map((key) => (
                <TableRow key={key._id}>
                  <TableCell>{key.algorithm}</TableCell>
                  <TableCell sx={{ wordBreak: 'break-word' }}>
                    {key.publicKey.substring(0, 30)}...
                  </TableCell>
                  <TableCell>
                    {new Date(key.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={(e) => handleMenuOpen(e, key)}>
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No key pairs found
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
          to={`/keys/${selectedKey?._id}`}
          onClick={handleMenuClose}
        >
          View Details
        </MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </Container>
  );
};

export default KeyList;