import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Switch,
  Slider,
  Alert,
  Stack,
  Divider,
  Chip,
  CircularProgress
} from '@mui/material'
import {
  Security as SecurityIcon,
  PlayArrow as PlayIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  ArrowBack as BackIcon,
  VerifiedUser as VerifiedIcon,
  Rule as RuleIcon
} from '@mui/icons-material'
import { createScannerJob, validateTargetScope } from '../../services/scannerApi'

export default function NewWebScan() {
  const navigate = useNavigate()

  // Form State
  const [targetUrl, setTargetUrl] = useState('')
  const [includeSubdomains, setIncludeSubdomains] = useState(true)
  const [allowActiveProbes, setAllowActiveProbes] = useState(true)
  const [maxUrls, setMaxUrls] = useState(30)
  const [maxDepth, setMaxDepth] = useState(2)
  const [excludedDomains, setExcludedDomains] = useState('')
  const [excludedPaths, setExcludedPaths] = useState('')
  const [authorizationConfirmed, setAuthorizationConfirmed] = useState(false)

  // Validation & Submission State
  const [preflightStatus, setPreflightStatus] = useState(null)
  const [validating, setValidating] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleValidateTarget = async () => {
    if (!targetUrl.trim()) {
      setErrorMsg('Please enter a target URL or domain first')
      return
    }
    setErrorMsg('')
    setValidating(true)
    try {
      const res = await validateTargetScope(targetUrl.trim())
      setPreflightStatus(res)
    } catch (err) {
      const errDetail = err.response?.data?.error || err.message || 'Target validation failed'
      setPreflightStatus({ valid: false, error: errDetail })
    } finally {
      setValidating(false)
    }
  }

  const handleLaunchScan = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (!targetUrl.trim()) {
      setErrorMsg('Target URL is required.')
      return
    }

    if (!authorizationConfirmed) {
      setErrorMsg('Authorization confirmation required. You must certify explicit authorization.')
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        target_url: targetUrl.trim(),
        authorization_confirmed: true,
        include_subdomains: includeSubdomains,
        allow_active_probes: allowActiveProbes,
        max_urls: maxUrls,
        max_depth: maxDepth,
        excluded_domains: excludedDomains.split(',').map(d => d.trim()).filter(Boolean),
        excluded_paths: excludedPaths.split(',').map(p => p.trim()).filter(Boolean),
      }

      const res = await createScannerJob(payload)
      if (res.job_id) {
        navigate(`/web-scanner/${res.job_id}`)
      } else {
        throw new Error('Failed to obtain scan job ID')
      }
    } catch (err) {
      console.error('Launch scan error:', err)
      const errDetail = err.response?.data?.error || err.message || 'Failed to start security scan'
      setErrorMsg(errDetail)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1000, mx: 'auto' }}>
      <Button
        startIcon={<BackIcon />}
        onClick={() => navigate('/web-scanner')}
        sx={{ mb: 3, color: '#94a3b8', '&:hover': { color: '#ffffff' } }}
      >
        Back to Scans
      </Button>

      <Paper sx={{ p: { xs: 3, md: 4 }, bgcolor: '#0d1527', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}>
            <SecurityIcon fontSize="large" />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#f8fafc' }}>
              Configure Enterprise Web Security Assessment
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
              Specify target domain, enforce crawl boundaries, and certify testing authorization.
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', my: 3 }} />

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 3, bgcolor: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', border: '1px solid #ef4444' }}>
            {errorMsg}
          </Alert>
        )}

        <form onSubmit={handleLaunchScan}>
          {/* Target URL Input & Preflight */}
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#38bdf8', mb: 1 }}>
            1. Target Web Application
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={9}>
              <TextField
                fullWidth
                label="Target URL or Fully Qualified Domain Name"
                placeholder="https://example.com or company-portal.org"
                value={targetUrl}
                onChange={(e) => {
                  setTargetUrl(e.target.value)
                  setPreflightStatus(null)
                }}
                required
                sx={{
                  bgcolor: '#0a0f1d',
                  '& .MuiOutlinedInput-root': {
                    color: '#f8fafc',
                    '& fieldset': { borderColor: 'rgba(56, 189, 248, 0.3)' },
                    '&:hover fieldset': { borderColor: '#38bdf8' },
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleValidateTarget}
                disabled={validating || !targetUrl.trim()}
                sx={{
                  height: '56px',
                  borderColor: 'rgba(56, 189, 248, 0.4)',
                  color: '#38bdf8',
                  fontWeight: 600,
                  '&:hover': { bgcolor: 'rgba(56, 189, 248, 0.1)' }
                }}
              >
                {validating ? <CircularProgress size={24} sx={{ color: '#38bdf8' }} /> : 'Pre-Flight Check'}
              </Button>
            </Grid>
          </Grid>

          {/* Preflight Results Feedback */}
          {preflightStatus && (
            <Alert
              severity={preflightStatus.valid ? 'success' : 'error'}
              sx={{
                mb: 3,
                bgcolor: preflightStatus.valid ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                border: `1px solid ${preflightStatus.valid ? '#10b981' : '#ef4444'}`
              }}
            >
              {preflightStatus.valid ? (
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    Target Validated & SSRF Safe
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                    Normalized URL: <b>{preflightStatus.normalized_url}</b> | Resolved IPs: {preflightStatus.resolved_ips?.join(', ')}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2">
                  Validation Error: {preflightStatus.error}
                </Typography>
              )}
            </Alert>
          )}

          {/* Scope Controls */}
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#38bdf8', mb: 1, mt: 3 }}>
            2. Scope & Crawl Boundary Controls
          </Typography>

          <Paper sx={{ p: 2.5, bgcolor: '#0a0f1d', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 2, mb: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={includeSubdomains}
                      onChange={(e) => setIncludeSubdomains(e.target.checked)}
                      color="primary"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#f8fafc' }}>
                        Include Authorized Subdomains
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                        Enables discovery of www, api, app, auth under target domain.
                      </Typography>
                    </Box>
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={allowActiveProbes}
                      onChange={(e) => setAllowActiveProbes(e.target.checked)}
                      color="primary"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#f8fafc' }}>
                        Audit Sensitive Endpoints
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                        Safely probes for exposed /.env, /.git/HEAD, and robots.txt.
                      </Typography>
                    </Box>
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>
                  Max URLs to Crawl: <b>{maxUrls}</b>
                </Typography>
                <Slider
                  value={maxUrls}
                  min={5}
                  max={100}
                  step={5}
                  valueLabelDisplay="auto"
                  onChange={(e, val) => setMaxUrls(val)}
                  sx={{ color: '#38bdf8' }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>
                  Max Crawl Depth: <b>{maxDepth}</b> hops
                </Typography>
                <Slider
                  value={maxDepth}
                  min={1}
                  max={4}
                  step={1}
                  valueLabelDisplay="auto"
                  onChange={(e, val) => setMaxDepth(val)}
                  sx={{ color: '#38bdf8' }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Excluded Domains (comma separated)"
                  placeholder="admin.target.com, staging.target.com"
                  value={excludedDomains}
                  onChange={(e) => setExcludedDomains(e.target.value)}
                  sx={{
                    bgcolor: '#0d1527',
                    '& .MuiOutlinedInput-root': { color: '#f8fafc' }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Excluded Paths (comma separated)"
                  placeholder="/logout, /api/internal/*"
                  value={excludedPaths}
                  onChange={(e) => setExcludedPaths(e.target.value)}
                  sx={{
                    bgcolor: '#0d1527',
                    '& .MuiOutlinedInput-root': { color: '#f8fafc' }
                  }}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Mandatory Authorization Agreement */}
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#f59e0b', mb: 1 }}>
            3. Mandatory Scope & Authorization Certification
          </Typography>

          <Paper sx={{ p: 2.5, bgcolor: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: 2, mb: 4 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={authorizationConfirmed}
                  onChange={(e) => setAuthorizationConfirmed(e.target.checked)}
                  sx={{ color: '#f59e0b', '&.Mui-checked': { color: '#f59e0b' } }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: '#f8fafc', fontWeight: 600 }}>
                  I solemnly certify and warrant that I am the authorized owner of this target domain or have received explicit written permission to conduct web security assessments on it. I understand scanning third-party systems without permission violates law.
                </Typography>
              }
            />
          </Paper>

          {/* Submission Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={submitting || !authorizationConfirmed || !targetUrl.trim()}
            startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <PlayIcon />}
            sx={{
              py: 1.8,
              fontSize: '1.05rem',
              fontWeight: 800,
              backgroundColor: '#38bdf8',
              color: '#0a0f1d',
              boxShadow: '0 0 25px rgba(56, 189, 248, 0.4)',
              '&:hover': { backgroundColor: '#0284c7' },
              '&:disabled': { backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#64748b' }
            }}
          >
            {submitting ? 'Initiating Security Pipeline...' : 'Launch Web Security Scan'}
          </Button>
        </form>
      </Paper>
    </Box>
  )
}
