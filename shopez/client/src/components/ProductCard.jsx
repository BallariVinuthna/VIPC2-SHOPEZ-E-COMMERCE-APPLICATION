import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Button, Chip, Rating } from '@mui/material';
import { Link } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';

const ProductCard = ({ product, onQuickAdd, added }) => {
  const discountAmount = product.discount ? (product.price * product.discount) / 100 : 0;
  const discountedPrice = product.price - discountAmount;

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': { 
          transform: 'translateY(-6px)',
          boxShadow: '0 12px 24px -10px rgba(99,102,241,0.3)' 
        }
      }}
    >
      {/* Discount Badge */}
      {product.discount > 0 && (
        <Chip 
          label={`${product.discount}% OFF`} 
          color="secondary" 
          size="small" 
          sx={{ 
            position: 'absolute', 
            top: 12, 
            left: 12, 
            fontWeight: 'bold', 
            zIndex: 2,
            boxShadow: '0 2px 8px rgba(236,72,153,0.4)'
          }} 
        />
      )}

      {/* Gender/Category Tag */}
      <Chip 
        label={product.gender || 'Unisex'} 
        color="primary" 
        variant="filled"
        size="small" 
        sx={{ 
          position: 'absolute', 
          top: 12, 
          right: 12, 
          fontWeight: 'bold', 
          zIndex: 2,
          opacity: 0.9,
          fontSize: '0.75rem'
        }} 
      />

      <CardMedia
        component="img"
        height="220"
        image={product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60'}
        alt={product.name}
        sx={{ objectFit: 'cover' }}
      />

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, mb: 0.5, display: 'block' }}>
          {product.category}
        </Typography>

        <Typography 
          variant="h6" 
          component="h2" 
          sx={{ 
            fontWeight: 'bold', 
            mb: 1, 
            lineHeight: 1.3,
            minHeight: '52px', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            display: '-webkit-box', 
            WebkitLineClamp: 2, 
            WebkitBoxOrient: 'vertical',
            fontSize: '1.05rem'
          }}
        >
          {product.name}
        </Typography>

        {/* Ratings */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 0.5 }}>
          <Rating name="read-only" value={product.ratings || 4.2} precision={0.1} readOnly size="small" />
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
            ({product.ratings || 4.2})
          </Typography>
        </Box>

        {/* Prices */}
        <Box sx={{ mt: 'auto', mb: 2 }}>
          {product.discount > 0 ? (
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                ₹{discountedPrice.toLocaleString('en-IN')}
              </Typography>
              <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                ₹{product.price.toLocaleString('en-IN')}
              </Typography>
            </Box>
          ) : (
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'success.main' }}>
              ₹{product.price.toLocaleString('en-IN')}
            </Typography>
          )}
        </Box>

        {/* Actions - Mandatory Shop Now button */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="contained" 
            color="primary" 
            size="small" 
            component={Link} 
            to={`/products/${product._id}`}
            startIcon={<VisibilityIcon />}
            sx={{ 
              flexGrow: 1.2, 
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #6366f1, #4f46e5)'
            }}
          >
            Shop Now
          </Button>
          <Button 
            variant="outlined" 
            color={added ? 'success' : 'secondary'} 
            size="small"
            disabled={product.countInStock === 0}
            onClick={() => onQuickAdd(product)}
            sx={{ minWidth: '48px', p: 1 }}
          >
            <ShoppingCartIcon size="small" />
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
