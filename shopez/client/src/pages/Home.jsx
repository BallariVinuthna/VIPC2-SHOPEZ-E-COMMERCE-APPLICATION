import React, { useState, useEffect, useContext } from 'react';
import { Container, Grid, Typography, Box, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Banner from '../components/Banner';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import { CartContext } from '../context/CartContext';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SecurityIcon from '@mui/icons-material/Security';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const Home = () => {
  const [config, setConfig] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const [addedMessage, setAddedMessage] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [configRes, productsRes] = await Promise.all([
          api.get('/admin/config'),
          api.get('/products')
        ]);
        setConfig(configRes.data);
        // Take first 4 products as featured products
        setFeaturedProducts(productsRes.data.slice(0, 4));
        setLoading(false);
      } catch (err) {
        console.error('Failed to load home page data', err);
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const handleQuickAdd = (product) => {
    addToCart(product, 1);
    setAddedMessage(prev => ({ ...prev, [product._id]: true }));
    setTimeout(() => {
      setAddedMessage(prev => ({ ...prev, [product._id]: false }));
    }, 2000);
  };

  const handleCategoryClick = (categoryName) => {
    // Navigate to shop with the category query or state
    navigate(`/shop`, { state: { selectedCategory: categoryName } });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ pb: 8 }}>
      {/* Banner / Announcement Slider */}
      <Banner message={config?.banner} />

      {/* Categories Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, letterSpacing: 0.5 }}>
          Shop by Department
        </Typography>
        <Grid container spacing={3}>
          {(config?.categories || ['Electronics', 'Accessories', 'Furniture', 'Clothing']).map((cat) => (
            <Grid item xs={12} sm={6} md={3} key={cat}>
              <CategoryCard 
                category={cat} 
                onClick={handleCategoryClick} 
                active={false} 
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Featured Products Section */}
      <Box sx={{ mb: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', letterSpacing: 0.5 }}>
            Trending Now
          </Typography>
          <Button variant="outlined" color="primary" onClick={() => navigate('/shop')}>
            View All Products
          </Button>
        </Box>
        <Grid container spacing={3}>
          {featuredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
              <ProductCard 
                product={product} 
                onQuickAdd={handleQuickAdd} 
                added={addedMessage[product._id]} 
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Value Propositions Section */}
      <Box sx={{ 
        bgcolor: 'background.paper', 
        borderRadius: 4, 
        p: 6,
        border: '1px solid',
        borderColor: 'divider',
        textAlign: 'center'
      }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 5 }}>
          The SHOPEZ Experience
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <LocalShippingIcon sx={{ fontSize: 50, color: 'primary.light', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              Express Shipping
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Free delivery on all products. Track your orders directly from your user profile.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <AccountBalanceWalletIcon sx={{ fontSize: 50, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              Virtual Balance Checkout
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Experience risk-free purchase simulation using your complimentary ₹50 Lakhs virtual wallet.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <SecurityIcon sx={{ fontSize: 50, color: 'secondary.main', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              Secure Infrastructure
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fully verified JWT authentication, role-based protection, and robust order verification.
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;
