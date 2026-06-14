import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import api from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [portfolioRes, transactionsRes] = await Promise.all([
          api.get('/portfolio'),
          api.get('/transactions')
        ]);
        setPortfolio(portfolioRes.data);
        setTransactions(transactionsRes.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load portfolio data');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  if (error) return <Typography color="error" align="center" mt={4}>{error}</Typography>;

  const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'];

  const pieData = portfolio?.holdings?.map(h => ({
    name: h.stock?.symbol || 'Unknown',
    value: h.quantity * (h.stock?.currentPrice || 0)
  })) || [];

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        My Portfolio
      </Typography>

      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'background.paper', height: '100%' }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Total Invested</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                ₹{portfolio?.totalInvested?.toLocaleString('en-IN') || '0.00'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'background.paper', height: '100%' }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Current Market Value</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                ₹{portfolio?.currentMarketValue?.toLocaleString('en-IN') || '0.00'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'background.paper', height: '100%' }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Net Profit / Loss</Typography>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 'bold',
                  color: (portfolio?.netProfitLoss || 0) >= 0 ? 'success.main' : 'error.main'
                }}
              >
                {(portfolio?.netProfitLoss || 0) >= 0 ? '+' : '-'}₹{Math.abs(portfolio?.netProfitLoss || 0).toLocaleString('en-IN')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Current Holdings
          </Typography>
          <TableContainer component={Paper} sx={{ bgcolor: 'background.paper' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Asset</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Avg Cost</TableCell>
                  <TableCell align="right">Current Price</TableCell>
                  <TableCell align="right">Total Value</TableCell>
                  <TableCell align="right">Return</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {portfolio?.holdings?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">No holdings found. Start trading!</TableCell>
                  </TableRow>
                )}
                {portfolio?.holdings?.map((row) => {
                  if(!row.stock) return null;
                  const currentPrice = row.stock.currentPrice;
                  const totalValue = row.quantity * currentPrice;
                  const totalCost = row.quantity * row.averagePrice;
                  const returnVal = totalValue - totalCost;
                  const returnPercent = (returnVal / totalCost) * 100;

                  return (
                    <TableRow key={row._id}>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                        {row.stock.symbol}
                      </TableCell>
                      <TableCell align="right">{row.quantity}</TableCell>
                      <TableCell align="right">₹{row.averagePrice.toLocaleString('en-IN')}</TableCell>
                      <TableCell align="right">₹{currentPrice.toLocaleString('en-IN')}</TableCell>
                      <TableCell align="right">₹{totalValue.toLocaleString('en-IN')}</TableCell>
                      <TableCell align="right" sx={{ color: returnVal >= 0 ? 'success.main' : 'error.main', fontWeight: 'bold' }}>
                        {returnVal >= 0 ? '+' : '-'}₹{Math.abs(returnVal).toLocaleString('en-IN')} ({returnPercent.toFixed(2)}%)
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Allocation
          </Typography>
          <Card sx={{ bgcolor: 'background.paper', height: 400 }}>
            <CardContent sx={{ height: '100%' }}>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Typography color="text.secondary">No assets to display</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Portfolio;
