import { useState, useEffect } from 'react'
import {
  Box, Typography, Dialog, DialogContent, DialogActions,
  TextField, Button, IconButton, Switch, FormControlLabel,
  Select, MenuItem, FormControl, InputLabel, Divider, InputAdornment,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'

const fieldSx = {
  '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#005e4d' } },
  '& .MuiInputLabel-root.Mui-focused': { color: '#005e4d' },
}

const TIPOS = ['kg', 'un', 'trozos']

function AddEditProducto({ open, onClose, onSuccess, producto = null }) {
  const isEdit = Boolean(producto?._id)

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [active, setActive] = useState(true)
  const [items, setItems] = useState([])

  useEffect(() => {
    if (!open) return
    if (producto) {
      setName(producto.name)
      setPrice(String(producto.price))
      setActive(producto.state)
      setItems(producto.productos.map(({ name, cantidad, tipo }) => ({ name, cantidad, tipo })))
    } else {
      setName('')
      setPrice('')
      setActive(true)
      setItems([])
    }
  }, [producto, open])

  const handleAddItem = () => {
    setItems(prev => [...prev, { name: '', cantidad: 1, tipo: 'kg' }])
  }

  const handleRemoveItem = (index) => {
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  const handleItemChange = (index, field, value) => {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item))
  }

  const handleSave = () => {
    const payload = {
      name: name.trim(),
      price: Number(price),
      state: active,
      productos: items,
    }
    if (isEdit) {
      console.log('Editar producto:', { _id: producto._id, ...payload })
    } else {
      console.log('Crear producto:', payload)
    }
    onSuccess()
  }

  const isSaveDisabled = !name.trim() || !price || Number(price) <= 0

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      {/* Header */}
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
          <Inventory2OutlinedIcon sx={{ color: 'white', fontSize: 28 }} />
          <Box>
            <Typography variant="h6" fontWeight={700} color="white">
              {isEdit ? 'Editar producto' : 'Crear producto'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>
              {isEdit ? producto.name : 'Nuevo producto'}
            </Typography>
          </Box>
        </Box>
      </Box>

      <DialogContent sx={{ pt: 3, pb: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>

        {/* Nombre */}
        <TextField
          label="Nombre"
          fullWidth
          size="small"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={fieldSx}
        />

        {/* Precio + Estado */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            label="Precio"
            type="number"
            size="small"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            slotProps={{ input: { startAdornment: <InputAdornment position="start">$</InputAdornment> } }}
            sx={{ ...fieldSx, flex: 1 }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: '#005e4d' },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#005e4d' },
                }}
              />
            }
            label={active ? 'Activo' : 'Inactivo'}
          />
        </Box>

        <Divider />

        {/* Items */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ color: '#005e4d' }}>
              Contenido ({items.length} items)
            </Typography>
            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={handleAddItem}
              sx={{ textTransform: 'none', color: '#005e4d' }}
            >
              Agregar item
            </Button>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, maxHeight: 280, overflowY: 'auto', pr: 0.5 }}>
            {items.length === 0 && (
              <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 2 }}>
                Sin items. Agrega al menos uno.
              </Typography>
            )}
            {items.map((item, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  label="Nombre"
                  size="small"
                  value={item.name}
                  onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                  sx={{ ...fieldSx, flex: 2 }}
                />
                <TextField
                  label="Cantidad"
                  type="number"
                  size="small"
                  value={item.cantidad}
                  onChange={(e) => handleItemChange(index, 'cantidad', Number(e.target.value))}
                  slotProps={{ htmlInput: { min: 0, step: 0.25 } }}
                  sx={{ ...fieldSx, width: 95 }}
                />
                <FormControl size="small" sx={{ ...fieldSx, width: 90 }}>
                  <InputLabel>Tipo</InputLabel>
                  <Select
                    label="Tipo"
                    value={item.tipo}
                    onChange={(e) => handleItemChange(index, 'tipo', e.target.value)}
                  >
                    {TIPOS.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                  </Select>
                </FormControl>
                <IconButton size="small" onClick={() => handleRemoveItem(index)} sx={{ color: '#c62828' }}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>

      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2.5, gap: 1 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={onClose}
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
          {isEdit ? 'Guardar cambios' : 'Crear producto'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddEditProducto
