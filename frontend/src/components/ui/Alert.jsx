import React from 'react';
import { Alert as MuiAlert } from '@mui/material';

const Alert = ({ severity, message, onClose }) => {
  return (
    <MuiAlert 
      severity={severity} 
      onClose={onClose}
      sx={{ mb: 2 }}
    >
      {message}
    </MuiAlert>
  );
};

export default Alert;