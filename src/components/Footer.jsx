import { Box, Divider, Link, Typography } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import GitHubIcon from '@mui/icons-material/GitHub';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{ width: '100%', backgroundColor: '#f5f0e6', mt: 'auto' }}
    >
      <Divider />

      {/* Redes sociales */}
      <Box sx={{ py: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Typography variant="body1" fontWeight="bold">
          Síguenos también en nuestras redes sociales.
        </Typography>

        <Box sx={{ display: 'flex', gap: 5 }}>
          <Link
            href="https://www.instagram.com/seasonharvestcl/"
            target="_blank"
            rel="noopener"
            underline="none"
            sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: '#C13584' }}
          >
            <InstagramIcon />
            <Typography variant="body1" color="text.primary">Instagram</Typography>
          </Link>

          <Link
            href="https://www.facebook.com/groups/682660543360573/user/61574804046798/"
            target="_blank"
            rel="noopener"
            underline="none"
            sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: '#1877F2' }}
          >
            <FacebookIcon />
            <Typography variant="body1" color="text.primary">Facebook</Typography>
          </Link>
        </Box>
      </Box>

      <Divider />

      {/* Copyright */}
      <Box sx={{ py: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
        <Typography variant="body2" color="text.secondary">
          Copyright © {new Date().getFullYear()} Season Harvest. Todo los derechos reservados.
        </Typography>

        <Link
          href="https://github.com/oscar-abud"
          target="_blank"
          rel="noopener"
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: 'text.secondary' }}
        >
          <GitHubIcon fontSize="small" />
          <Typography variant="body2">GitHub del desarrollador.</Typography>
        </Link>
      </Box>
    </Box>
  );
}

export default Footer;
