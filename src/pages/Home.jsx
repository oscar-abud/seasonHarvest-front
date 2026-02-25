import { Box, Button, Typography } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Home() {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f0e6', display: 'flex', flexDirection: 'column' }}>

      <Header />

      {/* Contenido principal */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8 }}>

        {/* Logo / imagen central */}
        <Box
          sx={{
            width: 200,
            height: 200,
            borderRadius: '50%',
            border: '3px solid #005e4d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 4,
            backgroundColor: 'white',
          }}
        >
          <Typography variant="h4" fontWeight="bold" color="#005e4d" textAlign="center" lineHeight={1.2}>
            SH
          </Typography>
        </Box>

        {/* Texto debajo del logo */}
        <Typography variant="h4" fontWeight="bold" color="#005e4d" mb={1}>
          Season Harvest
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" mb={4}>
          Calidad del campo a tu mesa
        </Typography>

        <Button
          variant="contained"
          size="large"
          sx={{
            backgroundColor: '#005e4d',
            px: 5,
            py: 1.5,
            textTransform: 'none',
            fontSize: '1rem',
            '&:hover': { backgroundColor: '#004a3d' },
          }}
        >
          Ver productos
        </Button>

      </Box>
      <Box id='contacto' sx={{ minHeight: '100vh' }}>

      </Box>

      <Footer />
    </Box>
  );
}

export default Home;
