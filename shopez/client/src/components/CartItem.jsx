import React from 'react';
import { Card, Box, Typography, FormControl, Select, MenuItem, IconButton, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';

const CartItem = ({ item, onQtyChange, onRemove }) => {
  const discountAmount = item.discount ? (item.price * item.discount) / 100 : 0;
  const discountedPrice = item.price - discountAmount;
  const finalPrice = discountedPrice;

  return (
    <Card 
      sx={{ 
        p: 2.5, 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' }, 
        alignItems: 'center', 
        gap: 2.5,
        bgcolor: 'background.paper',
        position: 'relative'
      }}
    >
      <img 
        src={item.image} 
        alt={item.name} 
        style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: '8px' }} 
      />
      
      <Box sx={{ flexGrow: 1, textAlign: { xs: 'center', sm: 'left' } }}>
        <Typography 
          variant="subtitle1" 
          component={Link} 
          to={`/products/${item.product}`}
          sx={{ fontWeight: 'bold', textDecoration: 'none', color: 'text.primary', '&:hover': { color: 'primary.main' } }}
        >
          {item.name}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mt: 1, justifyContent: { xs: 'center', sm: 'flex-start' }, alignItems: 'center' }}>
          <Chip label={`Size: ${item.size || 'M'}`} size="small" variant="outlined" color="primary" />
          {item.discount > 0 && (
            <Chip label={`${item.discount}% OFF`} size="small" color="secondary" />
          )}
        </Box>

        <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'baseline', gap: 1.5, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'success.main' }}>
            ₹{finalPrice.toLocaleString('en-IN')}
          </Typography>
          {item.discount > 0 && (
            <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
              ₹{item.price.toLocaleString('en-IN')}
            </Typography>
          )}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
        {/* Quantity selector */}
        <FormControl size="small" sx={{ minWidth: 75 }}>
          <Select
            value={item.qty || item.quantity || 1}
            onChange={(e) => onQtyChange(item, Number(e.target.value))}
          >
            {[...Array(item.countInStock || 10).keys()].slice(0, 10).map((x) => (
              <MenuItem key={x + 1} value={x + 1}>
                {x + 1}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Price total for item */}
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', minWidth: '80px', textAlign: 'right' }}>
          ₹{((item.qty || item.quantity || 1) * finalPrice).toLocaleString('en-IN')}
        </Typography>

        {/* Delete item */}
        <IconButton 
          color="error" 
          onClick={() => onRemove(item._id || item.product)}
          sx={{ bgcolor: 'rgba(239,68,68,0.1)', '&:hover': { bgcolor: 'rgba(239,68,68,0.2)' } }}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    </Card>
  );
};

export default CartItem;
