import React, { useContext, useState } from 'react';
import { Container, Typography, Box, Card, CardContent, Avatar, Grid, Button, TextField, Divider, Alert } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import BadgeIcon from '@mui/icons-material/Badge';
import SaveIcon from '@mui/icons-material/Save';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  if (!user) return null;

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        User Profile
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'background.paper', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3, borderRadius: 3 }}>
            <Avatar 
              alt={user.name} 
              src={user.profileImage} 
              sx={{ width: 120, height: 120, mb: 2, bgcolor: 'primary.main', fontSize: '3rem' }}
            >
              {user.name ? user.name[0].toUpperCase() : 'U'}
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{user.name}</Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: 1 }}>
              {user.role || user.userType}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>Account Information</Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <PersonIcon color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Full Name / Username</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{user.name || user.username}</Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <EmailIcon color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Email Address</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{user.email}</Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <BadgeIcon color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Role / Account Type</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium', textTransform: 'capitalize' }}>
                    {user.role === 'ADMIN' ? 'Administrator' : 'Standard User'}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AccountBalanceWalletIcon color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Virtual Wallet Balance</Typography>
                  <Typography variant="h5" color="success.main" sx={{ fontWeight: 'bold' }}>
                    ₹{user.balance?.toLocaleString('en-IN')}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
