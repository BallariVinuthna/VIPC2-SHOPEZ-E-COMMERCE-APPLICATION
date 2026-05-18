import React, { useContext, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, Avatar, Container } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
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
    logout();
    navigate('/');
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

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button component={Link} to="/dashboard" sx={{ my: 2, color: 'white', display: 'block' }}>
              Market
            </Button>
            {user && (
              <Button component={Link} to="/portfolio" sx={{ my: 2, color: 'white', display: 'block' }}>
                Portfolio
              </Button>
            )}
            {user && user.role === 'ADMIN' && (
              <Button component={Link} to="/admin" sx={{ my: 2, color: 'warning.main', display: 'block' }}>
                Admin Panel
              </Button>
            )}
          </Box>

          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 2 }}>
            {user ? (
              <>
                <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
                  Balance: <Box component="span" sx={{ color: 'success.main', fontWeight: 'bold' }}>${user.balance?.toLocaleString()}</Box>
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
                    <Typography textAlign="center">{user.name}</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <Typography textAlign="center" color="error">Logout</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
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
