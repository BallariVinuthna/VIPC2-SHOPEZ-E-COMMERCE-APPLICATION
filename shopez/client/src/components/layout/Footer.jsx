import React from 'react';
import { Box, Container, Grid, Typography, Link, TextField, Button, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

const Footer = () => {
  return (
    <Box sx={{ 
      bgcolor: '#0f172a', // Slate 900
      color: '#f8fafc',
      pt: 8,
      pb: 4,
      borderTop: '1px solid',
      borderColor: 'divider',
      mt: 'auto'
    }}>
      <Container maxWidth="xl">
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {/* Brand info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ShoppingBagIcon sx={{ color: 'secondary.main', mr: 1, fontSize: 30 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
                SHOPEZ
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, pr: { md: 4 } }}>
              Experience state-of-the-art MERN e-commerce shopping. Explore high-quality curated apparel, top tier accessories, cutting-edge electronics, and home essentials.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton color="inherit" size="small" sx={{ '&:hover': { color: 'primary.main' } }}>
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" size="small" sx={{ '&:hover': { color: 'primary.main' } }}>
                <TwitterIcon />
              </IconButton>
              <IconButton color="inherit" size="small" sx={{ '&:hover': { color: 'primary.main' } }}>
                <InstagramIcon />
              </IconButton>
              <IconButton color="inherit" size="small" sx={{ '&:hover': { color: 'primary.main' } }}>
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Links 1 */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
              Shop Departments
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Link href="/shop" color="text.secondary" underline="none" sx={{ '&:hover': { color: 'primary.light' } }}>Electronics</Link>
              <Link href="/shop" color="text.secondary" underline="none" sx={{ '&:hover': { color: 'primary.light' } }}>Accessories</Link>
              <Link href="/shop" color="text.secondary" underline="none" sx={{ '&:hover': { color: 'primary.light' } }}>Clothing</Link>
              <Link href="/shop" color="text.secondary" underline="none" sx={{ '&:hover': { color: 'primary.light' } }}>Furniture</Link>
            </Box>
          </Grid>

          {/* Links 2 */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
              Customer Support
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Link href="/orders" color="text.secondary" underline="none" sx={{ '&:hover': { color: 'primary.light' } }}>Track Order</Link>
              <Link href="/profile" color="text.secondary" underline="none" sx={{ '&:hover': { color: 'primary.light' } }}>My Wallet</Link>
              <Link href="#" color="text.secondary" underline="none" sx={{ '&:hover': { color: 'primary.light' } }}>Terms & Conditions</Link>
              <Link href="#" color="text.secondary" underline="none" sx={{ '&:hover': { color: 'primary.light' } }}>Privacy Policy</Link>
            </Box>
          </Grid>

          {/* Newsletter */}
          <Grid item xs={12} sm={4} md={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
              Stay Updated
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Subscribe to get notified about sales, new arrivals, and special promo events.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField 
                size="small" 
                placeholder="Enter email address" 
                variant="outlined" 
                fullWidth
                sx={{ 
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  input: { color: 'text.primary' }
                }}
              />
              <Button variant="contained" color="secondary">
                Join
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ 
          pt: 4, 
          borderTop: '1px solid', 
          borderColor: 'rgba(255,255,255,0.1)', 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          justifyContent: 'space-between', 
          alignItems: 'center',
          gap: 2
        }}>
          <Typography variant="body2" color="text.secondary">
            &copy; {new Date().getFullYear()} SHOPEZ E-Commerce Inc. All rights reserved.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Designed for premium shopping simulation.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
