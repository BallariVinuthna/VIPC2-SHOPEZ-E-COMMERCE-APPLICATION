import React, { useState, useContext } from 'react';
import { Container, Grid, Typography, Box, TextField, Button, Alert, Paper, Divider, List, ListItem, ListItemText, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ToastContext } from '../context/ToastContext';
import api from '../services/api';

const Checkout = () => {
  const { user, updateBalance } = useContext(AuthContext);
  const { cartItems, cartTotalPrice, clearCart } = useContext(CartContext);
  const { showToast } = useContext(ToastContext);
  const navigate = useNavigate();

  // Core Shipping fields
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  
  // Custom required fields
  const [mobile, setMobile] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Virtual Balance');
  const [productRequirements, setProductRequirements] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!address || !city || !postalCode || !country || !mobile) {
      const fieldErr = 'Please fill in all shipping fields and your mobile number';
      setError(fieldErr);
      showToast(fieldErr, 'warning');
      return;
    }

    const isVirtualWallet = paymentMethod === 'Virtual Balance';
    if (isVirtualWallet && user.balance < cartTotalPrice) {
      const balErr = 'Insufficient virtual balance to complete this purchase.';
      setError(balErr);
      showToast(balErr, 'error');
      return;
    }

    setLoading(true);

    try {
      const shippingAddress = { address, city, postalCode, country };
      const orderItems = cartItems.map(item => ({
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.price,
        product: item.product,
        size: item.size || 'M',
        discount: item.discount || 0
      }));

      const { data } = await api.post('/orders', {
        orderItems,
        shippingAddress,
        totalPrice: cartTotalPrice,
        mobile,
        paymentMethod,
        productRequirements
      });

      // Deduct balance locally in AuthContext only if paying via Virtual Balance
      if (isVirtualWallet) {
        const newBalance = user.balance - cartTotalPrice;
        updateBalance(newBalance);
      }

      setCreatedOrderId(data._id);
      
      // Clear Cart
      clearCart();
      
      showToast('Order placed successfully!', 'success');
      setSuccess(true);
      setLoading(false);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to place order';
      setError(errMsg);
      showToast(errMsg, 'error');
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && !success) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
        <Paper sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No items in your cart to checkout.
          </Typography>
          <Button variant="contained" component={Link} to="/shop" sx={{ mt: 2 }}>
            Go to Shop
          </Button>
        </Paper>
      </Container>
    );
  }

  if (success) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
        <Paper elevation={3} sx={{ p: 5, borderRadius: 3, bgcolor: 'background.paper' }}>
          <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 'extrabold', mb: 2 }}>
            Order Confirmed!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1.5 }}>
            Thank you for your purchase. Your order has been placed successfully.
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', bgcolor: 'background.default', p: 1.5, borderRadius: 1.5, mb: 4, fontWeight: 'bold' }}>
            ORDER ID: {createdOrderId}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button variant="contained" component={Link} to="/orders" color="primary">
              Track Order History
            </Button>
            <Button variant="outlined" component={Link} to="/shop" color="inherit">
              Back to Shop
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  const isBalanceInsufficient = paymentMethod === 'Virtual Balance' && user.balance < cartTotalPrice;

  return (
    <Container maxWidth="lg" sx={{ pb: 8 }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        component={Link} 
        to="/cart" 
        sx={{ mb: 3 }}
        color="inherit"
      >
        Back to Cart
      </Button>

      <Typography variant="h4" sx={{ fontWeight: 'extrabold', mb: 4 }}>
        Secure Checkout
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      
      {paymentMethod === 'Virtual Balance' && isBalanceInsufficient && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <strong>Insufficient balance!</strong> Your current wallet balance is <strong>₹{user.balance.toLocaleString('en-IN')}</strong>, but the total purchase amount is <strong>₹{cartTotalPrice.toLocaleString('en-IN')}</strong>. Please sell some stocks to increase your balance.
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Shipping & Payment Form */}
        <Grid item xs={12} md={7}>
          <Paper elevation={3} sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              Order & Shipping Details
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Mobile Number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="Enter 10-digit mobile number"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Street Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Postal / ZIP Code"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </Grid>

                {/* Custom Payment Method selection */}
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel id="payment-method-label">Payment Method</InputLabel>
                    <Select
                      labelId="payment-method-label"
                      value={paymentMethod}
                      label="Payment Method"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <MenuItem value="Virtual Balance">Virtual Wallet Balance (SIMULATED)</MenuItem>
                      <MenuItem value="Cash On Delivery">Cash On Delivery (COD)</MenuItem>
                      <MenuItem value="Credit Card">Credit Card</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Customer special requirements */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Product Requirements / Special Instructions"
                    value={productRequirements}
                    onChange={(e) => setProductRequirements(e.target.value)}
                    placeholder="Enter any color, size specifications or delivery preferences..."
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 4 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  size="large"
                  fullWidth
                  disabled={loading || isBalanceInsufficient}
                  sx={{ py: 1.8, fontWeight: 'bold', fontSize: '1.05rem' }}
                >
                  {loading ? 'Processing...' : `Place Order (₹${cartTotalPrice.toLocaleString('en-IN')})`}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Order Preview & Wallet summary */}
        <Grid item xs={12} md={5}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Wallet Summary */}
            <Paper elevation={3} sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Virtual Wallet Payment
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography color="text.secondary">Current Balance:</Typography>
                <Typography sx={{ fontWeight: 'bold', color: 'success.main' }}>
                  ₹{user.balance.toLocaleString('en-IN')}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography color="text.secondary">Order Total:</Typography>
                <Typography sx={{ fontWeight: 'bold', color: 'error.main' }}>
                  -₹{cartTotalPrice.toLocaleString('en-IN')}
                </Typography>
              </Box>
              <Divider sx={{ my: 1.5 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography color="text.secondary">Remaining Balance:</Typography>
                <Typography sx={{ fontWeight: 'bold', color: isBalanceInsufficient ? 'error.main' : 'primary.main' }}>
                  ₹{(user.balance - cartTotalPrice).toLocaleString('en-IN')}
                </Typography>
              </Box>
            </Paper>

            {/* Order Items Preview */}
            <Paper elevation={3} sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Items Preview
              </Typography>
              <List disablePadding>
                {cartItems.map((item) => {
                  const discountAmount = item.discount ? (item.price * item.discount) / 100 : 0;
                  const finalPrice = item.price - discountAmount;
                  return (
                    <ListItem key={item.product + item.size} sx={{ py: 1.5, px: 0 }}>
                      <ListItemText 
                        primary={item.name} 
                        secondary={`Qty: ${item.qty} x ₹${finalPrice.toLocaleString('en-IN')} | Size: ${item.size || 'M'}`} 
                        primaryTypographyProps={{ fontWeight: 'medium' }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        ₹{(item.qty * finalPrice).toLocaleString('en-IN')}
                      </Typography>
                    </ListItem>
                  );
                })}
              </List>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Checkout;
