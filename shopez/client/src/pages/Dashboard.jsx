import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography, Box, CircularProgress, TextField, InputAdornment, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const { data } = await api.get('/stocks');
        setStocks(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch stocks');
        setLoading(false);
      }
    };
    fetchStocks();
  }, []);

  const filteredStocks = stocks.filter(stock => 
    stock.name.toLowerCase().includes(search.toLowerCase()) || 
    stock.symbol.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  if (error) return <Typography color="error" align="center" mt={4}>{error}</Typography>;

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Market Overview
      </Typography>

      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for stocks by name or symbol..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ bgcolor: 'background.paper', borderRadius: 1 }}
        />
      </Box>

      <Grid container spacing={3}>
        {filteredStocks.map((stock) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={stock._id}>
            <Card 
              component={Link} 
              to={`/stocks/${stock._id}`} 
              sx={{ 
                textDecoration: 'none', 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                    {stock.symbol}
                  </Typography>
                  <Chip label={stock.category} size="small" variant="outlined" />
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {stock.name}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'baseline', gap: 1 }}>
                  <Typography variant="h4">
                    ₹{stock.currentPrice.toLocaleString('en-IN')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Typography 
                    variant="body2" 
                    color={stock.dailyChange >= 0 ? 'success.main' : 'error.main'}
                    sx={{ fontWeight: 'bold' }}
                  >
                    {stock.dailyChange >= 0 ? '+' : ''}{stock.dailyChange.toFixed(2)} ({stock.dailyChangePercent.toFixed(2)}%)
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Dashboard;
