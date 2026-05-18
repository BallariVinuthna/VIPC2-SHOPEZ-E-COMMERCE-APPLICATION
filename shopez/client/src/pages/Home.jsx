import React, { useContext } from 'react';
import { Container, Typography, Button, Box, Grid, Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{ 
        bgcolor: 'background.paper', 
        pt: 12, 
        pb: 10,
        background: 'linear-gradient(to right bottom, #0f172a, #1e1b4b)'
      }}>
        <Container maxWidth="md">
          <Typography component="h1" variant="h2" align="center" color="text.primary" gutterBottom sx={{ fontWeight: 800 }}>
            Trade Smarter with SHOPEZ
          </Typography>
          <Typography variant="h5" align="center" color="text.secondary" paragraph sx={{ mb: 4 }}>
            Experience the next generation of virtual trading. Practice your strategies with a simulated $100,000 portfolio in a risk-free environment with real-time market data.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large" 
              component={Link} 
              to={user ? "/dashboard" : "/register"} 
              sx={{ px: 4, py: 1.5 }}
            >
              {user ? "Go to Dashboard" : "Start Trading Now"}
            </Button>
            <Button variant="outlined" color="secondary" size="large" component={Link} to="/dashboard" sx={{ px: 4, py: 1.5 }}>
              View Markets
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 8 }} maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-8px)' } }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <TrendingUpIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography gutterBottom variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                  Live Market Data
                </Typography>
                <Typography color="text.secondary">
                  Access real-time stock prices and historical charts to make informed trading decisions.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-8px)' } }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <SecurityIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                <Typography gutterBottom variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                  Risk-Free Simulation
                </Typography>
                <Typography color="text.secondary">
                  Start with $100,000 virtual cash. Test your investment strategies without losing real money.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-8px)' } }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <SpeedIcon sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
                <Typography gutterBottom variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                  Instant Execution
                </Typography>
                <Typography color="text.secondary">
                  Lightning-fast trade execution engine. Buy and sell stocks instantly with zero latency.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
