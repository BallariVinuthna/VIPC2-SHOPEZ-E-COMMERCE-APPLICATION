import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const Loader = ({ message }) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '60vh',
      gap: 2
    }}>
      <CircularProgress color="secondary" size={50} />
      <Typography variant="body1" color="text.secondary">
        {message || 'Loading Shopez Experience...'}
      </Typography>
    </Box>
  );
};

export default Loader;
