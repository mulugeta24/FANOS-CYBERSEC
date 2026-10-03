import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  LinearProgress,
  Stack,
  Tooltip,
  CircularProgress
} from '@mui/material'
import {
  Security as SecurityIcon,
  Add as AddIcon,
  PlayArrow as PlayIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  OpenInNew as OpenInNewIcon,
  PictureAsPdf as PdfIcon,
  Dns as DnsIcon,
  Language as LanguageIcon
} from '@mui/icons-material'
import { getScannerJobs, downloadScannerPdfReport } from '../../services/scannerApi'

export default function WebScannerDashboard() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadJobs()
    const interval = setInterval(loadJobs, 4000)
    return () => clearInterval(interval)
  }, [])

  const loadJobs = async () => {
    try {
      const data = await getScannerJobs(50)
      setJobs(data)
    } catch (err) {
      console.error('Failed to load scanner jobs:', err)
    } finally {
      setLoading(false)
    }
  }

  // Aggregate metrics
  const totalScans = jobs.length
  const activeScans = jobs.filter(j => j.status === 'running' || j.status === 'pending').length
  const totalCritical = jobs.reduce((acc, j) => acc + (j.stats?.critical || 0), 0)
  const totalHigh = jobs.reduce((acc, j) => acc + (j.stats?.high || 0), 0)
  const totalAssets = jobs.reduce((acc, j) => acc + (j.stats?.assets || 0), 0)

  const getStatusChip = (status) => {
    switch (status) {
      case 'completed':
        return <Chip label="Completed" size="small" sx={{ bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid #10b981', fontWeight: 600 }} />
      case 'running':
        return <Chip label="Scanning" size="small" icon={<CircularProgress size={12} sx={{ color: '#38bdf8 !important' }} />} sx={{ bgcolor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid #38bdf8', fontWeight: 600 }} />
      case 'failed':
        return <Chip label="Failed" size="small" sx={{ bgcolor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid #ef4444', fontWeight: 600 }} />
      case 'cancelled':
        return <Chip label="Cancelled" size="small" sx={{ bgcolor: 'rgba(148, 163, 184, 0.15)', color: '#94a3b8', border: '1px solid #94a3b8', fontWeight: 600 }} />
      default:
        return <Chip label="Pending" size="small" sx={{ bgcolor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid #f59e0b', fontWeight: 600 }} />
    }
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header Banner */}
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2} sx={{ mb: 4 }}>
        <Box>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <SecurityIcon sx={{ color: '#38bdf8', fontSize: 32 }} />
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.5px' }}>
              Enterprise Web Security Scanner
            </Typography>
          </Stack>
          <Typography variant="body1" sx={{ color: '#94a3b8', mt: 0.5 }}>
            Automated authorized surface mapping, crawling, TLS/SSL inspection, security header audit, and vulnerability correlation.
          </Typography>
        </Box>

        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadJobs}
            sx={{ borderColor: 'rgba(255,255,255,0.15)', color: '#94a3b8' }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/web-scanner/new')}
            sx={{
              backgroundColor: '#38bdf8',
              color: '#0a0f1d',
              fontWeight: 700,
              boxShadow: '0 0 20px rgba(56, 189, 248, 0.35)',
              '&:hover': { backgroundColor: '#0284c7' }
            }}
          >
            New Web Scan
          </Button>
        </Stack>
      </Stack>

      {/* Metric Cards */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#0d1527', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: 2 }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>Total Scans Conducted</Typography>
                  <Typography variant="h4" sx={{ color: '#f8fafc', fontWeight: 800, mt: 0.5 }}>{totalScans}</Typography>
                </Box>
                <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}>
                  <LanguageIcon />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#0d1527', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: 2 }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>Active Scans</Typography>
                  <Typography variant="h4" sx={{ color: '#38bdf8', fontWeight: 800, mt: 0.5 }}>{activeScans}</Typography>
                </Box>
                <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}>
                  <PlayIcon />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#0d1527', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: 2 }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>Critical & High Findings</Typography>
                  <Typography variant="h4" sx={{ color: '#ef4444', fontWeight: 800, mt: 0.5 }}>{totalCritical + totalHigh}</Typography>
                </Box>
                <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                  <ErrorIcon />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#0d1527', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 2 }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>Assets & URLs Mapped</Typography>
                  <Typography variant="h4" sx={{ color: '#10b981', fontWeight: 800, mt: 0.5 }}>{totalAssets}</Typography>
                </Box>
                <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                  <DnsIcon />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Scans Table */}
      <Paper sx={{ bgcolor: '#0d1527', border: '1px solid rgba(56, 189, 248, 0.15)', borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ p: 2.5, borderBottom: '1px solid rgba(56, 189, 248, 0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#f8fafc' }}>
            Assessment Audit History
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Showing {jobs.length} scans
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: 'rgba(10, 15, 29, 0.6)' }}>
              <TableRow>
                <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Target Domain & URL</TableCell>
                <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Progress</TableCell>
                <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Findings by Severity</TableCell>
                <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Duration</TableCell>
                <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Timestamp</TableCell>
                <TableCell align="right" sx={{ color: '#94a3b8', fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: '#38bdf8' }} />
                  </TableCell>
                </TableRow>
              ) : jobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6, color: '#64748b' }}>
                    No security assessments found. Click "New Web Scan" to audit an authorized target.
                  </TableCell>
                </TableRow>
              ) : (
                jobs.map((job) => {
                  const s = job.stats || {}
                  return (
                    <TableRow
                      key={job.id}
                      hover
                      sx={{
                        '&:hover': { bgcolor: 'rgba(56, 189, 248, 0.04)' },
                        cursor: 'pointer'
                      }}
                      onClick={() => navigate(`/web-scanner/${job.id}`)}
                    >
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                          {job.target_domain}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', fontFamily: 'monospace' }}>
                          {job.target_url}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        {getStatusChip(job.status)}
                      </TableCell>

                      <TableCell sx={{ width: 140 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={job.progress || 0}
                            sx={{
                              flexGrow: 1,
                              height: 6,
                              borderRadius: 3,
                              bgcolor: 'rgba(255,255,255,0.08)',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: job.status === 'failed' ? '#ef4444' : '#38bdf8'
                              }
                            }}
                          />
                          <Typography variant="caption" sx={{ color: '#94a3b8', minWidth: 28 }}>
                            {job.progress}%
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.2 }}>
                          {job.current_phase || 'Idle'}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Stack direction="row" spacing={0.8}>
                          {(s.critical || 0) > 0 && (
                            <Chip label={`Crit: ${s.critical}`} size="small" sx={{ bgcolor: '#dc2626', color: '#ffffff', height: 20, fontSize: '0.68rem', fontWeight: 700 }} />
                          )}
                          {(s.high || 0) > 0 && (
                            <Chip label={`High: ${s.high}`} size="small" sx={{ bgcolor: '#ea580c', color: '#ffffff', height: 20, fontSize: '0.68rem', fontWeight: 700 }} />
                          )}
                          {(s.medium || 0) > 0 && (
                            <Chip label={`Med: ${s.medium}`} size="small" sx={{ bgcolor: '#d97706', color: '#ffffff', height: 20, fontSize: '0.68rem', fontWeight: 700 }} />
                          )}
                          {(s.low || 0) > 0 && (
                            <Chip label={`Low: ${s.low}`} size="small" sx={{ bgcolor: '#2563eb', color: '#ffffff', height: 20, fontSize: '0.68rem', fontWeight: 700 }} />
                          )}
                          {(s.informational || 0) > 0 && (
                            <Chip label={`Info: ${s.informational}`} size="small" sx={{ bgcolor: '#059669', color: '#ffffff', height: 20, fontSize: '0.68rem', fontWeight: 700 }} />
                          )}
                          {((s.critical || 0) + (s.high || 0) + (s.medium || 0) + (s.low || 0) + (s.informational || 0)) === 0 && (
                            <Typography variant="caption" sx={{ color: '#64748b' }}>None</Typography>
                          )}
                        </Stack>
                      </TableCell>

                      <TableCell sx={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                        {job.duration_seconds ? `${job.duration_seconds}s` : '-'}
                      </TableCell>

                      <TableCell sx={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                        {job.created_at ? new Date(job.created_at).toLocaleString() : '-'}
                      </TableCell>

                      <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="View Live Console">
                            <IconButton
                              size="small"
                              onClick={() => navigate(`/web-scanner/${job.id}`)}
                              sx={{ color: '#38bdf8' }}
                            >
                              <OpenInNewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          {job.status === 'completed' && (
                            <Tooltip title="Download PDF Report">
                              <IconButton
                                size="small"
                                onClick={() => downloadScannerPdfReport(job.id, `fanos_report_${job.target_domain}.pdf`)}
                                sx={{ color: '#10b981' }}
                              >
                                <PdfIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  )
}
