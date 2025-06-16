import React from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
  Button
} from '@mui/material';
import { Link } from 'react-router-dom';
import KeyIcon from '@mui/icons-material/Key';
import AssignmentIcon from '@mui/icons-material/Assignment';

const Dashboard = () => {
  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Welcome to your SecureSign dashboard
        </Typography>
      </Box>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <KeyIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h5">Key Management</Typography>
              </Box>
              <Typography paragraph>
                Generate and manage your cryptographic key pairs for signing documents.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/keys"
                fullWidth
              >
                Manage Keys
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <AssignmentIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h5">Document Signing</Typography>
              </Box>
              <Typography paragraph>
                Sign documents and verify existing signatures to ensure authenticity.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/signatures"
                fullWidth
              >
                Manage Signatures
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Box mt={4}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                color="primary"
                component={Link}
                to="/keys/generate"
                fullWidth
              >
                Generate New Key
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                color="primary"
                component={Link}
                to="/signatures/sign"
                fullWidth
              >
                Sign Document
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                color="primary"
                component={Link}
                to="/signatures/verify"
                fullWidth
              >
                Verify Signature
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                color="primary"
                component={Link}
                to="/settings"
                fullWidth
              >
                Account Settings
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard;