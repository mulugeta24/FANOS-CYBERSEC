import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
  Chip,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  Shield as ShieldIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material'
import FanosLogo from './FanosLogo'
import { useAuth } from '../context/AuthContext'

export default function FanosNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }

      // Determine active section on scroll
      const sections = ['pricing', 'contact', 'integrations', 'scanner-showcase', 'about', 'home']
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 160 && rect.bottom >= 80) {
            setActiveSection(sectionId)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Home', targetId: 'home' },
    { label: 'About', targetId: 'about' },
    { label: 'Vulnerability Scanner', targetId: 'scanner-showcase' },
    { label: 'Integrations', targetId: 'integrations' },
    { label: 'Contact', targetId: 'contact' },
    { label: 'Pricing', targetId: 'pricing' },
  ]

  const handleNavClick = (targetId) => {
    setMobileOpen(false)
    setActiveSection(targetId)
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        const element = document.getElementById(targetId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    } else {
      const element = document.getElementById(targetId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const handleSignOut = () => {
    logout()
    navigate('/')
  }

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: scrolled
          ? 'rgba(6, 11, 23, 0.92)'
          : 'rgba(6, 11, 23, 0.75)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid',
        borderColor: scrolled ? 'rgba(56, 189, 248, 0.18)' : 'rgba(255, 255, 255, 0.05)',
        transition: 'all 0.3s ease-in-out',
        top: 0,
        zIndex: 1100,
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1440px',
          width: '100%',
          margin: '0 auto',
          px: { xs: 2, sm: 3, md: 5 },
          minHeight: '76px !important',
        }}
      >
        {/* Brand Logo */}
        <Box onClick={() => handleNavClick('home')}>
          <FanosLogo size={36} showText={true} />
        </Box>

        {/* Center Navigation Links (Desktop) */}
        {!isMobile && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { md: 2.8, lg: 3.8 },
            }}
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.targetId

              return (
                <Button
                  key={link.label}
                  onClick={() => handleNavClick(link.targetId)}
                  sx={{
                    color: isActive ? '#38bdf8' : '#cbd5e1',
                    fontSize: '0.92rem',
                    fontWeight: isActive ? 600 : 500,
                    textTransform: 'none',
                    letterSpacing: '0.01em',
                    position: 'relative',
                    px: 1,
                    py: 0.5,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: '#ffffff',
                      backgroundColor: 'transparent',
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -8,
                      left: '15%',
                      width: '70%',
                      height: '2.5px',
                      borderRadius: '2px',
                      backgroundColor: isActive ? '#38bdf8' : 'transparent',
                      transition: 'all 0.25s ease',
                      boxShadow: isActive ? '0 0 10px rgba(56, 189, 248, 0.85)' : 'none',
                    },
                  }}
                >
                  {link.label}
                </Button>
              )
            })}
          </Box>
        )}

        {/* Right Action Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {user ? (
            /* Logged in state */
            <>
              <Chip
                icon={<ShieldIcon sx={{ fontSize: 16, color: '#38bdf8 !important' }} />}
                label={user.username || 'Analyst'}
                size="small"
                sx={{
                  backgroundColor: 'rgba(56, 189, 248, 0.12)',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  fontWeight: 600,
                  display: { xs: 'none', sm: 'inline-flex' },
                }}
              />
              <Button
                variant="contained"
                onClick={() => navigate('/dashboard')}
                startIcon={<DashboardIcon />}
                sx={{
                  background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  textTransform: 'none',
                  px: 2.2,
                  py: 0.8,
                  borderRadius: '24px',
                  boxShadow: '0 4px 14px rgba(14, 165, 233, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0369a1 0%, #0284c7 100%)',
                  },
                }}
              >
                SecOps Console
              </Button>
              <IconButton
                onClick={handleSignOut}
                title="Logout"
                sx={{
                  color: '#94a3b8',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  p: 1,
                  '&:hover': { color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)' },
                }}
              >
                <LogoutIcon fontSize="small" />
              </IconButton>
            </>
          ) : (
            /* Public Guest State (Matches Image EXACTLY) */
            <>
              {/* Sign In Button (Dark Pill) */}
              <Button
                variant="outlined"
                onClick={() => navigate('/login?mode=signin')}
                sx={{
                  color: '#f8fafc',
                  backgroundColor: 'rgba(15, 23, 42, 0.75)',
                  borderColor: 'rgba(148, 163, 184, 0.3)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  textTransform: 'none',
                  px: { xs: 2, sm: 2.8 },
                  py: 0.8,
                  borderRadius: '24px',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(30, 41, 59, 0.9)',
                    borderColor: 'rgba(56, 189, 248, 0.5)',
                    color: '#ffffff',
                  },
                }}
              >
                Sign In
              </Button>

              {/* Sign Up / Get Started Button (Electric Cyan Gradient Pill with Arrow) */}
              <Button
                variant="contained"
                onClick={() => navigate('/login?mode=signup')}
                endIcon={<ArrowForwardIcon sx={{ fontSize: '18px !important' }} />}
                sx={{
                  background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 60%, #38bdf8 100%)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  textTransform: 'none',
                  px: { xs: 2, sm: 3 },
                  py: 0.85,
                  borderRadius: '24px',
                  boxShadow: '0 4px 18px rgba(14, 165, 233, 0.45)',
                  transition: 'all 0.25s ease',
                  letterSpacing: '0.01em',
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0369a1 0%, #0284c7 60%, #0ea5e9 100%)',
                    boxShadow: '0 6px 25px rgba(14, 165, 233, 0.7)',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                Sign Up / Get Started
              </Button>
            </>
          )}

          {/* Mobile Hamburger Toggle */}
          {isMobile && (
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={() => setMobileOpen(!mobileOpen)}
              sx={{ color: '#cbd5e1', ml: 1 }}
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          )}
        </Box>
      </Toolbar>

      {/* Mobile Drawer Navigation */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            width: '280px',
            backgroundColor: '#0a0f1d',
            borderLeft: '1px solid rgba(56, 189, 248, 0.2)',
            p: 3,
          },
        }}
      >
        <Box sx={{ mb: 3 }}>
          <FanosLogo size={32} showText={true} />
        </Box>
        <List>
          {navLinks.map((link) => (
            <ListItem key={link.label} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => handleNavClick(link.targetId)}
                sx={{
                  borderRadius: '8px',
                  '&:hover': { backgroundColor: 'rgba(56, 189, 248, 0.1)' },
                }}
              >
                <ListItemText
                  primary={link.label}
                  primaryTypographyProps={{
                    color: activeSection === link.targetId ? '#38bdf8' : '#cbd5e1',
                    fontWeight: activeSection === link.targetId ? 700 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
          <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => {
                setMobileOpen(false)
                navigate('/login?mode=signin')
              }}
              sx={{
                color: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '20px',
              }}
            >
              Sign In
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                setMobileOpen(false)
                navigate('/login?mode=signup')
              }}
              endIcon={<ArrowForwardIcon />}
              sx={{
                background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)',
                color: '#ffffff',
                fontWeight: 700,
                borderRadius: '20px',
              }}
            >
              Sign Up / Get Started
            </Button>
          </Box>
        </List>
      </Drawer>
    </AppBar>
  )
}
