import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  Chip,
  Alert,
  Divider,
  Button,
  CircularProgress
} from '@mui/material'
import {
  Security as SecurityIcon,
  Language as LanguageIcon,
  Link as LinkIcon,
  Api as ApiIcon,
  Code as CodeIcon,
  BugReport as BugReportIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material'
import { getScannerJob, getScannerFindings } from '../../services/scannerApi'
import ScannerHeader from './ScannerHeader'

export default function LiveScanView() {
  const { scanId } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [recentFindings, setRecentFindings] = useState([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      const jobData = await getScannerJob(scanId)
      setJob(jobData)

      // Also fetch findings if available
      const findingsData = await getScannerFindings(scanId)
      setRecentFindings(findingsData.slice(0, 5))
    } catch (err) {
      console.error('Failed to load scan job:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    // Poll every 3 seconds while scan is running
    const interval = setInterval(() => {
      if (job?.status === 'running' || job?.status === 'pending') {
        loadData()
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [scanId, job?.status])

  if (loading && !job) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress size={40} sx={{ color: '#38bdf8' }} />
      </Box>
    )
  }

  const stats = job?.stats || {}
  const isRunning = job?.status === 'running' || job?.status === 'pending'
  const isFailed = job?.status === 'failed'

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <ScannerHeader job={job} onRefresh={loadData} />

      {/* Failure Alert Banner */}
      {isFailed && (
        <Alert severity="error" sx={{ mb: 3, bgcolor: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444' }}>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>Scan Execution Halted</Typography>
          <Typography variant="caption">{job?.error_message || 'The target could not be reached or an error occurred.'}</Typography>
        </Alert>
      )}

      {/* Live Progress Bar Banner */}
      <Paper sx={{ p: 3, bgcolor: '#0d1527', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: 2, mb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} sx={{ mb: 1.5 }}>
          <Box>
            <Typography variant="caption" sx={{ color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
              Current Pipeline Phase
            </Typography>
            <Typography variant="h6" sx={{ color: '#f8fafc', fontWeight: 700, mt: 0.2 }}>
              {job?.current_phase || 'Initializing Target Scan...'}
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ color: '#38bdf8', fontWeight: 800 }}>
            {job?.progress || 0}%
          </Typography>
        </Stack>

        <LinearProgress
          variant="determinate"
          value={job?.progress || 0}
          sx={{
            height: 10,
            borderRadius: 5,
            bgcolor: 'rgba(255, 255, 255, 0.08)',
            '& .MuiLinearProgress-bar': {
              bgcolor: isFailed ? '#ef4444' : '#38bdf8',
              borderRadius: 5,
              boxShadow: '0 0 12px rgba(56, 189, 248, 0.5)'
            }
          }}
        />

        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1.5 }}>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            Started: {job?.start_time ? new Date(job.start_time).toLocaleTimeString() : 'N/A'}
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            Duration: {job?.duration_seconds ? `${job.duration_seconds}s` : 'In progress...'}
          </Typography>
        </Stack>
      </Paper>

      {/* Discovery & Inventory Statistics */}
      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#f8fafc', mb: 2 }}>
        Discovered Attack Surface Metrics
      </Typography>

      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={3}>
          <Card sx={{ bgcolor: '#0d1527', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 2 }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>Assets Mapped</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#f8fafc', mt: 0.5 }}>{stats.assets || 0}</Typography>
                </Box>
                <LanguageIcon sx={{ color: '#38bdf8' }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={3}>
          <Card sx={{ bgcolor: '#0d1527', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 2 }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>URLs Crawled</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#f8fafc', mt: 0.5 }}>{stats.urls || 0}</Typography>
                </Box>
                <LinkIcon sx={{ color: '#10b981' }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={3}>
          <Card sx={{ bgcolor: '#0d1527', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 2 }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>APIs Discovered</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#f8fafc', mt: 0.5 }}>{stats.apis || 0}</Typography>
                </Box>
                <ApiIcon sx={{ color: '#f59e0b' }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={3}>
          <Card sx={{ bgcolor: '#0d1527', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 2 }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>Tech Detected</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#f8fafc', mt: 0.5 }}>{stats.technologies || 0}</Typography>
                </Box>
                <CodeIcon sx={{ color: '#a855f7' }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Findings Breakdown by Severity */}
      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#f8fafc', mb: 2 }}>
        Vulnerabilities & Security Audit Results
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={2.4}>
          <Paper sx={{ p: 2, bgcolor: '#0d1527', border: '1px solid rgba(220, 38, 38, 0.3)', borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 700 }}>CRITICAL</Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#ef4444', my: 0.5 }}>{stats.critical || 0}</Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>Immediate Action</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={2.4}>
          <Paper sx={{ p: 2, bgcolor: '#0d1527', border: '1px solid rgba(234, 88, 12, 0.3)', borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: '#ea580c', fontWeight: 700 }}>HIGH</Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#ea580c', my: 0.5 }}>{stats.high || 0}</Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>Significant Risk</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={2.4}>
          <Paper sx={{ p: 2, bgcolor: '#0d1527', border: '1px solid rgba(217, 119, 6, 0.3)', borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: '#d97706', fontWeight: 700 }}>MEDIUM</Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#d97706', my: 0.5 }}>{stats.medium || 0}</Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>Hardening Gaps</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={2.4}>
          <Paper sx={{ p: 2, bgcolor: '#0d1527', border: '1px solid rgba(37, 99, 235, 0.3)', borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 700 }}>LOW</Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#38bdf8', my: 0.5 }}>{stats.low || 0}</Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>Minor Disclosure</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={2.4}>
          <Paper sx={{ p: 2, bgcolor: '#0d1527', border: '1px solid rgba(5, 150, 105, 0.3)', borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 700 }}>INFORMATIONAL</Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#10b981', my: 0.5 }}>{stats.informational || 0}</Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>Architectural Notes</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Live Findings Feed */}
      <Paper sx={{ p: 3, bgcolor: '#0d1527', border: '1px solid rgba(56, 189, 248, 0.15)', borderRadius: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#f8fafc' }}>
              Identified Findings Feed
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              Latest security observations populated directly from active checks.
            </Typography>
          </Box>

          <Button
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate(`/web-scanner/${scanId}/findings`)}
            sx={{ color: '#38bdf8', fontWeight: 600 }}
          >
            View All Findings
          </Button>
        </Stack>

        {recentFindings.length === 0 ? (
          <Box sx={{ py: 4, textAlign: 'center', color: '#64748b' }}>
            {isRunning ? 'Analyzing web surface and running checks...' : 'No security gaps discovered.'}
          </Box>
        ) : (
          <Stack spacing={1.5}>
            {recentFindings.map((f) => (
              <Paper
                key={f.id}
                sx={{
                  p: 2,
                  bgcolor: 'rgba(10, 15, 29, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: 1.5,
                  cursor: 'pointer',
                  '&:hover': { borderColor: '#38bdf8' }
                }}
                onClick={() => navigate(`/web-scanner/${scanId}/findings`)}
              >
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                      {f.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                      Asset: {f.affected_asset} | Category: {f.category}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                      label={f.severity}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        bgcolor: f.severity === 'Critical' ? '#dc2626' : f.severity === 'High' ? '#ea580c' : f.severity === 'Medium' ? '#d97706' : '#2563eb',
                        color: '#ffffff'
                      }}
                    />
                    <Chip label={f.status} size="small" variant="outlined" sx={{ color: '#94a3b8', borderColor: 'rgba(255,255,255,0.2)' }} />
                  </Stack>
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </Paper>
    </Box>
  )
}
