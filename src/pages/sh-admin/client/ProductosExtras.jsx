import { useState, useEffect, useCallback, useMemo } from 'react'
import { fetchData } from '../../../service/index.ts'
import {
  Box, Typography, CircularProgress, Chip, IconButton,
  Tooltip, Button,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { esES } from '@mui/x-data-grid/locales'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied'
import AddEditExtraItem from '../../../components/client/productosExtras/AddEditExtraItem'
import DeleteExtraItemDialog from '../../../components/client/productosExtras/DeleteExtraItemDialog'
import { toast } from 'sonner'

const formatPrice = (price) =>
  price.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })

const getColumns = (onEdit, onDelete) => [
  {
    field: 'name',
    headerName: 'Nombre',
    flex: 1,
    minWidth: 160,
    renderCell: ({ value }) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: '100%' }}>
        <AddShoppingCartIcon sx={{ color: '#005e4d', fontSize: 18 }} />
        <Typography variant="body2" fontWeight={500}>{value}</Typography>
      </Box>
    ),
  },
  {
    field: 'quantity',
    headerName: 'Cantidad',
    width: 110,
    type: 'number',
    headerAlign: 'center',
    align: 'center',
    renderCell: ({ value }) => (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Typography variant="body2">{value}</Typography>
      </Box>
    ),
  },
  {
    field: 'type',
    headerName: 'Tipo',
    width: 100,
    align: 'center',
    headerAlign: 'center',
    renderCell: ({ value }) => (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Chip
          label={value}
          size="small"
          sx={{ backgroundColor: '#e8f5e9', color: '#005e4d', fontWeight: 600 }}
        />
      </Box>
    ),
  },
  {
    field: 'price',
    headerName: 'Precio',
    width: 150,
    type: 'number',
    headerAlign: 'left',
    align: 'left',
    renderCell: ({ value }) => (
      <Typography variant="body2" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', height: '100%', color: '#005e4d' }}>
        {formatPrice(value)}
      </Typography>
    ),
  },
  {
    field: 'acciones',
    headerName: 'Acciones',
    width: 100,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    align: 'center',
    headerAlign: 'center',
    renderCell: ({ row }) => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Tooltip title={`Editar '${row.name}'`}>
          <IconButton size="small" sx={{ color: '#005e4d' }} onClick={() => onEdit(row)}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title={`Eliminar '${row.name}'`}>
          <IconButton size="small" sx={{ color: '#db471a' }} onClick={() => onDelete(row)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  },
]

function ProductosExtras() {
  const [catalogo, setCatalogo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [refreshFlag, setRefreshFlag] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, item: null })

  const url = 'productos-extras'

  useEffect(() => {
    const fetchCatalogo = async () => {
      try {
        setLoading(true)
        const res = await fetchData(url, 'GET')
        setCatalogo(res)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchCatalogo()
  }, [refreshFlag])

  const postCatalogo = async (updatedExtras) => {
    const payload = {
      name: catalogo.name,
      description: catalogo.description,
      productosExtras: updatedExtras,
    }
    const res = await fetchData(url, 'POST', undefined, payload)
    if (res.message) toast.success(res.message)
    setRefreshFlag(prev => !prev)
  }

  const handleOpenCreate = () => {
    setSelectedItem(null)
    setDialogOpen(true)
  }

  const handleOpenEdit = useCallback((row) => {
    setSelectedItem(row)
    setDialogOpen(true)
  }, [])

  const handleClose = () => {
    setDialogOpen(false)
    setSelectedItem(null)
  }

  const handleSaveItem = async (formData) => {
    try {
      setSaving(true)
      let updatedExtras

      if (selectedItem) {
        updatedExtras = catalogo.productosExtras.map((item) =>
          item._id === selectedItem._id ? { ...item, ...formData } : item
        )
      } else {
        updatedExtras = [...catalogo.productosExtras, formData]
      }

      await postCatalogo(updatedExtras)
      handleClose()
    } catch (error) {
      console.error(error)
      toast.error(error?.message ?? 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleOpenDelete = useCallback((row) => {
    setDeleteDialog({ open: true, item: row })
  }, [])

  const handleCloseDelete = () => {
    setDeleteDialog({ open: false, item: null })
  }

  const handleConfirmDelete = async () => {
    try {
      setDeleting(true)
      const updatedExtras = catalogo.productosExtras.filter(
        (item) => item._id !== deleteDialog.item._id
      )
      await postCatalogo(updatedExtras)
      handleCloseDelete()
    } catch (error) {
      console.error(error)
      toast.error(error?.message ?? 'Error al eliminar')
    } finally {
      setDeleting(false)
    }
  }

  const columns = useMemo(
    () => getColumns(handleOpenEdit, handleOpenDelete),
    [handleOpenEdit, handleOpenDelete]
  )

  const rows = catalogo?.productosExtras ?? []

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box>
            <Typography variant="h4" sx={{ color: '#005e4d', fontWeight: 600 }}>
              {catalogo?.name ?? 'Productos Extras'}
            </Typography>
            {catalogo?.description && (
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                {catalogo.description}
              </Typography>
            )}
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
            disabled={!catalogo}
            sx={{ textTransform: 'none', backgroundColor: '#005e4d', '&:hover': { backgroundColor: '#004a3d' } }}
          >
            Agregar ítem
          </Button>
        </Box>
      </Box>

      <AddEditExtraItem
        open={dialogOpen}
        onClose={handleClose}
        onSave={handleSaveItem}
        saving={saving}
        item={selectedItem}
      />

      <DeleteExtraItemDialog
        open={deleteDialog.open}
        item={deleteDialog.item}
        onClose={handleCloseDelete}
        onConfirmDelete={handleConfirmDelete}
        deleting={deleting}
      />

      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', pt: 6, gap: '10px' }}>
          <CircularProgress sx={{ color: '#005e4d' }} />
          <Typography variant="h5" sx={{ color: '#005e4d', fontWeight: 600 }}>
            Cargando...
          </Typography>
        </Box>
      ) : rows.length === 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', pt: 6, gap: '10px' }}>
          <Typography variant="h5" sx={{ color: '#005e4d', fontWeight: 600 }}>
            No hay productos extras para mostrar
          </Typography>
          <SentimentVeryDissatisfiedIcon sx={{ color: '#005e4d', fontSize: '100px' }} />
        </Box>
      ) : (
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row._id}
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          disableRowSelectionOnClick
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[10, 25, 50]}
          sx={{
            borderRadius: 2,
            boxShadow: 2,
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: '#005e4d',
              color: 'white',
              fontWeight: 600,
            },
            '& .MuiDataGrid-sortIcon': { color: '#005e4d' },
            '& .MuiDataGrid-menuIconButton': { color: 'white' },
            '& .MuiDataGrid-columnSeparator': { color: 'rgba(255,255,255,0.3)' },
            '& .MuiDataGrid-columnHeader .MuiBadge-badge': {
              backgroundColor: 'rgba(255,255,255,0.25)',
              color: 'white',
            },
          }}
        />
      )}
    </Box>
  )
}

export default ProductosExtras
