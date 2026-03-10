import { useState, useEffect } from 'react'
import {
  Box, Typography, Dialog, DialogContent, DialogActions,
  TextField, Button, IconButton, Select, MenuItem,
  FormControl, InputLabel, InputAdornment,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'

const fieldSx = {
  '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#005e4d' } },
  '& .MuiInputLabel-root.Mui-focused': { color: '#005e4d' },
}

const TIPOS = ['un', 'gr', 'kg']

function AddEditExtraItem({ open, onClose, onSave, saving, item = null }) {
  const isEdit = Boolean(item?._id)

  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [type, setType] = useState('un')
  const [price, setPrice] = useState('')

  useEffect(() => {
    if (!open) return
    if (item) {
      setName(item.name)
      setQuantity(String(item.quantity))
      setType(item.type)
      setPrice(String(item.price))
    } else {
      setName('')
      setQuantity('')
      setType('un')
      setPrice('')
    }
  }, [item, open])

  const handleSave = () => {
    onSave({ name: name.trim(), quantity: Number(quantity), type, price: Number(price) })
  }

  const isSaveDisabled =
    !name.trim() ||
    !quantity ||
    Number(quantity) <= 0 ||
    !price ||
    Number(price) <= 0

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <Box sx={{
        background: 'linear-gradient(135deg, #005e4d 0%, #00a67c 100%)',
        pt: 3, pb: 3, px: 3,
        borderRadius: '12px 12px 0 0',
        position: 'relative',
      }}>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ position: 'absolute', top: 8, right: 8, color: 'rgba(255,255,255,0.8)', '&:hover': { color: 'white' } }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <AddShoppingCartIcon sx={{ color: 'white', fontSize: 28 }} />
          <Box>
            <Typography variant="h6" fontWeight={700} color="white">
              {isEdit ? 'Editar producto extra' : 'Agregar producto extra'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>
              {isEdit ? item.name : 'Nuevo ítem'}
            </Typography>
          </Box>
        </Box>
      </Box>

      <DialogContent sx={{ pt: 3, pb: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <TextField
          label="Nombre"
          fullWidth
          size="small"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={fieldSx}
        />

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <TextField
            label="Cantidad"
            type="number"
            size="small"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            slotProps={{ htmlInput: { min: 1, step: 1 } }}
            sx={{ ...fieldSx, flex: 1 }}
          />
          <FormControl size="small" sx={{ ...fieldSx, width: 100 }}>
            <InputLabel>Tipo</InputLabel>
            <Select
              label="Tipo"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              {TIPOS.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>

        <TextField
          label="Precio"
          type="number"
          size="small"
          fullWidth
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          slotProps={{ input: { startAdornment: <InputAdornment position="start">$</InputAdornment> } }}
          sx={fieldSx}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2.5, gap: 1 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={onClose}
          disabled={saving}
          sx={{ textTransform: 'none', borderColor: '#005e4d', color: '#005e4d' }}
        >
          Cancelar
        </Button>
        <Button
          fullWidth
          variant="contained"
          onClick={handleSave}
          disabled={isSaveDisabled}
          loading={saving}
          sx={{ textTransform: 'none', backgroundColor: '#005e4d', '&:hover': { backgroundColor: '#004a3d' } }}
        >
          {isEdit ? 'Guardar cambios' : 'Agregar'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddEditExtraItem
