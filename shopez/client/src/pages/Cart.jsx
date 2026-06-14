import React, { useContext } from 'react';
import { Container, Typography, Box, Grid, Button, Divider, Paper } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import CartItem from '../components/CartItem';

const Cart = () => {
  const { cartItems, updateCartQty, removeFromCart, cartTotalPrice, cartItemsCount } = useContext(CartContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
        Shopping Cart
      </Typography>

      {cartItems.length === 0 ? (
        <Paper elevation={1} sx={{ p: 5, textAlign: 'center', bgcolor: 'background.paper', borderRadius: 2 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Your cart is currently empty.
          </Typography>
          <Button 
            variant="contained" 
            component={Link} 
            to="/shop" 
            startIcon={<ArrowBackIcon />}
            sx={{ mt: 2 }}
          >
            Go Shopping
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={4}>
          {/* Cart Items List */}
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {cartItems.map((item) => (
                <CartItem
                  key={item._id || item.product}
                  item={item}
                  onQtyChange={updateCartQty}
                  onRemove={removeFromCart}
                />
              ))}
            </Box>
            
            <Button 
              startIcon={<ArrowBackIcon />} 
              component={Link} 
              to="/shop" 
              sx={{ mt: 3 }}
              color="inherit"
            >
              Continue Shopping
            </Button>
          </Grid>

          {/* Cart Summary */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Order Summary
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography color="text.secondary">Items count:</Typography>
                <Typography sx={{ fontWeight: 'bold' }}>{cartItemsCount}</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography color="text.secondary">Shipping:</Typography>
                <Typography sx={{ fontWeight: 'bold', color: 'success.main' }}>FREE</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Total Price:</Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                  ₹{cartTotalPrice.toLocaleString('en-IN')}
                </Typography>
              </Box>

              <Button
                variant="contained"
                color="secondary"
                fullWidth
                size="large"
                onClick={handleCheckout}
                sx={{ py: 1.5, fontWeight: 'bold' }}
              >
                Proceed to Checkout
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Cart;
