import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Banner = ({ message }) => {
  return (
    <Box sx={{ 
      position: 'relative',
      background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
      borderRadius: 4,
      p: { xs: 4, md: 6 },
      mb: 6,
      overflow: 'hidden',
      boxShadow: '0 10px 30px -10px rgba(99,102,241,0.5)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      minHeight: '220px'
    }}>
      {/* Background design accents */}
      <Box sx={{ 
        position: 'absolute',
        top: '-50px',
        right: '-50px',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'rgba(236,72,153,0.15)',
        filter: 'blur(30px)'
      }} />
      <Box sx={{ 
        position: 'absolute',
        bottom: '-30px',
        left: '20%',
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        background: 'rgba(99,102,241,0.2)',
        filter: 'blur(25px)'
      }} />

      <Box sx={{ position: 'relative', zIndex: 1, maxWidth: '600px' }}>
        <Typography variant="caption" sx={{ 
          color: 'secondary.light', 
          fontWeight: 'bold', 
          textTransform: 'uppercase', 
          letterSpacing: 2, 
          display: 'block',
          mb: 1
        }}>
          Limited Time Offer
        </Typography>
        <Typography variant="h3" sx={{ 
          fontWeight: 900, 
          mb: 2, 
          lineHeight: 1.2,
          background: 'linear-gradient(to right, #ffffff, #e2e8f0)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          {message || 'Welcome to SHOPEZ! Your premium e-commerce marketplace.'}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Shop premium apparel, electronics, accessories, and home items using your virtual wallet balance.
        </Typography>
        <Button 
          variant="contained" 
          color="secondary" 
          component={Link} 
          to="/shop"
          sx={{ 
            fontWeight: 'bold', 
            px: 3, 
            py: 1.2,
            boxShadow: '0 4px 14px 0 rgba(236,72,153,0.4)',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0 6px 20px 0 rgba(236,72,153,0.6)'
            }
          }}
        >
          Explore Collection
        </Button>
      </Box>
    </Box>
  );
};

export default Banner;
