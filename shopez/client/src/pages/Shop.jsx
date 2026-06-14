import React, { useState, useEffect, useContext } from 'react';
import { Container, Grid, Typography, Box, CircularProgress, TextField, InputAdornment, Button, Chip, Pagination } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Link, useLocation } from 'react-router-dom';
import api from '../services/api';
import { CartContext } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

const Shop = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedGender, setSelectedGender] = useState('All');
  
  const [error, setError] = useState('');
  const { addToCart } = useContext(CartContext);
  const [addedMessage, setAddedMessage] = useState({});

  // Fetch Categories Config once
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const configRes = await api.get('/admin/config');
        setCategories(['All', ...(configRes.data?.categories || ['Electronics', 'Accessories', 'Furniture', 'Clothing'])]);
        
        // Handle incoming redirect filter state from Home page
        if (location.state && location.state.selectedCategory) {
          setSelectedCategory(location.state.selectedCategory);
          setPage(1);
        }
      } catch (err) {
        console.error('Failed to fetch categories config', err);
      }
    };
    fetchConfig();
  }, [location.state]);

  // Debounce search query changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on search change
    }, 450);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset page when category or gender change
  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setPage(1);
  };

  const handleGenderChange = (gender) => {
    setSelectedGender(gender);
    setPage(1);
  };

  // Fetch paginated products based on query parameters
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/products', {
          params: {
            page,
            limit: 8,
            search: debouncedSearch,
            category: selectedCategory,
            gender: selectedGender
          }
        });
        
        // Check if backend returned paginated object or fallback flat array
        if (data.products) {
          setProducts(data.products);
          setPages(data.pages || 1);
        } else {
          setProducts(data);
          setPages(1);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products catalog');
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page, debouncedSearch, selectedCategory, selectedGender]);

  const handleQuickAdd = (product) => {
    addToCart(product, 1);
    setAddedMessage(prev => ({ ...prev, [product._id]: true }));
    setTimeout(() => {
      setAddedMessage(prev => ({ ...prev, [product._id]: false }));
    }, 2000);
  };

  if (loading && products.length === 0) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress color="secondary" /></Box>;
  if (error) return <Typography color="error" align="center" mt={4}>{error}</Typography>;

  return (
    <Container maxWidth="xl" sx={{ pb: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          E-Commerce Marketplace
        </Typography>
        <Button variant="outlined" component={Link} to="/orders" color="secondary">
          View My Orders
        </Button>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search products by name, category, or description..."
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

      {/* Filter Chips Panel */}
      <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Category Filters */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', minWidth: '80px' }}>
            Category:
          </Typography>
          {categories.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              clickable
              color={selectedCategory === cat ? 'primary' : 'default'}
              onClick={() => handleCategoryChange(cat)}
              sx={{ fontWeight: selectedCategory === cat ? 'bold' : 'normal' }}
            />
          ))}
        </Box>

        {/* Gender Filters */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', minWidth: '80px' }}>
            Gender:
          </Typography>
          {['All', 'Men', 'Women', 'Unisex'].map((gender) => (
            <Chip
              key={gender}
              label={gender}
              clickable
              color={selectedGender === gender ? 'secondary' : 'default'}
              onClick={() => handleGenderChange(gender)}
              sx={{ fontWeight: selectedGender === gender ? 'bold' : 'normal' }}
            />
          ))}
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress color="secondary" /></Box>
      ) : products.length === 0 ? (
        <Typography variant="h6" align="center" color="text.secondary" sx={{ mt: 8 }}>
          No products match your active search or filters.
        </Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                <ProductCard
                  product={product}
                  onQuickAdd={handleQuickAdd}
                  added={addedMessage[product._id]}
                />
              </Grid>
            ))}
          </Grid>
          {pages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <Pagination 
                count={pages} 
                page={page} 
                onChange={(e, val) => setPage(val)} 
                color="primary" 
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default Shop;
