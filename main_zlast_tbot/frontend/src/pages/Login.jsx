import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Tabs,
  Tab,
  Chip,
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  PersonAdd as PersonAddIcon,
  Login as LoginIcon,
  CheckCircleOutline as CheckIcon,
} from '@mui/icons-material'
import { useAuth } from '../context/AuthContext'
import FanosLogo from '../components/FanosLogo'

export default function Login() {
  const [searchParams] = useSearchParams()
  // Tab 0 = Step 1: Sign Up / Register
  // Tab 1 = Step 2: Sign In
  const initialTab = searchParams.get('mode') === 'signin' ? 1 : 0
  const [tab, setTab] = useState(initialTab)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const passwordInputRef = useRef(null)
  const { login, signup } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (searchParams.get('mode') === 'signin') {
      setTab(1)
    } else {
      setTab(0)
    }
  }, [searchParams])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')
    setLoading(true)

    // TAB 0: Step 1 - Sign Up / Register
    if (tab === 0) {
      if (!username.trim() || !email.trim() || !password) {
        setError('Please enter your work email, username, and password.')
        setLoading(false)
        return
      }

      if (username.trim().length < 3) {
        setError('Username must be at least 3 characters long.')
        setLoading(false)
        return
      }

      if (password.length < 4) {
        setError('Password must be at least 4 characters long.')
        setLoading(false)
        return
      }

      try {
        const result = await signup(username.trim(), email.trim(), password)
        if (result.success) {
          // Advance to Step 2: Sign In with prefilled username
          setSuccessMsg(
            `✅ Step 1 complete! Account "${username.trim()}" registered successfully. Please enter your password to Sign In (Step 2).`
          )
          setTab(1)
          setPassword('')
          setLoading(false)
          // Focus password input for smooth user experience
          setTimeout(() => {
            if (passwordInputRef.current) {
              passwordInputRef.current.focus()
            }
          }, 100)
        } else {
          setError(result.message || 'Registration failed')
          setLoading(false)
        }
      } catch (err) {
        setError('An error occurred during registration. Please try again.')
        setLoading(false)
      }
      return
    }

    // TAB 1: Step 2 - Sign In
    if (!username.trim() || !password) {
      setError('Please enter both your username and password.')
      setLoading(false)
      return
    }

    try {
      const result = await login(username.trim(), password)
      if (result.success) {
        navigate('/dashboard')
      } else {
        setError(result.message || 'Invalid username or password')
        setLoading(false)
      }
    } catch (err) {
      setError('An error occurred during authentication')
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#0a0f1d',
        backgroundImage:
          'radial-gradient(ellipse 60% 40% at 50% 20%, rgba(56, 189, 248, 0.12), transparent 70%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
        py: 4,
      }}
    >
      {/* Top Back to Home Button */}
      <Box sx={{ width: '100%', maxWidth: '440px', mb: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{
            color: '#94a3b8',
            textTransform: 'none',
            fontSize: '0.86rem',
            '&:hover': { color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.05)' },
          }}
        >
          Back to Fanos CyberSec Home
        </Button>
      </Box>

      <Paper
        elevation={0}
        sx={{
          maxWidth: '440px',
          width: '100%',
          p: { xs: 3, sm: 4 },
          backgroundColor: '#0d1527',
          borderRadius: '16px',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 25px rgba(56, 189, 248, 0.1)',
        }}
      >
        {/* Header Logo & Title */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2.5 }}>
          <FanosLogo size={46} showText={true} textSize="1.45rem" />
          <Typography
            sx={{
              mt: 1,
              fontSize: '0.82rem',
              color: '#94a3b8',
              letterSpacing: '0.04em',
              textAlign: 'center',
            }}
          >
            SecOps Terminal & Vulnerability Scanner Access
          </Typography>
        </Box>

        {/* Step Indicator Banner */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            mb: 2.5,
            py: 0.75,
            px: 2,
            borderRadius: '10px',
            backgroundColor: tab === 0 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(56, 189, 248, 0.1)',
            border: `1px solid ${tab === 0 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(56, 189, 248, 0.3)'}`,
          }}
        >
          <Chip
            size="small"
            label={tab === 0 ? 'STEP 1' : 'STEP 2'}
            sx={{
              height: '22px',
              fontSize: '0.72rem',
              fontWeight: 800,
              backgroundColor: tab === 0 ? '#f59e0b' : '#38bdf8',
              color: '#0f172a',
            }}
          />
          <Typography
            sx={{
              fontSize: '0.82rem',
              fontWeight: 600,
              color: tab === 0 ? '#fbbf24' : '#7dd3fc',
            }}
          >
            {tab === 0
              ? 'First Sign Up (Create Account)'
              : 'Next: Sign In with your Account'}
          </Typography>
        </Box>

        {/* Tabs: Step 1 (Sign Up) -> Step 2 (Sign In) */}
        <Tabs
          value={tab}
          onChange={(e, val) => {
            setTab(val)
            setError('')
            setSuccessMsg('')
          }}
          variant="fullWidth"
          sx={{
            mb: 2.5,
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            '& .MuiTab-root': {
              color: '#94a3b8',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              '&.Mui-selected': {
                color: tab === 0 ? '#f59e0b' : '#38bdf8',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: tab === 0 ? '#f59e0b' : '#38bdf8',
            },
          }}
        >
          <Tab
            icon={<PersonAddIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
            label="1. Sign Up"
          />
          <Tab
            icon={<LoginIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
            label="2. Sign In"
          />
        </Tabs>

        {/* Error Alert */}
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2.5,
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: '#fca5a5',
              fontSize: '0.85rem',
            }}
          >
            {error}
          </Alert>
        )}

        {/* Success Alert */}
        {successMsg && (
          <Alert
            icon={<CheckIcon fontSize="inherit" />}
            severity="success"
            sx={{
              mb: 2.5,
              backgroundColor: 'rgba(16, 185, 129, 0.18)',
              color: '#a7f3d0',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              fontSize: '0.85rem',
            }}
          >
            {successMsg}
          </Alert>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit}>
          {/* Step 1: Work Email (Sign Up only) */}
          {tab === 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ fontSize: '0.82rem', color: '#cbd5e1', mb: 0.5, fontWeight: 600 }}>
                Analyst Work Email
              </Typography>
              <TextField
                fullWidth
                type="email"
                placeholder="analyst@organization.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#080d19',
                    color: '#ffffff',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
                    '&:hover fieldset': { borderColor: '#f59e0b' },
                    '&.Mui-focused fieldset': { borderColor: '#f59e0b' },
                  },
                }}
              />
            </Box>
          )}

          {/* Username (Both Step 1 and Step 2) */}
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontSize: '0.82rem', color: '#cbd5e1', mb: 0.5, fontWeight: 600 }}>
              Username
            </Typography>
            <TextField
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={
                tab === 0
                  ? 'Choose a unique username (min 3 chars)'
                  : 'Enter your registered username'
              }
              required
              autoFocus={tab === 0}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#080d19',
                  color: '#ffffff',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
                  '&:hover fieldset': { borderColor: tab === 0 ? '#f59e0b' : '#38bdf8' },
                  '&.Mui-focused fieldset': { borderColor: tab === 0 ? '#f59e0b' : '#38bdf8' },
                },
              }}
            />
          </Box>

          {/* Password */}
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontSize: '0.82rem', color: '#cbd5e1', mb: 0.5, fontWeight: 600 }}>
              Password
            </Typography>
            <TextField
              fullWidth
              inputRef={passwordInputRef}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={
                tab === 0
                  ? 'Create a strong password (min 4 chars)'
                  : 'Enter your password'
              }
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#080d19',
                  color: '#ffffff',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
                  '&:hover fieldset': { borderColor: tab === 0 ? '#f59e0b' : '#38bdf8' },
                  '&.Mui-focused fieldset': { borderColor: tab === 0 ? '#f59e0b' : '#38bdf8' },
                },
              }}
            />
          </Box>

          {/* Submit Action Button */}
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              background:
                tab === 0
                  ? 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)'
                  : 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
              color: '#0f172a',
              fontWeight: 700,
              fontSize: '0.95rem',
              py: 1.25,
              borderRadius: '8px',
              textTransform: 'none',
              mb: 2,
              boxShadow:
                tab === 0
                  ? '0 4px 14px rgba(245, 158, 11, 0.35)'
                  : '0 4px 14px rgba(56, 189, 248, 0.35)',
              '&:hover': {
                background:
                  tab === 0
                    ? 'linear-gradient(135deg, #b45309 0%, #d97706 100%)'
                    : 'linear-gradient(135deg, #0369a1 0%, #0284c7 100%)',
              },
            }}
          >
            {loading
              ? 'Processing...'
              : tab === 0
              ? 'Step 1: Create Account & Proceed to Sign In'
              : 'Step 2: Sign In to Console'}
          </Button>
        </form>

        {/* Footer Navigation Switch */}
        <Box sx={{ mt: 2.5, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
          {tab === 0 ? (
            <Typography sx={{ fontSize: '0.86rem', color: '#94a3b8' }}>
              Already registered?{' '}
              <Button
                variant="text"
                onClick={() => {
                  setTab(1)
                  setError('')
                  setSuccessMsg('')
                }}
                sx={{
                  color: '#38bdf8',
                  textTransform: 'none',
                  fontWeight: 700,
                  p: 0,
                  minWidth: 'auto',
                  fontSize: '0.86rem',
                  '&:hover': { textDecoration: 'underline', backgroundColor: 'transparent' },
                }}
              >
                Skip to Step 2: Sign In
              </Button>
            </Typography>
          ) : (
            <Typography sx={{ fontSize: '0.86rem', color: '#94a3b8' }}>
              Need to create an account first?{' '}
              <Button
                variant="text"
                onClick={() => {
                  setTab(0)
                  setError('')
                  setSuccessMsg('')
                }}
                sx={{
                  color: '#f59e0b',
                  textTransform: 'none',
                  fontWeight: 700,
                  p: 0,
                  minWidth: 'auto',
                  fontSize: '0.86rem',
                  '&:hover': { textDecoration: 'underline', backgroundColor: 'transparent' },
                }}
              >
                Go to Step 1: Sign Up
              </Button>
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  )
}
