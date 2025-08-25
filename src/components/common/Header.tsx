import React from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutButton from './LogoutButton';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useAppSelector } from '../../app/hooks';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const { roles } = useAppSelector((s) => s.auth);

  // Yetki kontrolleri
  const canSeeAdmins = roles.includes('Admin') || roles.includes('SuperAdmin');
  const canSeeAuthorizedPersons =
    roles.includes('Admin') || roles.includes('SuperAdmin') || roles.includes('Manager');

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: '#2c3e50',
          top: 0,
          left: 0,
          right: 0,
          boxShadow: 'none',
          margin: 0,
          padding: 0,
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            minHeight: 0,
            px: { xs: 1, sm: 2, md: 3 },
          }}
        >
          {/* Logo */}
          <Box
            component="div"
            onClick={() => navigate('/dashboard')}
            sx={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              cursor: 'pointer',
              p: 0,
              m: 0,
            }}
          >
            <img
              src={logo}
              alt="CRM Logo"
              style={{ height: '63px', width: 'auto', display: 'block' }}
            />
          </Box>

          {/* Masaüstü menü */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              ml: { md: '55px' },
              gap: 0.5,
            }}
          >
            <Button
              color="inherit"
              startIcon={<DashboardIcon />}
              onClick={() => navigate('/dashboard')}
              sx={{ textTransform: 'none', px: 1 }}
            >
              Dashboard
            </Button>

            <Button
              color="inherit"
              startIcon={<PeopleIcon />}
              onClick={() => navigate('/customers')}
              sx={{ textTransform: 'none', px: 1 }}
            >
              Customers
            </Button>

            <Button
              color="inherit"
              startIcon={<InventoryIcon />}
              onClick={() => navigate('/products')}
              sx={{ textTransform: 'none', px: 1 }}
            >
              Products
            </Button>

            {canSeeAuthorizedPersons && (
              <Button
                color="inherit"
                startIcon={<PeopleIcon />}
                onClick={() => navigate('/authorized-persons')}
                sx={{ textTransform: 'none', px: 1 }}
              >
                Authorized Persons
              </Button>
            )}

            {canSeeAdmins && (
              <Button
                color="inherit"
                startIcon={<AdminPanelSettingsIcon />}
                onClick={() => navigate('/admins')}
                sx={{ textTransform: 'none', px: 1 }}
              >
                Admins
              </Button>
            )}
          </Box>

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Çıkış butonu */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LogoutButton />
          </Box>

          {/* Mobil menü */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, ml: 1 }}>
            <IconButton
              color="inherit"
              aria-label="menu"
              aria-controls={anchorEl ? 'header-menu' : undefined}
              aria-haspopup="true"
              onClick={handleMenu}
              size="large"
            >
              <MenuIcon />
            </IconButton>

            <Menu
              id="header-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem
                onClick={() => {
                  navigate('/dashboard');
                  handleClose();
                }}
              >
                <DashboardIcon sx={{ mr: 1 }} /> Dashboard
              </MenuItem>

              <MenuItem
                onClick={() => {
                  navigate('/customers');
                  handleClose();
                }}
              >
                <PeopleIcon sx={{ mr: 1 }} /> Customers
              </MenuItem>

              <MenuItem
                onClick={() => {
                  navigate('/products');
                  handleClose();
                }}
              >
                <InventoryIcon sx={{ mr: 1 }} /> Products
              </MenuItem>

              {canSeeAuthorizedPersons && (
                <MenuItem
                  onClick={() => {
                    navigate('/authorized-persons');
                    handleClose();
                  }}
                >
                  <PeopleIcon sx={{ mr: 1 }} /> Authorized Persons
                </MenuItem>
              )}

              {canSeeAdmins && (
                <MenuItem
                  onClick={() => {
                    navigate('/admins');
                    handleClose();
                  }}
                >
                  <AdminPanelSettingsIcon sx={{ mr: 1 }} /> Admins
                </MenuItem>
              )}

              <MenuItem onClick={handleClose}>
                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                  <LogoutButton />
                </Box>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Header yüksekliği kadar boşluk */}
      <Toolbar />
    </>
  );
};

export default Header;
