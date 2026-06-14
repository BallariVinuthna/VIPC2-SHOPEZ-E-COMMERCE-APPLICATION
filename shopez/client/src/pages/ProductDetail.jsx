import React, { useState, useEffect, useContext } from 'react';
import { Container, Grid, Typography, Box, CircularProgress, Button, MenuItem, Select, FormControl, InputLabel, Paper, Divider, Rating, Chip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { CartContext } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { addToCart } = useContext(CartContext);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
        if (data.size && data.size.length > 0) {
          setSelectedSize(data.size[0]);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch product details');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress color="secondary" /></Box>;
  if (error) return <Typography color="error" align="center" mt={4}>{error}</Typography>;
  if (!product) return <Typography align="center" mt={4}>Product not found</Typography>;

  // Image Carousel preparation
  const images = product.carousel && product.carousel.length > 0 ? product.carousel : [product.image];
  
  // Price and discount calculations
  const discountAmount = product.discount ? (product.price * product.discount) / 100 : 0;
  const discountedPrice = product.price - discountAmount;
  
  // Sizes list fallback
  const availableSizes = product.size && product.size.length > 0 ? product.size : ['S', 'M', 'L', 'XL'];

  return (
    <Container maxWidth="lg" sx={{ pb: 8 }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        component={Link} 
        to="/shop" 
        sx={{ mb: 3 }}
        color="inherit"
      >
        Back to Shop
      </Button>

      <Grid container spacing={5}>
        {/* Left Side: Product Gallery */}
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2, bgcolor: 'background.paper', borderRadius: 3 }}>
            {/* Active Main Image */}
            <Box sx={{ width: '100%', height: '400px', display: 'flex', justifyContent: 'center', overflow: 'hidden', borderRadius: 2 }}>
              <img 
                src={images[activeImgIndex]} 
                alt={product.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </Box>
            
            {/* Carousel Thumbnails */}
            {images.length > 1 && (
              <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', py: 1 }}>
                {images.map((imgUrl, index) => (
                  <Box 
                    key={index} 
                    onClick={() => setActiveImgIndex(index)}
                    sx={{ 
                      width: '70px', 
                      height: '70px', 
                      borderRadius: 1.5, 
                      overflow: 'hidden', 
                      cursor: 'pointer',
                      border: activeImgIndex === index ? '2.5px solid #ec4899' : '2px solid transparent',
                      boxShadow: activeImgIndex === index ? '0 0 10px rgba(236,72,153,0.4)' : 'none',
                      transition: 'border 0.2s',
                      flexShrink: 0
                    }}
                  >
                    <img src={imgUrl} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Right Side: Product Details */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', gap: 1.5, mb: 1, alignItems: 'center' }}>
              <Chip label={product.category} size="small" color="primary" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }} />
              <Chip label={product.gender || 'Unisex'} size="small" variant="outlined" color="secondary" sx={{ fontWeight: 'bold' }} />
            </Box>
            
            <Typography variant="h3" component="h1" sx={{ fontWeight: 'extrabold', mb: 1.5, fontSize: { xs: '2rem', md: '2.5rem' } }}>
              {product.name}
            </Typography>

            {/* Ratings */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Rating name="read-only-ratings" value={product.ratings || 4.2} precision={0.1} readOnly />
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                ({product.ratings || 4.2} / 5.0)
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />
            
            {/* Prices & Discount */}
            <Box sx={{ mb: 3 }}>
              {product.discount > 0 ? (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h3" color="success.main" sx={{ fontWeight: 'extrabold' }}>
                      ₹{discountedPrice.toLocaleString('en-IN')}
                    </Typography>
                    <Chip label={`${product.discount}% OFF`} color="secondary" sx={{ fontWeight: 'bold' }} />
                  </Box>
                  <Typography variant="body1" sx={{ textDecoration: 'line-through', color: 'text.secondary', mt: 0.5 }}>
                    M.R.P: ₹{product.price.toLocaleString('en-IN')}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="h3" color="success.main" sx={{ fontWeight: 'extrabold' }}>
                  ₹{product.price.toLocaleString('en-IN')}
                </Typography>
              )}
            </Box>

            <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8, color: 'text.secondary' }}>
              {product.description}
            </Typography>

            {/* Order Form Selection Block */}
            <Paper variant="outlined" sx={{ p: 3, mb: 4, bgcolor: 'background.default', borderRadius: 2.5 }}>
              <Grid container spacing={2.5} alignItems="center">
                <Grid item xs={6}>
                  <Typography variant="body1">Availability:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: product.countInStock > 0 ? 'success.main' : 'error.main' }}>
                    {product.countInStock > 0 ? `${product.countInStock} units in stock` : 'Out of Stock'}
                  </Typography>
                </Grid>
                
                {product.countInStock > 0 && (
                  <>
                    {/* Size Selection */}
                    <Grid item xs={6}>
                      <Typography variant="body1">Select Size:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="size-select-label">Size</InputLabel>
                        <Select
                          labelId="size-select-label"
                          id="size-select"
                          value={selectedSize}
                          label="Size"
                          onChange={(e) => setSelectedSize(e.target.value)}
                        >
                          {availableSizes.map((sz) => (
                            <MenuItem key={sz} value={sz}>
                              {sz}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Qty Selection */}
                    <Grid item xs={6}>
                      <Typography variant="body1">Select Quantity:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="qty-select-label">Qty</InputLabel>
                        <Select
                          labelId="qty-select-label"
                          id="qty-select"
                          value={qty}
                          label="Qty"
                          onChange={(e) => setQty(Number(e.target.value))}
                        >
                          {[...Array(product.countInStock).keys()].slice(0, 10).map((x) => (
                            <MenuItem key={x + 1} value={x + 1}>
                              {x + 1}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </>
                )}
              </Grid>
            </Paper>

            <Button
              variant="contained"
              color={added ? 'success' : 'secondary'}
              size="large"
              startIcon={<ShoppingCartIcon />}
              onClick={handleAddToCart}
              disabled={product.countInStock === 0}
              sx={{ 
                py: 1.8, 
                fontSize: '1.1rem', 
                fontWeight: 'bold',
                boxShadow: '0 4px 14px 0 rgba(236,72,153,0.3)',
                '&:hover': {
                  boxShadow: '0 6px 20px 0 rgba(236,72,153,0.5)'
                }
              }}
            >
              {added ? 'Added to Cart!' : 'Add to Cart'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetail;
