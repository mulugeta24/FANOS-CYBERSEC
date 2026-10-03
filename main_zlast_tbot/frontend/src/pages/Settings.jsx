import React, { useState } from 'react'
import {
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material'
import {
  Save as SaveIcon,
  Refresh as RefreshIcon,
  DeleteForever as DeleteIcon,
} from '@mui/icons-material'
import axios from 'axios'

export default function Settings() {
  const [settings, setSettings] = useState({
    mlThreshold: 0.85,
    vtApiKey: '',
    telegramToken: '',
    autoRefresh: true,
    emailNotifications: false,
    cacheExpiry: 3600,
  })
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [hasChanges, setHasChanges] = useState(false)
  const [clearDialog, setClearDialog] = useState(false)
  const [clearing, setClearing] = useState(false)

  // Load settings from localStorage on mount
  React.useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings')
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (e) {
        console.error('Failed to load settings:', e)
      }
    }
  }, [])

  const handleChange = (field) => (event) => {
    setSettings({
      ...settings,
      [field]: event.target.type === 'checkbox' ? event.target.checked : event.target.value,
    })
    setHasChanges(true)
  }

  const handleSave = () => {
    try {
      localStorage.setItem('appSettings', JSON.stringify(settings))
      setHasChanges(false)
      setSnackbar({
        open: true,
        message: 'Settings saved successfully!',
        severity: 'success',
      })
    } catch (e) {
      setSnackbar({
        open: true,
        message: 'Failed to save settings',
        severity: 'error',
      })
    }
  }

  const handleReset = () => {
    const defaultSettings = {
      mlThreshold: 0.85,
      vtApiKey: '',
      telegramToken: '',
      autoRefresh: true,
      emailNotifications: false,
      cacheExpiry: 3600,
    }
    setSettings(defaultSettings)
    localStorage.setItem('appSettings', JSON.stringify(defaultSettings))
    setHasChanges(false)
    setSnackbar({
      open: true,
      message: 'Settings reset to defaults',
      severity: 'info',
    })
  }

  const handleClearAllData = async () => {
    setClearing(true)
    try {
      const token = localStorage.getItem('token')
      await axios.post('http://localhost:5000/api/admin/clear-all', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      setClearDialog(false)
      setSnackbar({
        open: true,
        message: 'All data cleared successfully! Statistics reset.',
        severity: 'success',
      })
    } catch (error) {
      console.error('Clear data error:', error)
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to clear data',
        severity: 'error',
      })
    } finally {
      setClearing(false)
    }
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Configure system settings and preferences
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Detection Settings
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <TextField
              fullWidth
              label="ML Confidence Threshold"
              type="number"
              value={settings.mlThreshold}
              onChange={handleChange('mlThreshold')}
              inputProps={{ min: 0, max: 1, step: 0.05 }}
              helperText="Minimum confidence score for ML predictions (0.0 - 1.0)"
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Cache Expiry (seconds)"
              type="number"
              value={settings.cacheExpiry}
              onChange={handleChange('cacheExpiry')}
              helperText="How long to cache VirusTotal results"
              sx={{ mb: 2 }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.autoRefresh}
                  onChange={handleChange('autoRefresh')}
                />
              }
              label="Auto-refresh dashboard"
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              API Configuration
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <TextField
              fullWidth
              label="VirusTotal API Key"
              type="password"
              value={settings.vtApiKey}
              onChange={handleChange('vtApiKey')}
              helperText="Your VirusTotal API key"
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Telegram Bot Token"
              type="password"
              value={settings.telegramToken}
              onChange={handleChange('telegramToken')}
              helperText="Your Telegram bot token"
              sx={{ mb: 2 }}
            />

            <Alert severity="info" sx={{ mt: 2 }}>
              API keys are stored securely and never exposed in logs
            </Alert>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Notifications
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.emailNotifications}
                  onChange={handleChange('emailNotifications')}
                />
              }
              label="Email notifications for critical detections"
            />

            <Typography variant="body2" color="textSecondary" sx={{ mt: 1, ml: 4 }}>
              Receive email alerts when malicious URLs are detected
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="error">
              Danger Zone
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Alert severity="warning" sx={{ mb: 2 }}>
              Warning: This action cannot be undone. All scan history, reports, and statistics will be permanently deleted.
            </Alert>

            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setClearDialog(true)}
            >
              Clear All Data
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleReset}
            >
              Reset to Defaults
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={!hasChanges}
            >
              Save Settings
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Dialog
        open={clearDialog}
        onClose={() => !clearing && setClearDialog(false)}
      >
        <DialogTitle>Clear All Data?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to clear all data? This will permanently delete:
            <ul>
              <li>All URL scans (automatic detections)</li>
              <li>All user reports (feedback)</li>
              <li>All statistics</li>
              <li>VirusTotal cache</li>
              <li>All legacy reports</li>
            </ul>
            This action cannot be undone!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearDialog(false)} disabled={clearing}>
            Cancel
          </Button>
          <Button 
            onClick={handleClearAllData} 
            color="error" 
            variant="contained"
            disabled={clearing}
          >
            {clearing ? 'Clearing...' : 'Yes, Clear All Data'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
