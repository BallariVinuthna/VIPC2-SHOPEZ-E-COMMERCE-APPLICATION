import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const CategoryCard = ({ category, onClick, active }) => {
  // Let's generate a color profile based on category name
  const getGradient = (name) => {
    switch (name.toLowerCase()) {
      case 'electronics':
        return 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)';
      case 'accessories':
        return 'linear-gradient(135deg, #581c87 0%, #a855f7 100%)';
      case 'clothing':
        return 'linear-gradient(135deg, #831843 0%, #db2777 100%)';
      case 'furniture':
        return 'linear-gradient(135deg, #7c2d12 0%, #ea580c 100%)';
      default:
        return 'linear-gradient(135deg, #064e3b 0%, #10b981 100%)';
    }
  };

  return (
    <Card 
      onClick={() => onClick(category)}
      sx={{ 
        cursor: 'pointer',
        background: getGradient(category),
        minHeight: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        border: active ? '3px solid #f472b6' : 'none',
        transition: 'transform 0.2s, box-shadow 0.2s',
        boxShadow: active ? '0 0 15px rgba(244,114,182,0.6)' : '0 4px 6px rgba(0,0,0,0.1)',
        '&:hover': {
          transform: 'scale(1.03)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
        }
      }}
    >
      <Box sx={{ 
        position: 'absolute',
        top: '-20px',
        right: '-20px',
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.1)'
      }} />

      <CardContent sx={{ zIndex: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
          {category}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
