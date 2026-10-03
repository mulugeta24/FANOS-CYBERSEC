import React, { useState } from 'react'
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Snackbar,
} from '@mui/material'
import {
  Search as SearchIcon,
  Security as SecurityIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material'
import { scanURL } from '../services/api'

export default function URLAnalysis() {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [countdown, setCountdown] = useState(0)

  const handleAnalyze = async () => {
    if (!url.trim()) {
      setError('Please enter a URL')
      return
    }

    // More flexible URL validation - accept localhost, IPs, and regular domains
    // Just check if it has some basic structure
    if (url.length < 3) {
      setError('Please enter a valid URL')
      return
    }

    console.log('[URLAnalysis] Starting analysis for:', url)
    setLoading(true)
    setError('')
    setResult(null)
    setCountdown(60)

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Set a client-side timeout (65 seconds - slightly longer than API timeout)
    const timeoutId = setTimeout(() => {
      console.error('[URLAnalysis] Client timeout reached after 65 seconds')
      clearInterval(countdownInterval)
      setLoading(false)
      setCountdown(0)
      setError('Analysis timeout - The request took too long. Please try again.')
    }, 65000) // 65 seconds

    try {
      console.log('[URLAnalysis] Calling scanURL API...')
      const startTime = Date.now()
      const data = await scanURL(url)
      const endTime = Date.now()
      clearTimeout(timeoutId)
      clearInterval(countdownInterval)
      setCountdown(0)
      console.log(`[URLAnalysis] Analysis complete in ${(endTime - startTime) / 1000}s:`, data)
      setResult(data)
      setSnackbar({
        open: true,
        message: 'URL analyzed successfully!',
        severity: 'success',
      })
    } catch (err) {
      clearTimeout(timeoutId)
      clearInterval(countdownInterval)
      setCountdown(0)
      console.error('[URLAnalysis] Analysis error:', err)
      console.error('[URLAnalysis] Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        code: err.code
      })
      
      let errorMessage = 'Failed to analyze URL. Please try again.'
      
      if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        errorMessage = 'Analysis timeout - The URL took too long to analyze. Please try a different URL.'
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
    } finally {
      console.log('[URLAnalysis] Setting loading to false')
      setLoading(false)
    }
  }

  const getVerdictIcon = (verdict) => {
    if (verdict === 'benign') return <CheckIcon sx={{ color: 'success.main', fontSize: 60 }} />
    if (verdict === 'malicious') return <WarningIcon sx={{ color: 'error.main', fontSize: 60 }} />
    return <SecurityIcon sx={{ color: 'warning.main', fontSize: 60 }} />
  }

  const getVerdictColor = (verdict) => {
    if (verdict === 'benign') return 'success'
    if (verdict === 'malicious') return 'error'
    return 'warning'
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        URL Analysis Tool
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Analyze any URL for potential threats using ML and VirusTotal
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            label="Enter URL to analyze"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
            disabled={loading}
          />
          <Button
            variant="contained"
            size="large"
            onClick={handleAnalyze}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
            sx={{ minWidth: 150 }}
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </Button>
        </Box>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {loading && (
          <Box sx={{ mt: 2 }}>
            <Alert severity="info">
              Analyzing URL... This may take up to 60 seconds.
              <br />
              {countdown > 0 && `Time remaining: ${countdown} seconds`}
              <br />
              Please wait, do not refresh the page.
            </Alert>
          </Box>
        )}
      </Paper>

      {result && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                {getVerdictIcon(result.final_verdict)}
                <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
                  {result.final_verdict === 'benign' && result.ml_confidence < 0.85
                    ? 'BENIGN (Low Confidence)'
                    : result.final_verdict.toUpperCase()}
                </Typography>
                <Chip
                  label={result.final_verdict === 'benign' && result.ml_confidence < 0.85
                    ? 'benign (low confidence)'
                    : result.final_verdict}
                  color={getVerdictColor(result.final_verdict)}
                  sx={{ mt: 1 }}
                />
                {result.final_verdict === 'benign' && result.ml_confidence < 0.85 && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                    ML confidence is low ({(result.ml_confidence * 100).toFixed(1)}% &lt; 85%)
                    {result.vt_result === 'safe' && ', but VirusTotal confirms it\'s safe'}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Analysis Details
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    URL
                  </Typography>
                  <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                    {result.url}
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">
                        ML Prediction
                      </Typography>
                      <Chip
                        label={result.ml_prediction || result.ml_label}
                        color={getVerdictColor(result.ml_prediction || result.ml_label)}
                        size="small"
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">
                        VirusTotal Result
                      </Typography>
                      <Chip
                        label={result.vt_result}
                        variant="outlined"
                        size="small"
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">
                        Confidence Score
                      </Typography>
                      <Typography variant="body1">
                        {(result.ml_confidence * 100).toFixed(1)}%
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">
                        Scan Time
                      </Typography>
                      <Typography variant="body1">
                        {result.timestamp ? new Date(result.timestamp).toLocaleString() : new Date().toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>

                  {result.vt_result && result.vt_result !== 'unavailable' && result.vt_result !== 'error' && (
                    <Grid item xs={12}>
                      <Alert severity="info" sx={{ mt: 1 }}>
                        VirusTotal analysis: {result.vt_result}
                      </Alert>
                    </Grid>
                  )}
                </Grid>

                {result.ml_probs && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Probability Distribution
                    </Typography>
                    {Object.entries(result.ml_probs).map(([key, value]) => (
                      <Box key={key} sx={{ mb: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2">{key}</Typography>
                          <Typography variant="body2">{(value * 100).toFixed(1)}%</Typography>
                        </Box>
                        <Box
                          sx={{
                            width: '100%',
                            height: 8,
                            bgcolor: 'grey.200',
                            borderRadius: 1,
                            overflow: 'hidden',
                          }}
                        >
                          <Box
                            sx={{
                              width: `${value * 100}%`,
                              height: '100%',
                              bgcolor: 'primary.main',
                            }}
                          />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

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
