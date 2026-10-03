import React from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import {
  Box,
  Typography,
  Chip,
  Tabs,
  Tab,
  Button,
  Stack,
  CircularProgress
} from '@mui/material'
import {
  Security as SecurityIcon,
  BugReport as BugReportIcon,
  Language as LanguageIcon,
  ReceiptLong as ReceiptIcon,
  PictureAsPdf as PdfIcon,
  ArrowBack as BackIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material'
import { cancelScannerJob, downloadScannerPdfReport } from '../../services/scannerApi'

export default function ScannerHeader({ job, onRefresh }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { scanId } = useParams()

  const currentTab = () => {
    if (location.pathname.endsWith('/findings')) return 'findings'
    if (location.pathname.endsWith('/assets')) return 'assets'
    if (location.pathname.endsWith('/evidence')) return 'evidence'
    if (location.pathname.endsWith('/report')) return 'report'
    return 'overview'
  }

  const handleTabChange = (event, newValue) => {
    if (newValue === 'overview') navigate(`/web-scanner/${scanId}`)
    else navigate(`/web-scanner/${scanId}/${newValue}`)
  }

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to stop this security scan?')) {
      try {
        await cancelScannerJob(scanId)
        if (onRefresh) onRefresh()
      } catch (err) {
        console.error('Failed to cancel scan:', err)
      }
    }
  }

  const handleDownloadPdf = async () => {
    try {
      await downloadScannerPdfReport(scanId, `fanos_scan_${job?.target_domain || scanId}.pdf`)
    } catch (err) {
      alert('Error downloading PDF report. Please try again.')
    }
  }

  const isRunning = job?.status === 'running' || job?.status === 'pending'
  const stats = job?.stats || {}
  const totalFindings = (stats.critical || 0) + (stats.high || 0) + (stats.medium || 0) + (stats.low || 0) + (stats.informational || 0)

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981', border: '#10b981' }
      case 'running': return { bg: 'rgba(56, 189, 248, 0.15)', text: '#38bdf8', border: '#38bdf8' }
      case 'failed': return { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444', border: '#ef4444' }
      case 'cancelled': return { bg: 'rgba(148, 163, 184, 0.15)', text: '#94a3b8', border: '#94a3b8' }
      default: return { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b', border: '#f59e0b' }
    }
  }

  const statusStyle = getStatusColor(job?.status)

  return (
    <Box sx={{ mb: 3 }}>
      {/* Back button & quick breadcrumbs */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate('/web-scanner')}
          sx={{ color: '#94a3b8', '&:hover': { color: '#ffffff' }, textTransform: 'none' }}
          size="small"
        >
          All Scans
        </Button>
        <Typography sx={{ color: '#64748b' }}>/</Typography>
        <Typography sx={{ color: '#38bdf8', fontFamily: 'monospace', fontSize: '0.85rem' }}>
          {scanId}
        </Typography>
      </Stack>

      {/* Target Domain Title & Action Buttons */}
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2} sx={{ mb: 2 }}>
        <Box>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#f8fafc' }}>
              {job?.target_domain || 'Loading Target...'}
            </Typography>
            <Chip
              label={job?.status ? job.status.toUpperCase() : 'PENDING'}
              size="small"
              icon={isRunning ? <CircularProgress size={12} sx={{ color: `${statusStyle.text} !important` }} /> : undefined}
              sx={{
                height: 24,
                fontWeight: 700,
                fontSize: '0.72rem',
                backgroundColor: statusStyle.bg,
                color: statusStyle.text,
                border: `1px solid ${statusStyle.border}`
              }}
            />
          </Stack>
          <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5, fontFamily: 'monospace' }}>
            {job?.target_url || ''}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5}>
          {isRunning ? (
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<CancelIcon />}
              onClick={handleCancel}
              sx={{ borderRadius: 2 }}
            >
              Stop Scan
            </Button>
          ) : (
            <Button
              variant="contained"
              size="small"
              startIcon={<PdfIcon />}
              onClick={handleDownloadPdf}
              sx={{
                backgroundColor: '#38bdf8',
                color: '#0a0f1d',
                fontWeight: 700,
                '&:hover': { backgroundColor: '#0284c7' }
              }}
            >
              Export PDF
            </Button>
          )}

          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshIcon />}
            onClick={onRefresh}
            sx={{ borderColor: 'rgba(255,255,255,0.15)', color: '#94a3b8' }}
          >
            Refresh
          </Button>
        </Stack>
      </Stack>

      {/* Navigation Sub-Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'rgba(56, 189, 248, 0.15)' }}>
        <Tabs
          value={currentTab()}
          onChange={handleTabChange}
          sx={{
            minHeight: 44,
            '& .MuiTabs-indicator': { backgroundColor: '#38bdf8', height: 3 },
            '& .MuiTab-root': {
              color: '#94a3b8',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              minHeight: 44,
              py: 0.5,
              '&.Mui-selected': { color: '#38bdf8' }
            }
          }}
        >
          <Tab value="overview" label="Scan Overview" icon={<SecurityIcon fontSize="small" />} iconPosition="start" />
          <Tab
            value="findings"
            label={`Findings (${totalFindings})`}
            icon={<BugReportIcon fontSize="small" />}
            iconPosition="start"
          />
          <Tab
            value="assets"
            label={`Assets & Tech (${(stats.assets || 0) + (stats.technologies || 0)})`}
            icon={<LanguageIcon fontSize="small" />}
            iconPosition="start"
          />
          <Tab value="evidence" label="Evidence Vault" icon={<ReceiptIcon fontSize="small" />} iconPosition="start" />
          <Tab value="report" label="Assessment Report" icon={<PdfIcon fontSize="small" />} iconPosition="start" />
        </Tabs>
      </Box>
    </Box>
  )
}
