import { useState, useEffect, useCallback, useMemo } from 'react'
import { fetchData } from '../../../service/index.ts';
import { Box, Typography, CircularProgress, Chip, IconButton, Tooltip, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { esES } from '@mui/x-data-grid/locales'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import TextField from '@mui/material/TextField'
import AddEditProducto from '../../../components/client/productos/AddEditProducto'
import DeleteProductoDialog from '../../../components/client/productos/DeleteProductoDialog'
import { toast } from 'sonner'
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';

const formatPrice = (price) =>
  price.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });

const formatCantidad = (cantidad) => {
    if (cantidad === 0.25) return "1/4";
    if (cantidad === 0.5) return "1/2";
    if (cantidad === 0.75) return "3/4";
    return cantidad; // Si es un entero como 1, 2 o 3, lo deja igual
  };

const getColumns = (onEdit, onDelete, onDisable) => [
  {
    field: 'name',
    headerName: 'Nombre',
    flex: 1,
    minWidth: 160,
    renderCell: ({ value }) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: '100%' }}>
        <Inventory2OutlinedIcon sx={{ color: '#005e4d', fontSize: 18 }} />
        <Typography variant="body2" fontWeight={500}>{value}</Typography>
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
    valueFormatter: (value) => formatPrice(value),
    renderCell: ({ value }) => (
      <Typography variant="body2" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', height: '100%', color: '#005e4d' }}>
        {formatPrice(value)}
      </Typography>
    ),
  },
  {
    field: 'productos',
    headerName: 'Contenido',
    width: 130,
    align: 'center',
    headerAlign: 'center',
    valueGetter: (value) => value?.length ?? 0,
    renderCell: ({ value, row }) => (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Tooltip
          arrow
          title={
            <Box sx={{ p: 0.5 }}>
              {row.productos.map((item) => (
                <Typography key={item._id} variant="body2">
                  • {item.name} — {formatCantidad(item.cantidad)} {item.tipo}
                </Typography>
              ))}
            </Box>
          }
        >
          <Chip
            label={`${value} items`}
            size="small"
            sx={{ cursor: 'pointer', backgroundColor: '#e8f5e9', color: '#005e4d', fontWeight: 600 }}
          />
        </Tooltip>
      </Box>
    ),
  },
  {
    field: 'state',
    headerName: 'Estado',
    width: 120,
    type: 'boolean',
    align: 'center',
    headerAlign: 'center',
    renderCell: ({ value }) => (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Chip
          label={value ? 'Activo' : 'Inactivo'}
          size="small"
          sx={{
            backgroundColor: value ? '#e8f5e9' : '#fce4ec',
            color: value ? '#005e4d' : '#c62828',
            fontWeight: 600,
          }}
        />
      </Box>
    ),
  },
  {
    field: 'acciones',
    headerName: 'Acciones',
    width: 110,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    align: 'center',
    headerAlign: 'center',
    renderCell: ({ row }) => (
      <Box>
        <Tooltip title={ row.state ? `Desactivar '${row.name}'` : `Activar '${row.name}'` } >
          <IconButton size="small" sx={{ color: '#005e4d' }} onClick={() => onDisable(row)}>
            { !row.state ? <RemoveShoppingCartIcon fontSize="small" /> : <ShoppingCartIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
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

function Productos() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(false)
  const [productoEditado, setProductoEditado] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedProducto, setSelectedProducto] = useState(null)
  const [filtroActivo, setFiltroActivo] = useState(null)
  const [searchName, setSearchName] = useState('')
  const [search, setSearch] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, producto: null })
  const [disableDialog, setDisableDialog] = useState({ open: false, productos: [] })
  const [selectedRows, setSelectedRows] = useState([])

  let url = 'productos-clientes';

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true)
        // validando filtro activo
        if (filtroActivo !== null) filtroActivo ? url += '?state=true' : url += '?state=false';
        // validando filtro nombre
        if (searchName.trim().length > 0) filtroActivo === null ? url += `?name=${searchName}` : url += `&name=${searchName}`
        
        const res = await fetchData(url, 'GET')
        setProductos(res)
      } catch (error) {
        console.error(error);
        toast.error(error);
      } finally {
        setLoading(false)
      }
    }
    fetchProductos()
  }, [productoEditado, search])

  const handleOpenCreate = () => {
    setSelectedProducto(null)
    setDialogOpen(true)
  }

  const handleOpenEdit = useCallback((row) => {
    setSelectedProducto(row)
    setDialogOpen(true)
  }, [])

  const handleClose = () => {
    setDialogOpen(false)
    setSelectedProducto(null)
  }

  // Llamar después de crear/editar para forzar el re-fetch de la tabla
  const handleSuccess = () => {
    handleClose()
    setProductoEditado(prev => !prev)
  }

  const handleOpenDelete = useCallback((row) => {
    setDeleteDialog({ open: true, producto: row })
  }, [])

  const handleCloseDelete = () => {
    setDeleteDialog({ open: false, producto: null })
  }

  const handleDeleteSuccess = () => {
    handleCloseDelete()
    setProductoEditado(prev => !prev)
  }

  // const handleOpenDisable = useCallback((row) => {
  //   toast.warning(`¿${row.state ? 'Desactivar' : 'Activar'}"${row.name}"?`, {
  //     description: 'Esta acción cambiará el estado del producto.',
  //     action: {
  //       label: 'Desactivar',
  //       onClick: () => changeStateProduct(row._id)
  //     },
  //     cancel: {
  //       label: 'Cancelar',
  //     },
  //     duration: 5000,
  //   })
  // }, [])

  async function changeStateProduct(row) {
    try {
      console.log('Enviando actualización:', {_id: row._id, state: !row.state});  
      const res = await fetchData(url, 'PATCH', row._id, {state: !row.state});

      if (res.message) toast.success(res.message)

      setProductoEditado(prev => !prev)
    } catch (error) {
      console.error(error);
      toast.error(error.message)
    }
  }

  async function updateStateBulkProduct() {
    try {
      setLoading(true);

      const res = await fetchData('productos-clientes/bulkUpdate', 'PATCH', undefined, selectedRows);

      if (res.message) toast.success(res.message)

      setProductoEditado(prev => !prev)

    } catch (error) {
      console.error('error:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  const clearFilters = () => {
    setFiltroActivo(null);
    setSearchName("");
    setSearch(!search);
  }

  const columns = useMemo(
    () => getColumns(handleOpenEdit, handleOpenDelete, changeStateProduct), 
    [handleOpenEdit, handleOpenDelete, changeStateProduct]
  )

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ color: '#005e4d', fontWeight: 600 }}>
            Productos
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
            sx={{ textTransform: 'none', backgroundColor: '#005e4d', '&:hover': { backgroundColor: '#004a3d' } }}
          >
            Crear producto
          </Button>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Activo</InputLabel>
            <Select
              value={filtroActivo}
              label="Activo"
              onChange={(e) => setFiltroActivo(e.target.value)}
              sx={{ backgroundColor: 'white' }}
            >
              <MenuItem value={null}>Todos</MenuItem>
              <MenuItem value={true}>Si</MenuItem>
              <MenuItem value={false}>No</MenuItem>
            </Select>
          </FormControl>

          <TextField
            size="small"
            label="Buscar por nombre"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && setSearch(prev => !prev)}
            sx={{ backgroundColor: 'white', minWidth: 200 }}
          />
          <Button
            variant="outlined"
            startIcon={<SearchIcon />}
            sx={{ textTransform: 'none', borderColor: '#005e4d', color: '#005e4d', backgroundColor: 'white', '&:hover': { backgroundColor: '#e8f5e9', borderColor: '#005e4d' } }}
            onClick={() => setSearch(!search)}
            loading={loading}
            >
            Buscar
          </Button>

          <Button
            variant="outlined"
            startIcon={<CleaningServicesIcon />}
            sx={{ textTransform: 'none', borderColor: '#005e4d', color: '#005e4d', backgroundColor: 'white', '&:hover': { backgroundColor: '#e8f5e9', borderColor: '#005e4d' } }}
            onClick={clearFilters}
            loading={loading}
          >
            Limpiar
          </Button>

          {selectedRows.length > 0 && (
            <Button
              variant="contained"
              sx={{ textTransform: 'none', backgroundColor: '#005e4d', '&:hover': { backgroundColor: '#004a3d' } }}
              onClick={() => updateStateBulkProduct()}
            >
              Cambiar estados ({selectedRows.length})
            </Button>
          )}
        </Box>
      </Box>

      <AddEditProducto
        open={dialogOpen}
        onClose={handleClose}
        onSuccess={handleSuccess}
        producto={selectedProducto}
      />

      <DeleteProductoDialog
        open={deleteDialog.open}
        producto={deleteDialog.producto}
        onClose={handleCloseDelete}
        onSuccess={handleDeleteSuccess}
      />

      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', pt: 6, gap: '10px' }}>
          <CircularProgress sx={{ color: '#005e4d' }} />
          <Typography variant="h5" sx={{ color: '#005e4d', fontWeight: 600, mb: 3 }}>
            Cargando...
          </Typography>
        </Box>
      ) : productos.length === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', pt: 6, gap: '10px' }}>
            <Typography variant="h5" sx={{ color: '#005e4d', fontWeight: 600, mb: 3 }}>
               ¡No hay productos para mostrar!
            </Typography>
            <SentimentVeryDissatisfiedIcon sx={{ color: '#005e4d', fontSize: '100px' }} />
          </Box>) 
      : (
        <DataGrid
          rows={productos}
          columns={columns}
          getRowId={(row) => row._id}
          checkboxSelection
          onRowSelectionModelChange={(model) => {
            const ids = model.type === 'exclude'
              ? productos.filter((p) => !model.ids.has(p._id)).map((p) => p._id)
              : Array.from(model.ids)
            setSelectedRows(ids.map((id) => ({ _id: id, state: productos.find((p) => p._id === id)?.state })))
          }}
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          disableRowSelectionOnClick
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } },
          }}
          pageSizeOptions={[5, 10, 25]}
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

export default Productos
