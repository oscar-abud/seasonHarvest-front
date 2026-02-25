import { useState, useEffect } from 'react';
import { 
  Container, Typography, Card, CardContent, 
  Box, Grid, Button 
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [pedidos, setPedidos] = useState([]);

  const formatCantidad = (cantidad) => {
    if (cantidad === 0.25) return "1/4";
    if (cantidad === 0.5) return "1/2";
    if (cantidad === 0.75) return "3/4";
    return cantidad; // Si es un entero como 1, 2 o 3, lo deja igual
  };

  useEffect(() => {
    const fetching = async () => {
      try {
        const res = await fetch("http://localhost:8080/pedidos-clientes");
        const data = await res.json();
        setPedidos(data);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };
    fetching();
  }, []);

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ color: '#005e4d', fontWeight: 'bold' }}>
        Nuestros Boxes
      </Typography>

      {pedidos.length === 0 ? (
        <Typography variant="h3" align="center">No hay datos disponibles</Typography>
      ) : (
        <Grid container spacing={6} justifyContent="center">
          {pedidos.map((pedido) => (
            <Grid item xs={12} sm={6} md={4} key={pedido._id} style={{maxWidth: '380px', maxHeight: '480px'}}>
              <Card sx={{ 
                borderRadius: 5,
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                overflow: 'visible',
                border: '1px solid #eee'
              }}>
                <CardContent sx={{ p: 3 }}>
                  
                  {/* Título de la Box */}
                  <Typography variant="h4" align="center" sx={{ color: '#005e4d', fontWeight: 'bold', mb: 2 }}>
                    {pedido.name}
                  </Typography>

                  {/* Banner Morado */}
                  <Box sx={{ 
                    backgroundColor: '#6a1b9a', 
                    color: '#ffd600', 
                    textAlign: 'center', 
                    py: 1, 
                    borderRadius: 1,
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    mb: 2,
                    fontFamily: 'roboto'
                  }}>
                    LISTA PRODUCTOS
                  </Box>

                  {/* Lista de productos en 2 columnas */}
                  <Grid container spacing={3}>
                    {pedido.productos.map((item) => (
                      <Grid size={{ xs: 6, md: 6 }}  key={item._id}>
                        <Typography variant="body2" sx={{ color: '#444', display: 'flex', gap: 0.5 }}>
                          <span style={{ fontWeight: 'bold' }}>{formatCantidad(item.cantidad)}</span>
                          <span style={{ color: '#005e4d', fontWeight: 'bold' }}>{item.tipo}</span>
                          <span>{item.name}</span>
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>

                  {/* Sección Inferior: Botón y Precio */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' 
                  }}>
                    <Button
                      variant="contained"
                      startIcon={<WhatsAppIcon />}
                      sx={{ 
                        backgroundColor: '#005e4d', 
                        borderRadius: 2, 
                        textTransform: 'none',
                        fontSize: '0.8rem',
                        px: 2,
                        '&:hover': { backgroundColor: '#004a3d' }
                      }}
                    >
                      Quiero este producto
                    </Button>

                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="caption" sx={{ color: '#005e4d', fontWeight: 'bold', display: 'block', lineHeight: 1 }}>
                        VALOR BOX
                      </Typography>
                      <Typography variant="h5" sx={{ color: '#005e4d', fontWeight: 'bold' }}>
                        $43.990
                      </Typography>
                    </Box>
                  </Box>

                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default App;