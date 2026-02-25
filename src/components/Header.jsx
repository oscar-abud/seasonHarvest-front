import { AppBar, Toolbar, Typography, Button, Box, Tooltip, Avatar, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate, useLocation } from 'react-router-dom';
import useUserStore from '../store/store';
import { useState } from 'react';
import Logo from '../assets/logo.png'

const navItems = [
  { label: 'Inicio', path: '/app' },
  { label: 'Productos', path: '/productos' },
  { label: 'Clientes', path: '/clientes' },
  { label: 'Contacto', path: '#contacto' },
];

const settings = ['Perfil', 'Season Harvest', 'Cerrar Sesión'];

function Header({ onMenuToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isSeasonHarvest = location.pathname.startsWith('/app/season-harvest');

  const userData = useUserStore((state) => state.userData);
  const setUser = useUserStore((state) => state.setUser);

  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user-storage');
    setUser(null);
    handleCloseUserMenu();
    navigate('/login');
  };

  function InicialName(nombre, apellido) {
    return nombre[0] + apellido[0];
  }

  const userSection = userData ? (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title={`${userData.name} ${userData.lastname}`}>
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar sx={{ width: 45, height: 45 }}>
            {InicialName(userData.name, userData.lastname)}
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '45px' }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {settings.map((setting) => (
          <MenuItem
            key={setting}
            onClick={() => {
              if (setting === 'Cerrar Sesión') handleLogout();
              else if (setting === 'Season Harvest') navigate('/app/season-harvest');
              else if (setting === 'Perfil') navigate('/app/perfil');
              handleCloseUserMenu();
            }}
          >
            <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  ) : (
    <Button
      variant="outlined"
      onClick={() => navigate('/login')}
      sx={{
        color: 'white',
        borderColor: 'white',
        textTransform: 'none',
        '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'white' },
      }}
    >
      Iniciar sesión
    </Button>
  );

  return (
    <AppBar position="static" sx={{ backgroundColor: '#005e4d', p: 1 }}>
      <Toolbar sx={{ justifyContent: 'space-between', px: 4 }}>

        {isSeasonHarvest ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {onMenuToggle && (
              <IconButton onClick={onMenuToggle} sx={{ color: 'white' }}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, letterSpacing: 0.5 }}>
              Season Harvest
            </Typography>
          </Box>
        ) : (
          <div style={{ display: 'flex'}}>
            {/* Logo izquierda */}
            <Tooltip title='Season Harvest' sx={{ p: 0, mr: 5 }}>
              <IconButton onClick={() => navigate('/app')} style={{ backgroundColor: 'white'}}>
                <Avatar alt='Season Harvest' src={Logo} sx={{ width: 60, height: 60, p: 0 }} />
              </IconButton>
            </Tooltip>

            {/* Nav central */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  sx={{ color: 'white', textTransform: 'none', fontSize: '0.95rem' }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          </div>
        )}

        {userSection}

      </Toolbar>
    </AppBar>
  );
}

export default Header;
