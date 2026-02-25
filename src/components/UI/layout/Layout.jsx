import * as React from 'react'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Header from '../../Header'
import LeftMenu from '../left-menu/LeftMenu'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  const [open, setOpen] = React.useState(true)

  const handleDrawerToggle = () => setOpen((prev) => !prev)
  const handleDrawerClose = () => setOpen(false)

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <CssBaseline />
      <LeftMenu open={open} handleDrawerClose={handleDrawerClose} />
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
        <Header onMenuToggle={handleDrawerToggle} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            overflow: 'auto',
            backgroundColor: '#f5f0e6',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
