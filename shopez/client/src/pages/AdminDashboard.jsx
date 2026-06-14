import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Button, TextField, Alert, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import api from '../services/api';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Storefront announcement config
  const [banner, setBanner] = useState('');
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [configSuccess, setConfigSuccess] = useState('');

  const fetchData = async () => {
    try {
      const [usersRes, transactionsRes, ordersRes, configRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/transactions'),
        api.get('/orders'), // Admin gets all orders
        api.get('/admin/config')
      ]);
      setUsers(usersRes.data);
      setTransactions(transactionsRes.data);
      setOrders(ordersRes.data);
      setBanner(configRes.data?.banner || '');
      setCategories(configRes.data?.categories || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to load admin data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeliverOrder = async (orderId) => {
    try {
      await api.put(`/orders/${orderId}/deliver`);
      fetchData(); // Refresh list
    } catch (err) {
      alert('Failed to update delivery status');
    }
  };

  const handleBannerUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/banner', { banner });
      setConfigSuccess('Storefront banner updated successfully!');
      setTimeout(() => setConfigSuccess(''), 3000);
    } catch (err) {
      alert('Failed to update storefront banner');
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory) return;
    try {
      const { data } = await api.post('/admin/category', { category: newCategory });
      setCategories(data.categories);
      setNewCategory('');
      setConfigSuccess(`New category "${newCategory}" added!`);
      setTimeout(() => setConfigSuccess(''), 3000);
    } catch (err) {
      alert('Failed to add category');
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress color="secondary" /></Box>;
  if (error) return <Typography color="error" align="center" mt={4}>{error}</Typography>;

  return (
    <Container maxWidth="xl" sx={{ pb: 8 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'extrabold', mb: 4, color: 'warning.main' }}>
        Admin Dashboard Control Console
      </Typography>

      {/* Metrics Cards */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'background.paper', height: '100%', borderTop: '4px solid #6366f1' }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Total Registered Users</Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1 }}>
                {users.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'background.paper', height: '100%', borderTop: '4px solid #ec4899' }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Stock Transactions</Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1 }}>
                {transactions.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'background.paper', height: '100%', borderTop: '4px solid #10b981' }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>E-Commerce Orders</Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1 }}>
                {orders.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {/* Left Side: Tables & Configuration */}
        <Grid item xs={12} lg={9} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          
          {/* Storefront configuration panel */}
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
              Storefront Configurations
            </Typography>
            <Paper elevation={3} sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 3 }}>
              {configSuccess && <Alert severity="success" sx={{ mb: 3 }}>{configSuccess}</Alert>}
              <Grid container spacing={4}>
                {/* Banner update form */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Announcement & Promo Banner Message
                  </Typography>
                  <Box component="form" onSubmit={handleBannerUpdate} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      variant="outlined"
                      label="Announcement Banner Text"
                      value={banner}
                      onChange={(e) => setBanner(e.target.value)}
                    />
                    <Button type="submit" variant="contained" color="warning" sx={{ alignSelf: 'flex-start', fontWeight: 'bold' }}>
                      Update Banner
                    </Button>
                  </Box>
                </Grid>

                {/* Categories update form */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Product Category Management
                  </Typography>
                  <Box component="form" onSubmit={handleAddCategory} sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
                    <TextField
                      size="small"
                      label="New Category"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="e.g. Footwear"
                      fullWidth
                    />
                    <Button type="submit" variant="contained" color="warning" sx={{ fontWeight: 'bold' }}>
                      Add
                    </Button>
                  </Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1.5 }}>
                    Active Shop Departments:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {categories.map((cat) => (
                      <Chip key={cat} label={cat} color="primary" variant="outlined" />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Box>

          {/* E-Commerce Orders Table */}
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
              Recent E-Commerce Orders
            </Typography>
            <TableContainer component={Paper} sx={{ bgcolor: 'background.paper' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Total Price</TableCell>
                    <TableCell>Payment</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">No orders placed yet.</TableCell>
                    </TableRow>
                  ) : (
                    orders.slice(0, 5).map((order) => (
                      <TableRow key={order._id}>
                        <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{order._id}</TableCell>
                        <TableCell>{order.user?.email || 'Unknown User'}</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: 'success.main' }}>
                          ₹{order.totalPrice.toLocaleString('en-IN')}
                        </TableCell>
                        <TableCell>
                          <Chip label={order.paymentMethod || "Paid"} color="success" size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={order.isDelivered ? 'Delivered' : 'Processing'} 
                            color={order.isDelivered ? 'success' : 'info'} 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell align="center">
                          {!order.isDelivered && (
                            <Button 
                              variant="contained" 
                              color="success" 
                              size="small" 
                              onClick={() => handleDeliverOrder(order._id)}
                            >
                              Deliver
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Stock Transactions Table */}
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
              Recent Stock Transactions
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
                  {transactions.slice(0, 5).map((row) => (
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
                      <TableCell align="right">₹{row.price.toLocaleString('en-IN')}</TableCell>
                      <TableCell align="right">₹{row.totalAmount.toLocaleString('en-IN')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>

        {/* Right Side: Quick Actions */}
        <Grid item xs={12} lg={3}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Console Navigation
          </Typography>
          <Card sx={{ bgcolor: 'background.paper' }}>
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button 
                  variant="contained" 
                  color="warning" 
                  fullWidth 
                  component={Link} 
                  to="/admin/products"
                  sx={{ fontWeight: 'bold' }}
                >
                  Manage Products
                </Button>
                <Button variant="outlined" color="primary" fullWidth disabled>
                  Manage Users (Read-Only)
                </Button>
                <Button variant="outlined" color="secondary" fullWidth disabled>
                  Market Adjustments
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
