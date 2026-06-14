import React, { useContext, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, Avatar, Container, Badge } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItemsCount } = useContext(CartContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    const isValAdmin = user && user.role === 'ADMIN';
    logout();
    if (isValAdmin) {
      navigate('/admin/login');
    } else {
      navigate('/');
    }
  };

  return (
    <AppBar position="static" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <ShowChartIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'primary.main' }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            SHOPEZ
          </Typography>

          {/* Left Navigation links */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            <Button component={Link} to="/dashboard" sx={{ my: 2, color: 'white', display: 'block' }}>
              Stocks Market
            </Button>
            {user && (
              <Button component={Link} to="/portfolio" sx={{ my: 2, color: 'white', display: 'block' }}>
                Stocks Portfolio
              </Button>
            )}
            
            {/* E-Commerce shop links */}
            <Button component={Link} to="/shop" sx={{ my: 2, color: 'secondary.light', display: 'block', fontWeight: 'bold' }}>
              Shop Products
            </Button>
            {user && user.role === 'USER' && (
              <Button component={Link} to="/orders" sx={{ my: 2, color: 'white', display: 'block' }}>
                My Orders
              </Button>
            )}

            {/* Admin-only links */}
            {user && user.role === 'ADMIN' && (
              <>
                <Button component={Link} to="/admin" sx={{ my: 2, color: 'warning.main', display: 'block', fontWeight: 'bold' }}>
                  Admin Panel
                </Button>
                <Button component={Link} to="/admin/products" sx={{ my: 2, color: 'warning.light', display: 'block' }}>
                  Manage Products
                </Button>
              </>
            )}
          </Box>

          {/* Right Navigation controls */}
          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 2.5 }}>
            
            {/* Cart Icon with badge count */}
            {user && user.role === 'USER' && (
              <IconButton 
                component={Link} 
                to="/cart" 
                color="inherit"
                sx={{ 
                  bgcolor: 'rgba(236,72,153,0.1)', 
                  color: 'secondary.main',
                  '&:hover': { bgcolor: 'rgba(236,72,153,0.2)' }
                }}
              >
                <Badge badgeContent={cartItemsCount} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            )}

            {user ? (
              <>
                <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
                  Wallet: <Box component="span" sx={{ color: 'success.main', fontWeight: 'bold' }}>₹{user.balance?.toLocaleString('en-IN')}</Box>
                </Typography>
                <IconButton onClick={handleMenu} sx={{ p: 0 }}>
                  <Avatar alt={user.name} src={user.profileImage} />
                </IconButton>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem disabled>
                    <Typography textAlign="center">{user.name} ({user.role})</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleClose} component={Link} to="/profile">
                    <Typography textAlign="center">My Profile</Typography>
                  </MenuItem>
                  {user.role === 'ADMIN' && (
                    <MenuItem onClick={handleClose} component={Link} to="/admin">
                      <Typography textAlign="center">Console Dashboard</Typography>
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleLogout}>
                    <Typography textAlign="center" color="error">Logout</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button component={Link} to="/admin/login" color="warning" sx={{ fontSize: '0.85rem' }}>Admin Console</Button>
                <Button component={Link} to="/login" color="inherit">Login</Button>
                <Button component={Link} to="/register" variant="contained" color="primary">Sign Up</Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
