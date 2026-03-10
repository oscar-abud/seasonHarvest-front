import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'

function DeleteExtraItemDialog({ open, item, onClose, onConfirmDelete, deleting }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, color: '#212121' }}>
        Eliminar producto extra
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Eliminar <strong>"{item?.name}"</strong> de la lista de productos extras.
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, backgroundColor: '#fff8e1', border: '1px solid #ffe082', borderRadius: 1, p: 1.5 }}>
          <WarningAmberIcon sx={{ color: '#f57f17', fontSize: 22 }} />
          <Typography variant="body2" sx={{ color: '#f57f17', fontWeight: 500 }}>
            Esta acción es irreversible.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={deleting}
          sx={{ textTransform: 'none', borderColor: '#bdbdbd', color: '#616161', '&:hover': { borderColor: '#9e9e9e', backgroundColor: '#f5f5f5' } }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          sx={{ textTransform: 'none', backgroundColor: '#c62828', '&:hover': { backgroundColor: '#b71c1c' } }}
          onClick={onConfirmDelete}
          loading={deleting}
        >
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteExtraItemDialog
