import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  Chip,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Assessment as ReportsIcon,
  BarChart as StatsIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Home as HomeIcon,
  Shield as ShieldIcon,
  Security as SecurityIcon,
} from '@mui/icons-material'
import { useAuth } from '../context/AuthContext'
import FanosLogo from './FanosLogo'

const drawerWidth = 260

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Live URL Scanner', icon: <SearchIcon />, path: '/analysis', badge: 'Live' },
  { text: 'Web Security Scanner', icon: <SecurityIcon />, path: '/web-scanner', badge: 'Enterprise' },
  { text: 'Reports', icon: <ReportsIcon />, path: '/reports' },
  { text: 'Statistics', icon: <StatsIcon />, path: '/statistics' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
]

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { logout, user } = useAuth()

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const drawer = (
    <Box sx={{ height: '100%', backgroundColor: '#0a0f1d', color: '#ffffff' }}>
      <Toolbar sx={{ px: 2.5, minHeight: '74px !important' }}>
        <Box onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
          <FanosLogo size={32} showText={true} textSize="1.15rem" />
        </Box>
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(56, 189, 248, 0.15)' }} />
      <List sx={{ px: 1.5, py: 2 }}>
        {/* Back to Public Home link */}
        <ListItem disablePadding sx={{ mb: 1.5 }}>
          <ListItemButton
            onClick={() => navigate('/')}
            sx={{
              borderRadius: '8px',
              border: '1px dashed rgba(56, 189, 248, 0.3)',
              backgroundColor: 'rgba(56, 189, 248, 0.05)',
              color: '#38bdf8',
              '&:hover': { backgroundColor: 'rgba(56, 189, 248, 0.15)' },
            }}
          >
            <ListItemIcon sx={{ color: '#38bdf8', minWidth: 38 }}>
              <HomeIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Public Home Page"
              primaryTypographyProps={{ fontSize: '0.88rem', fontWeight: 600 }}
            />
          </ListItemButton>
        </ListItem>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.06)', my: 1.5 }} />

        {menuItems.map((item) => {
          const selected = location.pathname === item.path || (item.path === '/web-scanner' && location.pathname.startsWith('/web-scanner'))
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.8 }}>
              <ListItemButton
                selected={selected}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: '8px',
                  backgroundColor: selected ? 'rgba(56, 189, 248, 0.12) !important' : 'transparent',
                  color: selected ? '#38bdf8' : '#94a3b8',
                  borderLeft: selected ? '3px solid #38bdf8' : '3px solid transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: '#ffffff',
                  },
                }}
              >
                <ListItemIcon sx={{ color: selected ? '#38bdf8' : '#64748b', minWidth: 38 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{ fontSize: '0.88rem', fontWeight: selected ? 700 : 500 }}
                />
                {item.badge && (
                  <Chip
                    label={item.badge}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      backgroundColor: 'rgba(245, 158, 11, 0.2)',
                      color: '#f59e0b',
                      border: '1px solid rgba(245, 158, 11, 0.4)',
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', backgroundColor: '#0a0f1d', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: 'rgba(10, 15, 29, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(56, 189, 248, 0.15)',
          boxShadow: 'none',
        }}
      >
        <Toolbar sx={{ minHeight: '74px !important', px: 3 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700, color: '#ffffff' }}>
              Fanos SecOps Console
            </Typography>
            <Chip
              label="Enterprise Vault Online"
              size="small"
              sx={{
                height: 20,
                fontSize: '0.7rem',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                display: { xs: 'none', md: 'inline-flex' },
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Chip
              icon={<ShieldIcon sx={{ fontSize: 14, color: '#38bdf8 !important' }} />}
              label={user?.username || 'admin'}
              size="small"
              sx={{
                backgroundColor: 'rgba(56, 189, 248, 0.12)',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                fontWeight: 600,
              }}
            />
            <Button
              color="inherit"
              size="small"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                color: '#94a3b8',
                textTransform: 'none',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                px: 1.5,
                '&:hover': { color: '#ef4444', borderColor: '#ef4444' },
              }}
            >
              Sign Out
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: '#0a0f1d',
              borderRight: '1px solid rgba(56, 189, 248, 0.2)',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: '#0a0f1d',
              borderRight: '1px solid rgba(56, 189, 248, 0.2)',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 9,
          color: '#f8fafc',
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
