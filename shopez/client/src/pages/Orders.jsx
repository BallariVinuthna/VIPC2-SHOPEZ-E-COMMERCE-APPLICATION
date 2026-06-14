import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, Card, CardContent, Grid, Chip, Divider, Paper } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/myorders');
        setOrders(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch your orders');
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  if (error) return <Typography color="error" align="center" mt={4}>{error}</Typography>;

  return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          My Order History
        </Typography>
      </Box>

      {orders.length === 0 ? (
        <Paper elevation={1} sx={{ p: 5, textAlign: 'center', bgcolor: 'background.paper', borderRadius: 2 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            You haven't placed any orders yet.
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Link to="/shop" style={{ textDecoration: 'none' }}>
              <Chip label="Visit Marketplace" color="primary" sx={{ cursor: 'pointer', fontWeight: 'bold' }} />
            </Link>
          </Box>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {orders.map((order) => (
            <Card key={order._id} sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ p: 3 }}>
                {/* Header info */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      Order ID
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', fontFamily: 'monospace' }}>
                      {order._id}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      Date Placed
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={3} sx={{ textAlign: { sm: 'right' } }}>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      Total Price
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                      ₹{order.totalPrice.toLocaleString('en-IN')}
                    </Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                 {/* Shipping & Status */}
                <Grid container spacing={3} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                      Shipping Address
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      <strong>Mobile:</strong> {order.mobile || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                      Order Details
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Payment Method:</strong> {order.paymentMethod || 'Virtual Balance'}
                    </Typography>
                    {order.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        <strong>Special Notes:</strong> {order.description}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: { sm: 'flex-end' } }}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Typography variant="body2">Payment Status:</Typography>
                      <Chip 
                        label={order.isPaid ? "Paid" : "Unpaid"} 
                        color={order.isPaid ? "success" : "warning"} 
                        size="small" 
                      />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Typography variant="body2">Delivery Status:</Typography>
                      <Chip 
                        label={order.isDelivered ? "Delivered" : "Processing"} 
                        color={order.isDelivered ? "success" : "info"} 
                        size="small" 
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, textAlign: 'right' }}>
                      {order.isDelivered 
                        ? `Delivered on: ${new Date(order.deliveryDate || order.deliveredAt || order.updatedAt).toLocaleDateString()}` 
                        : `Estimated Delivery: ${new Date(new Date(order.createdAt).getTime() + 3*24*60*60*1000).toLocaleDateString()}`
                      }
                    </Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                {/* Items */}
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Items Ordered
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {order.orderItems.map((item) => (
                    <Box key={item._id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {item.image && (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} 
                        />
                      )}
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {item.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Quantity: {item.qty} x ₹{item.price.toLocaleString('en-IN')}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        ₹{(item.qty * item.price).toLocaleString('en-IN')}
                      </Typography>
                    </Box>
                  ))}
                </Box>

              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default Orders;
