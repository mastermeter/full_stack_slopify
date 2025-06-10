// src/Navbar.jsx
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
} from '@mui/material';
import { AccountCircle, Menu as MenuIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { NavLink } from 'react-router';

export default function Navbar({ isAuthenticated }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) return;
    setDrawerOpen(open);
  };

  return (
    <AppBar position="sticky">
      <Toolbar sx={{ backgroundColor: '#0a0f49', display: 'flex'}}>
        {isAuthenticated ? (
          <>
            {isSmallScreen ? (
              <>
                <IconButton edge="start" color="inherit" onClick={toggleDrawer(true)}>
                  <MenuIcon />
                </IconButton>
                <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                  <List sx={{ width: 250 }}>
                    <ListItem button component={NavLink} to="/carte">
                      <ListItemText primary="Carte" />
                    </ListItem>
                    <ListItem button component={NavLink} to="/events">
                      <ListItemText primary="Événements" />
                    </ListItem>
                    <ListItem button component={NavLink} to="/myevents">
                      <ListItemText primary="Mes événements" />
                    </ListItem>
                  </List>
                </Drawer>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1, gap: 16 }}>
                <img src="slopify.png" alt="Logo" style={{ height: 40 }} />
                <NavLink to="/carte" style={({ isActive }) => ({color: 'white',textDecoration: 'none',padding: '8px 12px',backgroundColor: isActive ? '#1d296b' : 'transparent',borderRadius: '8px',})}>CARTE</NavLink>
                <NavLink to="/events" style={({ isActive }) => ({color: 'white',textDecoration: 'none',padding: '8px 12px',backgroundColor: isActive ? '#1d296b' : 'transparent',borderRadius: '8px',})}>ÉVÉNEMENTS</NavLink>
                <NavLink to="/myevents" style={({ isActive }) => ({color: 'white',textDecoration: 'none',padding: '8px 12px',backgroundColor: isActive ? '#1d296b' : 'transparent',borderRadius: '8px',})}>MES ÉVÉNEMENTS</NavLink>
              </div>
            )}

            <IconButton edge="end" color="inherit" onClick={handleMenuOpen}>
              <AccountCircle />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem onClick={handleMenuClose}>Profil</MenuItem>
              <MenuItem
                onClick={() => {
                  fetch('http://localhost:3000/logout', {
                    method: 'POST',
                    credentials: 'include',
                  }).then(() => {
                    window.location.href = '/login';
                  });
                  handleMenuClose();
                }}
              >
                Déconnexion
              </MenuItem>
            </Menu>
          </>
        ) : (
          <img src="slopify.png" alt="Logo" style={{ height: 40 }} />
        )}
      </Toolbar>
    </AppBar>
  );
}
