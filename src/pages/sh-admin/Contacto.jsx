import { useState, useEffect } from 'react'
import { fetchData } from '../../service/index.ts'
import {
  Box, Typography, TextField, Button, Paper,
  IconButton, Divider, CircularProgress,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import ContactPhoneIcon from '@mui/icons-material/ContactPhone'
import SaveIcon from '@mui/icons-material/Save'
import { toast } from 'sonner'

const fieldSx = {
  '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#005e4d' } },
  '& .MuiInputLabel-root.Mui-focused': { color: '#005e4d' },
}

const emptyContact = {
  direction: '',
  email: '',
  phone: [],
  timeWork: [],
}

function Contacto() {
  const [contact, setContact] = useState(emptyContact)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchContact = async () => {
      try {
        setLoading(true)
        const res = await fetchData('contacto', 'GET')
        if (res) setContact({ ...emptyContact, ...res })
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchContact()
  }, [])

  const handleSave = async () => {
    try {
      setSaving(true)
      const { _id, __v, ...payload } = contact
      const cleanPayload = {
        ...payload,
        phone: payload.phone.map(({ _id: pid, ...p }) => p),
        timeWork: payload.timeWork.map(({ _id: tid, ...tw }) => ({
          ...tw,
          schedule: tw.schedule.map(({ _id: sid, ...s }) => s),
        })),
      }
      const res = await fetchData('contacto', 'POST', undefined, cleanPayload)
      if (res.message) toast.success(res.message)
    } catch (error) {
      console.error(error)
      toast.error(error?.message ?? 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  // — Phone handlers —
  const addPhone = () =>
    setContact(prev => ({ ...prev, phone: [...prev.phone, { phone: '', name: '' }] }))

  const removePhone = (i) =>
    setContact(prev => ({ ...prev, phone: prev.phone.filter((_, idx) => idx !== i) }))

  const updatePhone = (i, field, value) =>
    setContact(prev => ({
      ...prev,
      phone: prev.phone.map((p, idx) =>
        idx === i ? { ...p, [field]: field === 'phone' ? Number(value) : value } : p
      ),
    }))

  // — TimeWork handlers —
  const addTimeWork = () =>
    setContact(prev => ({
      ...prev,
      timeWork: [...prev.timeWork, { days: '', schedule: [{ open: '', close: '' }] }],
    }))

  const removeTimeWork = (i) =>
    setContact(prev => ({ ...prev, timeWork: prev.timeWork.filter((_, idx) => idx !== i) }))

  const updateTimeWorkDays = (i, value) =>
    setContact(prev => ({
      ...prev,
      timeWork: prev.timeWork.map((tw, idx) => idx === i ? { ...tw, days: value } : tw),
    }))

  const addSchedule = (twIndex) =>
    setContact(prev => ({
      ...prev,
      timeWork: prev.timeWork.map((tw, idx) =>
        idx === twIndex ? { ...tw, schedule: [...tw.schedule, { open: '', close: '' }] } : tw
      ),
    }))

  const removeSchedule = (twIndex, sIndex) =>
    setContact(prev => ({
      ...prev,
      timeWork: prev.timeWork.map((tw, idx) =>
        idx === twIndex
          ? { ...tw, schedule: tw.schedule.filter((_, si) => si !== sIndex) }
          : tw
      ),
    }))

  const updateSchedule = (twIndex, sIndex, field, value) =>
    setContact(prev => ({
      ...prev,
      timeWork: prev.timeWork.map((tw, idx) =>
        idx === twIndex
          ? {
              ...tw,
              schedule: tw.schedule.map((s, si) =>
                si === sIndex ? { ...s, [field]: value } : s
              ),
            }
          : tw
      ),
    }))

  if (loading) return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', pt: 6, gap: 2 }}>
      <CircularProgress sx={{ color: '#005e4d' }} />
      <Typography variant="h5" sx={{ color: '#005e4d', fontWeight: 600 }}>Cargando...</Typography>
    </Box>
  )

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <ContactPhoneIcon sx={{ color: '#005e4d', fontSize: 36 }} />
          <Typography variant="h4" sx={{ color: '#005e4d', fontWeight: 600 }}>
            Contacto
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Modifica los contactos que se muestran al usuario
        </Typography>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          loading={saving}
          sx={{ textTransform: 'none', backgroundColor: '#005e4d', '&:hover': { backgroundColor: '#004a3d' } }}
        >
          Guardar cambios
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

        {/* Información general */}
        <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#005e4d', mb: 2 }}>
            Información general
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Dirección"
              size="small"
              value={contact.direction}
              onChange={(e) => setContact(prev => ({ ...prev, direction: e.target.value }))}
              sx={{ ...fieldSx, flex: 1, minWidth: 220 }}
            />
            <TextField
              label="Email"
              size="small"
              type="email"
              value={contact.email}
              onChange={(e) => setContact(prev => ({ ...prev, email: e.target.value }))}
              sx={{ ...fieldSx, flex: 1, minWidth: 220 }}
            />
          </Box>
        </Paper>

        {/* Teléfonos */}
        <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#005e4d' }}>
              Teléfonos
            </Typography>
            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={addPhone}
              sx={{ textTransform: 'none', color: '#005e4d' }}
            >
              Agregar
            </Button>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {contact.phone.length === 0 && (
              <Typography variant="body2" color="text.secondary">Sin teléfonos registrados.</Typography>
            )}
            {contact.phone.map((p, i) => (
              <Box key={i} sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                <TextField
                  label="Nombre"
                  size="small"
                  value={p.name}
                  onChange={(e) => updatePhone(i, 'name', e.target.value)}
                  sx={{ ...fieldSx, flex: 1 }}
                />
                <TextField
                  label="Teléfono"
                  size="small"
                  type="number"
                  value={p.phone}
                  onChange={(e) => updatePhone(i, 'phone', e.target.value)}
                  sx={{ ...fieldSx, flex: 1 }}
                />
                <IconButton size="small" onClick={() => removePhone(i)} sx={{ color: '#c62828' }}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Paper>

        {/* Horarios */}
        <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#005e4d' }}>
              Horarios de atención
            </Typography>
            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={addTimeWork}
              sx={{ textTransform: 'none', color: '#005e4d' }}
            >
              Agregar bloque
            </Button>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {contact.timeWork.length === 0 && (
              <Typography variant="body2" color="text.secondary">Sin horarios registrados.</Typography>
            )}
            {contact.timeWork.map((tw, twIndex) => (
              <Box key={twIndex} sx={{ border: '1px solid #e0e0e0', borderRadius: 1.5, p: 2 }}>
                {/* Días */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                  <TextField
                    label="Días"
                    size="small"
                    value={tw.days}
                    onChange={(e) => updateTimeWorkDays(twIndex, e.target.value)}
                    placeholder="Ej: Lunes a Domingo"
                    sx={{ ...fieldSx, flex: 1 }}
                  />
                  <IconButton size="small" onClick={() => removeTimeWork(twIndex)} sx={{ color: '#c62828' }}>
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Divider sx={{ mb: 1.5 }} />
                {/* Horarios del bloque */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {tw.schedule.map((s, sIndex) => (
                    <Box key={sIndex} sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                      <TextField
                        label="Apertura"
                        size="small"
                        type="time"
                        value={s.open}
                        onChange={(e) => updateSchedule(twIndex, sIndex, 'open', e.target.value)}
                        sx={{ ...fieldSx, flex: 1 }}
                        slotProps={{ inputLabel: { shrink: true } }}
                      />
                      <Typography variant="body2" color="text.secondary">—</Typography>
                      <TextField
                        label="Cierre"
                        size="small"
                        type="time"
                        value={s.close}
                        onChange={(e) => updateSchedule(twIndex, sIndex, 'close', e.target.value)}
                        sx={{ ...fieldSx, flex: 1 }}
                        slotProps={{ inputLabel: { shrink: true } }}
                      />
                      <IconButton size="small" onClick={() => removeSchedule(twIndex, sIndex)} sx={{ color: '#c62828' }}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => addSchedule(twIndex)}
                    sx={{ textTransform: 'none', color: '#005e4d', alignSelf: 'flex-start', mt: 0.5 }}
                  >
                    Agregar franja horaria
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        </Paper>

      </Box>
    </Box>
  )
}

export default Contacto
