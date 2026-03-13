import { Button, TextField, Box, Typography, Paper, InputAdornment, CircularProgress, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { toast } from 'sonner';
import { useState } from 'react';
import { fetchData } from '@/services/api/index';
import useUserStore from '@/store/store';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Logo from '@/assets/logo.png';
import { CONST_ENDPOINT_LOGIN_USUARIO } from '@/services/api/constants';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = { email: '', password: '' };
    if (!email) {
      newErrors.email = 'El correo es obligatorio';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Ingresa un correo válido';
    }
    if (!password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres';
    }
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const data = await fetchData(CONST_ENDPOINT_LOGIN_USUARIO, 'POST', null, { email, password });
      if (data) {
        setUser(data.user);
        if (data.token) {
          sessionStorage.setItem('token', JSON.stringify({ token: data.token }));
        }
        toast.success(`Bienvenido de nuevo, ${data.user.name} ${data.user.lastname}`);
        navigate('/app');
      }
    } catch (error) {
      console.error('Error en el login', error);
      const mensajeError = error.message || "Error al iniciar sesión";
      toast.error(mensajeError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f0e6', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
        <Paper
          component="form"
          onSubmit={handleLogin}
          elevation={4}
          sx={{
            width: '100%',
            maxWidth: 420,
            borderRadius: 4,
            overflow: 'hidden',
          }}
        >
          {/* Banner verde superior */}
          <Box
            sx={{
              backgroundColor: '#005e4d',
              py: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Box
              component="img"
              src={Logo}
              alt="Season Harvest"
              sx={{ width: 80, height: 80, borderRadius: '50%', backgroundColor: 'white', p: 0.5 }}
            />
            <Typography variant="h5" fontWeight="bold" color="white" letterSpacing={0.5}>
              Season Harvest
            </Typography>
          </Box>

          {/* Formulario */}
          <Box sx={{ px: 4, py: 4, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box>
              <Typography variant="h5" fontWeight="bold" color="#005e4d">
                Iniciar sesión
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={0.5}>
                Ingresa tus credenciales para continuar
              </Typography>
            </Box>

            <TextField
              label="Correo electrónico"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: errors.email ? 'error.main' : '#005e4d' }} />
                    </InputAdornment>
                  ),
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': { borderColor: errors.email ? 'error.main' : '#005e4d' },
                },
                '& .MuiInputLabel-root.Mui-focused': { color: errors.email ? 'error.main' : '#005e4d' },
              }}
            />

            <TextField
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                  startAdornment: (
                  <InputAdornment position="start">
                      <LockIcon sx={{ color: errors.password ? 'error.main' : '#005e4d' }} />
                  </InputAdornment>
                  ),
                  endAdornment: (
                  <InputAdornment position="end">
                      <IconButton
                        tabIndex={-1}
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                  </InputAdornment>
                  ),
              }}
              sx={{
                  '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': { borderColor: errors.password ? 'error.main' : '#005e4d' },
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: errors.password ? 'error.main' : '#005e4d' },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                backgroundColor: '#005e4d',
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 'bold',
                mt: 0.5,
                '&:hover': { backgroundColor: '#004a3d' },
              }}
            >
              {loading
                ? <CircularProgress size={24} sx={{ color: 'white' }} />
                : 'Iniciar sesión'
              }
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default Login;
