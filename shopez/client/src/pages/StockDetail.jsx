import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Grid, Typography, Card, CardContent, Button, Box, TextField, CircularProgress, Alert } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const StockDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateBalance } = useContext(AuthContext);
  
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [ownedQuantity, setOwnedQuantity] = useState(0);
  const [tradeLoading, setTradeLoading] = useState(false);
  const [tradeMessage, setTradeMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stock data — required
        const stockRes = await api.get(`/stocks/${id}`);
        setStock(stockRes.data);

        // Fetch portfolio — optional, don't crash if it fails (e.g. stale token)
        try {
          const portfolioRes = await api.get('/portfolio');
          const holding = portfolioRes.data.holdings.find(h => h.stock?._id === id);
          setOwnedQuantity(holding ? holding.quantity : 0);
        } catch {
          setOwnedQuantity(0);
        }

        setLoading(false);
      } catch (err) {
        setError('Failed to fetch stock data. Please try again.');
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleTrade = async (type) => {
    if (quantity <= 0) return setTradeMessage({ type: 'error', text: 'Quantity must be greater than 0' });
    
    setTradeLoading(true);
    setTradeMessage('');
    
    try {
      const endpoint = type === 'BUY' ? '/transactions/buy' : '/transactions/sell';
      const { data } = await api.post(endpoint, { stockId: id, quantity: Number(quantity) });
      
      updateBalance(data.balance);
      setTradeMessage({ type: 'success', text: data.message });
      
      // Update owned quantity locally
      if (type === 'BUY') {
        setOwnedQuantity(prev => prev + Number(quantity));
      } else {
        setOwnedQuantity(prev => prev - Number(quantity));
      }
      
      setQuantity(1);
    } catch (err) {
      setTradeMessage({ type: 'error', text: err.response?.data?.message || `Failed to ${type}` });
    } finally {
      setTradeLoading(false);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  if (error) return <Typography color="error" align="center" mt={4}>{error}</Typography>;
  if (!stock) return null;

  // Mock historical data since we didn't seed any in DB
  const mockData = Array.from({ length: 30 }, (_, i) => ({
    name: `Day ${i + 1}`,
    price: stock.currentPrice * (1 + (Math.random() * 0.1 - 0.05)),
  }));

  return (
    <Container maxWidth="xl">
      <Button onClick={() => navigate('/dashboard')} sx={{ mb: 3 }}>
        &larr; Back to Market
      </Button>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card sx={{ bgcolor: 'background.paper', height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 'bold' }}>{stock.symbol}</Typography>
                  <Typography variant="h6" color="text.secondary">{stock.name}</Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h3">₹{stock.currentPrice.toLocaleString('en-IN')}</Typography>
                  <Typography 
                    variant="h6" 
                    color={stock.dailyChange >= 0 ? 'success.main' : 'error.main'}
                  >
                    {stock.dailyChange >= 0 ? '+' : ''}{stock.dailyChange.toFixed(2)} ({stock.dailyChangePercent.toFixed(2)}%)
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ height: 400, mt: 4 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis domain={['auto', 'auto']} stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: 8 }}
                      itemStyle={{ color: '#f8fafc' }}
                    />
                    <Line type="monotone" dataKey="price" stroke="#6366f1" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'background.paper' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                Trade {stock.symbol}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Available Balance: <Box component="span" sx={{ color: 'success.main', fontWeight: 'bold' }}>₹{user.balance?.toLocaleString('en-IN')}</Box>
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Owned Shares: <Box component="span" sx={{ color: 'primary.main', fontWeight: 'bold' }}>{ownedQuantity}</Box>
              </Typography>

              {tradeMessage && (
                <Alert severity={tradeMessage.type} sx={{ mb: 3 }}>
                  {tradeMessage.text}
                </Alert>
              )}

              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Quantity"
                  type="number"
                  InputProps={{ inputProps: { min: 1 } }}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography>Estimated Cost:</Typography>
                  <Typography sx={{ fontWeight: 'bold' }}>
                    ₹{(quantity * stock.currentPrice).toLocaleString('en-IN')}
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    size="large"
                    disabled={tradeLoading || (quantity * stock.currentPrice > user.balance)}
                    onClick={() => handleTrade('BUY')}
                  >
                    {tradeLoading ? <CircularProgress size={24} /> : 'Buy'}
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="error"
                    size="large"
                    disabled={tradeLoading}
                    onClick={() => handleTrade('SELL')}
                  >
                    {tradeLoading ? <CircularProgress size={24} /> : 'Sell'}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default StockDetail;
