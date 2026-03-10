import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import Collapse from '@mui/material/Collapse'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Tooltip from '@mui/material/Tooltip'
import Avatar from '@mui/material/Avatar'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import HomeIcon from '@mui/icons-material/Home'
import InventoryIcon from '@mui/icons-material/Inventory'
import BarChartIcon from '@mui/icons-material/BarChart'
import PeopleIcon from '@mui/icons-material/People'
import PersonIcon from '@mui/icons-material/Person'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import ReplayIcon from '@mui/icons-material/Replay';
import { useNavigate, useLocation } from 'react-router-dom'
import Logo from '../../../assets/logo.png'

const drawerWidth = 240

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
})

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
})

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
}))

const StyledDrawer = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
)

const menuItems = [
  { label: 'Inicio', icon: <HomeIcon />, path: '/app/season-harvest' },
  { label: 'Inventario', icon: <InventoryIcon />, path: '/app/season-harvest/inventario' },
  {
    label: 'Clientes',
    icon: <PeopleIcon />,
    children: [
      { label: 'Clientes', icon: <PersonIcon />, path: '/app/season-harvest/clientes' },
      { label: 'Productos', icon: <ShoppingCartIcon />, path: '/app/season-harvest/cliente-productos' },
      { label: 'Productos Extras', icon: <AddShoppingCartIcon />, path: '/app/season-harvest/productos-extras' },
    ],
  },
  { label: 'Reportes', icon: <BarChartIcon />, path: '/app/season-harvest/reportes' },
  { label: 'SH Clientes', icon: <ReplayIcon />, path: '/app' },
]

function LeftMenu({ open, handleDrawerClose }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [openSubmenus, setOpenSubmenus] = useState({})
  const [popoverAnchor, setPopoverAnchor] = useState(null)
  const [activeItem, setActiveItem] = useState(null)

  // Exact match para rutas raíz que son prefijo de otras, startsWith para el resto
  const isActive = (path) => {
    if (path === '/app' || path === '/app/season-harvest') return location.pathname === path
    return location.pathname.startsWith(path)
  }
  const hasActiveChild = (children) => children?.some((c) => isActive(c.path))

  const toggleSubmenu = (label) => {
    setOpenSubmenus((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  const handleOpenPopover = (e, item) => {
    setPopoverAnchor(e.currentTarget)
    setActiveItem(item)
  }

  const handleClosePopover = () => {
    setPopoverAnchor(null)
    setActiveItem(null)
  }

  return (
    <StyledDrawer variant="permanent" open={open}>

      <DrawerHeader sx={{ justifyContent: 'center', py: open ? 1.5 : 1 }}>
        {open ? (
          <Tooltip title="Season Harvest">
            <Avatar
              src={Logo}
              alt="Season Harvest"
              sx={{ width: 80, height: 80, border: '2px solid #e0e0e0' }}
            />
          </Tooltip>
        ) : (
          <Tooltip title="Season Harvest">
            <Avatar src={Logo} alt="Season Harvest" sx={{ width: 38, height: 38 }} />
          </Tooltip>
        )}
      </DrawerHeader>

      <Divider />

      <List>
        {menuItems.map((item) => (
          <React.Fragment key={item.label}>

            {/* Item principal */}
            {(() => {
              const active = item.children ? hasActiveChild(item.children) : isActive(item.path)
              return (
                <ListItem disablePadding sx={{ display: 'block' }}>
                  <Tooltip title={!open ? item.label : ''} placement="right">
                    <ListItemButton
                      onClick={(e) => {
                        if (item.children) {
                          open ? toggleSubmenu(item.label) : handleOpenPopover(e, item)
                        } else {
                          navigate(item.path)
                        }
                      }}
                      sx={{
                        minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5,
                        ...(active && { backgroundColor: '#005e4d', '&:hover': { backgroundColor: '#004a3d' } }),
                      }}
                    >
                      <ListItemIcon
                        sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center', color: active ? 'white' : '#005e4d' }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText primary={item.label} sx={{ opacity: open ? 1 : 0, '& .MuiListItemText-primary': { color: active ? 'white' : 'inherit', fontWeight: active ? 600 : 400 } }} />
                      {item.children && open && (
                        openSubmenus[item.label]
                          ? <ExpandLessIcon sx={{ color: active ? 'white' : 'inherit' }} />
                          : <ExpandMoreIcon sx={{ color: active ? 'white' : 'inherit' }} />
                      )}
                    </ListItemButton>
                  </Tooltip>
                </ListItem>
              )
            })()}

            {/* Submenu collapse (drawer abierto) */}
            {item.children && (
              <Collapse in={open && !!openSubmenus[item.label]} timeout="auto" unmountOnExit>
                <List disablePadding>
                  {item.children.map((child) => {
                    const childActive = isActive(child.path)
                    return (
                      <ListItem key={child.label} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                          onClick={() => navigate(child.path)}
                          sx={{
                            minHeight: 40, pl: 4,
                            ...(childActive && { backgroundColor: '#005e4d', '&:hover': { backgroundColor: '#004a3d' } }),
                          }}
                        >
                          <ListItemIcon
                            sx={{ minWidth: 0, mr: 2, justifyContent: 'center', color: childActive ? 'white' : '#005e4d', opacity: childActive ? 1 : 0.8 }}
                          >
                            {child.icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={child.label}
                            sx={{ '& .MuiListItemText-primary': { fontSize: '0.875rem', color: childActive ? 'white' : 'inherit', fontWeight: childActive ? 600 : 400 } }}
                          />
                        </ListItemButton>
                      </ListItem>
                    )
                  })}
                </List>
              </Collapse>
            )}

          </React.Fragment>
        ))}
      </List>

      {/* Popover submenu (drawer cerrado / mini) */}
      <Popover
        open={Boolean(popoverAnchor)}
        anchorEl={popoverAnchor}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        disableRestoreFocus
      >
        <Typography sx={{ px: 2, pt: 1.5, pb: 0.5, fontWeight: 600, color: '#005e4d', fontSize: '0.85rem' }}>
          {activeItem?.label}
        </Typography>
        <Divider />
        <List dense disablePadding sx={{ minWidth: 160 }}>
          {activeItem?.children.map((child) => {
            const childActive = isActive(child.path)
            return (
              <ListItemButton
                key={child.label}
                onClick={() => { navigate(child.path); handleClosePopover() }}
                sx={{
                  px: 2, py: 1,
                  ...(childActive && { backgroundColor: '#005e4d', '&:hover': { backgroundColor: '#004a3d' } }),
                }}
              >
                <ListItemIcon sx={{ minWidth: 32, color: childActive ? 'white' : '#005e4d' }}>
                  {child.icon}
                </ListItemIcon>
                <ListItemText
                  primary={child.label}
                  sx={{ '& .MuiListItemText-primary': { fontSize: '0.875rem', color: childActive ? 'white' : 'inherit', fontWeight: childActive ? 600 : 400 } }}
                />
              </ListItemButton>
            )
          })}
        </List>
      </Popover>

    </StyledDrawer>
  )
}

export default LeftMenu
