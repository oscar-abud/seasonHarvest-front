import { useState } from 'react'
import {
  Box, Card, Avatar, Typography, Divider, Chip, IconButton,
  TextField, Button, InputAdornment,
  Dialog, DialogContent, DialogActions,
} from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import BadgeIcon from '@mui/icons-material/Badge'
import LockIcon from '@mui/icons-material/Lock'
import EditIcon from '@mui/icons-material/Edit'
import CloseIcon from '@mui/icons-material/Close'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import useUserStore from '../../store/store'
import { fetchData } from '../../service'
import { toast } from 'sonner'

const fieldSx = {
  '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#005e4d' } },
  '& .MuiInputLabel-root.Mui-focused': { color: '#005e4d' },
}

function Perfil() {
  const userData = useUserStore((state) => state.userData)
  const setUser = useUserStore((state) => state.setUser);

  const [showPassword, setShowPassword] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!userData) return null

  const initials = userData.name[0].toUpperCase() + userData.lastname[0].toUpperCase()

  const emailEmpty = editEmail.trim() === '';
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editEmail);
  const passwordChanged = editPassword.length > 0;
  const passwordsMatch = editPassword === confirmPassword;
  const passwordEmpty   = editPassword.trim() === '';
  const hasChanges = editEmail !== userData.email || editPassword !== userData.password;
  const isSaveDisabled = emailEmpty || !emailValid || passwordEmpty || (passwordChanged && !passwordsMatch) || !hasChanges;

  const handleOpenDialog = () => {
    setEditEmail(userData.email)
    setEditPassword(userData.password)
    setConfirmPassword(userData.password)
    setShowEditPassword(false)
    setShowConfirmPassword(false)
    setDialogOpen(true)
  }

  const handleCloseDialog = () => setDialogOpen(false)

  const handleSave = async (e) => {
    // TODO: conectar con endpoint del backend
    console.log('Guardar:', { email: editEmail, password: editPassword });
    e.preventDefault();
    try {
      const data = await fetchData('user/update', 'PATCH', null, { email: editEmail, password: editPassword });
      if (data) {
        setUser(data.user);
        // Por si en un futuro se agrega token en el response de la api
        // if (data.token) {
        //     sessionStorage.clear();
        //     sessionStorage.setItem('token', JSON.stringify({ token: data.token }))
        // }
        toast.success(data.message);
        setDialogOpen(false)
      }
    } catch (error) {
      console.error('Error en update profile', error)
      toast.error(error.message || "Hubo un problema al actualizar");
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>

      {/* ── Card de perfil (solo lectura) ── */}
      <Card sx={{ width: 380, borderRadius: 3, overflow: 'visible', boxShadow: 4 }}>

        <Box sx={{ height: 100, background: 'linear-gradient(135deg, #005e4d 0%, #00a67c 100%)', borderRadius: '12px 12px 0 0' }} />

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: '-48px' }}>
          <Avatar sx={{ width: 96, height: 96, fontSize: '2rem', fontWeight: 700, bgcolor: '#fff', color: '#005e4d', border: '4px solid #fff', boxShadow: 3 }}>
            {initials}
          </Avatar>
        </Box>

        <Box sx={{ textAlign: 'center', px: 3, pt: 1.5, pb: 2 }}>
          <Typography variant="h6" fontWeight={700}>{userData.name} {userData.lastname}</Typography>
          <Chip label="Usuario" size="small" sx={{ mt: 0.5, backgroundColor: '#e8f5e9', color: '#005e4d', fontWeight: 600, fontSize: '0.75rem' }} />
        </Box>

        <Divider sx={{ mx: 3 }} />

        <Box sx={{ px: 3, py: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <EmailIcon sx={{ color: '#005e4d', fontSize: 20 }} />
            <Box>
              <Typography variant="caption" color="text.secondary" lineHeight={1}>Correo electrónico</Typography>
              <Typography variant="body2" fontWeight={500}>{userData.email}</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <LockIcon sx={{ color: '#005e4d', fontSize: 20 }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary" lineHeight={1}>Contraseña</Typography>
              <Typography variant="body2" fontWeight={500} sx={{ letterSpacing: showPassword ? 0 : 2 }}>
                {showPassword ? userData.password : '••••••••'}
              </Typography>
            </Box>
            <IconButton size="small" onClick={() => setShowPassword((p) => !p)} sx={{ color: '#005e4d' }}>
              {showPassword ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
            </IconButton>
          </Box>

        </Box>

        <Divider sx={{ mx: 3 }} />

        <Box sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<EditIcon />}
            onClick={handleOpenDialog}
            sx={{ textTransform: 'none', borderColor: '#005e4d', color: '#005e4d' }}
          >
            Editar perfil
          </Button>
        </Box>

      </Card>

      {/* ── Dialog de edición ── */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, overflow: 'visible' } }}
      >
        {/* Header con gradiente */}
        <Box sx={{ background: 'linear-gradient(135deg, #005e4d 0%, #00a67c 100%)', pt: 3, pb: 6, px: 3, borderRadius: '12px 12px 0 0', position: 'relative' }}>
          <IconButton onClick={handleCloseDialog} size="small" sx={{ position: 'absolute', top: 8, right: 8, color: 'rgba(255,255,255,0.8)', '&:hover': { color: 'white' } }}>
            <CloseIcon fontSize="small" />
          </IconButton>
          <Typography variant="h6" fontWeight={700} color="white">Editar perfil</Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)', mt: 0.25 }}>
            {userData.name} {userData.lastname}
          </Typography>
        </Box>

        {/* Avatar flotando */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: '-30px', mb: 0.5 }}>
          <Avatar sx={{ width: 60, height: 60, fontSize: '1.25rem', fontWeight: 700, bgcolor: '#fff', color: '#005e4d', border: '3px solid #fff', boxShadow: 3 }}>
            {initials}
          </Avatar>
        </Box>

        <DialogContent sx={{ pt: 1, pb: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="body2" color="text.secondary" textAlign="center" mb={0.5}>
            Modifica tu correo o contraseña
          </Typography>

          <TextField
            label="Correo electrónico"
            type="email"
            fullWidth
            size="small"
            value={editEmail}
            onChange={(e) => setEditEmail(e.target.value)}
            error={!emailEmpty && !emailValid}
            helperText={!emailEmpty && !emailValid ? 'Ingresa un correo válido' : ''}
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: '#005e4d', fontSize: 20 }} /></InputAdornment>,
              }
            }}
            sx={fieldSx}
          />

          <TextField
            label="Nueva contraseña"
            type={showEditPassword ? 'text' : 'password'}
            fullWidth
            size="small"
            value={editPassword}
            onChange={(e) => setEditPassword(e.target.value)}
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: '#005e4d', fontSize: 20 }} /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" tabIndex={-1} onClick={() => setShowEditPassword((p) => !p)}>
                      {showEditPassword ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }
            }}
            sx={fieldSx}
          />

          <TextField
            label="Repetir contraseña"
            type={showConfirmPassword ? 'text' : 'password'}
            fullWidth
            size="small"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={confirmPassword.length > 0 && !passwordsMatch}
            helperText={confirmPassword.length > 0 && !passwordsMatch ? 'Las contraseñas no coinciden' : ''}
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: confirmPassword.length > 0 && !passwordsMatch ? 'error.main' : '#005e4d', fontSize: 20 }} /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" tabIndex={-1} onClick={() => setShowConfirmPassword((p) => !p)}>
                      {showConfirmPassword ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }
            }}
            sx={{
              ...fieldSx,
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': { borderColor: confirmPassword.length > 0 && !passwordsMatch ? 'error.main' : '#005e4d' },
              },
            }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2.5, gap: 1 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleCloseDialog}
            sx={{ textTransform: 'none', borderColor: '#005e4d', color: '#005e4d' }}
          >
            Cancelar
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={handleSave}
            disabled={isSaveDisabled}
            sx={{ textTransform: 'none', backgroundColor: '#005e4d', '&:hover': { backgroundColor: '#004a3d' } }}
          >
            Guardar cambios
          </Button>
        </DialogActions>

      </Dialog>

    </Box>
  )
}

export default Perfil