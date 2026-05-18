import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import api from '../services/api';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, transactionsRes] = await Promise.all([
          api.get('/admin/users'),
          api.get('/admin/transactions')
        ]);
        setUsers(usersRes.data);
        setTransactions(transactionsRes.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load admin data');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  if (error) return <Typography color="error" align="center" mt={4}>{error}</Typography>;

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4, color: 'warning.main' }}>
        Admin Dashboard
      </Typography>

      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: 'background.paper', height: '100%' }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Total Users</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {users.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: 'background.paper', height: '100%' }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Total Transactions</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {transactions.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Recent Transactions
          </Typography>
          <TableContainer component={Paper} sx={{ bgcolor: 'background.paper' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.slice(0, 10).map((row) => (
                  <TableRow key={row._id}>
                    <TableCell>{new Date(row.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{row.user?.email || 'Unknown User'}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{row.stock?.symbol || 'Unknown Stock'}</TableCell>
                    <TableCell>
                      <Chip 
                        label={row.type} 
                        size="small" 
                        color={row.type === 'BUY' ? 'success' : 'error'} 
                      />
                    </TableCell>
                    <TableCell align="right">{row.quantity}</TableCell>
                    <TableCell align="right">${row.price.toFixed(2)}</TableCell>
                    <TableCell align="right">${row.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Quick Actions
          </Typography>
          <Card sx={{ bgcolor: 'background.paper' }}>
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button variant="outlined" fullWidth>Manage All Users</Button>
                <Button variant="outlined" fullWidth color="secondary">Update Stock Prices</Button>
                <Button variant="contained" fullWidth color="primary">Add New Stock</Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
