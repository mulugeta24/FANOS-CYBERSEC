import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Stack,
  Divider,
  Chip,
  CircularProgress
} from '@mui/material'
import {
  PictureAsPdf as PdfIcon,
  DataObject as JsonIcon,
  Download as DownloadIcon,
  Security as SecurityIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon
} from '@mui/icons-material'
import {
  getScannerJob,
  getScannerFindings,
  getScannerAssets,
  getScannerTechnologies,
  downloadScannerPdfReport,
  getScannerJsonReport
} from '../../services/scannerApi'
import ScannerHeader from './ScannerHeader'

export default function ScanReportView() {
  const { scanId } = useParams()
  const [job, setJob] = useState(null)
  const [findings, setFindings] = useState([])
  const [assets, setAssets] = useState([])
  const [technologies, setTechnologies] = useState([])
  const [loading, setLoading] = useState(true)
  const [downloadingPdf, setDownloadingPdf] = useState(false)

  const loadData = async () => {
    try {
      const [jobData, findingsData, assetsData, techData] = await Promise.all([
        getScannerJob(scanId),
        getScannerFindings(scanId),
        getScannerAssets(scanId),
        getScannerTechnologies(scanId)
      ])
      setJob(jobData)
      setFindings(findingsData)
      setAssets(assetsData)
      setTechnologies(techData)
    } catch (err) {
      console.error('Failed to load report data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [scanId])

  const handleDownloadPdf = async () => {
    setDownloadingPdf(true)
    try {
      await downloadScannerPdfReport(scanId, `fanos_security_report_${job?.target_domain || scanId}.pdf`)
    } catch (err) {
      alert('Error downloading PDF: ' + err.message)
    } finally {
      setDownloadingPdf(false)
    }
  }

  const handleDownloadJson = async () => {
    try {
      const jsonData = await getScannerJsonReport(scanId)
      const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `fanos_security_report_${job?.target_domain || scanId}.json`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      alert('Error downloading JSON: ' + err.message)
    }
  }

  const stats = job?.stats || {}

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <ScannerHeader job={job} onRefresh={loadData} />

      {/* Export Action Card */}
      <Paper sx={{ p: 3, bgcolor: '#0d1527', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: 2, mb: 4 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#f8fafc' }}>
              Official Security Assessment Deliverables
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
              Generate verifiable executive compliance reports with clear demarcation between Observed Evidence, Analysis, and Remediation.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              startIcon={<JsonIcon />}
              onClick={handleDownloadJson}
              sx={{ borderColor: 'rgba(56, 189, 248, 0.4)', color: '#38bdf8', fontWeight: 600 }}
            >
              Export JSON
            </Button>
            <Button
              variant="contained"
              startIcon={downloadingPdf ? <CircularProgress size={18} color="inherit" /> : <PdfIcon />}
              onClick={handleDownloadPdf}
              disabled={downloadingPdf}
              sx={{
                bgcolor: '#38bdf8',
                color: '#0a0f1d',
                fontWeight: 800,
                boxShadow: '0 0 20px rgba(56, 189, 248, 0.35)',
                '&:hover': { bgcolor: '#0284c7' }
              }}
            >
              Download PDF Report
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Executive Report Preview Document */}
      <Paper sx={{ p: { xs: 3, md: 5 }, bgcolor: '#0a0f1d', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 3 }}>
        {/* Document Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 4 }}>
          <Box>
            <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              FANOS CYBERSECURITY ASSESSMENT REPORT
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#f8fafc', mt: 0.5 }}>
              Web Security Assessment: {job?.target_domain}
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
              Certified Scope: <b>{job?.target_url}</b> | Status: <b>{job?.status?.toUpperCase()}</b>
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>Report ID: {job?.id}</Typography>
            <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>Generated: {new Date().toLocaleDateString()}</Typography>
          </Box>
        </Stack>

        <Divider sx={{ borderColor: 'rgba(56, 189, 248, 0.2)', mb: 4 }} />

        {/* 1. Executive Summary */}
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#38bdf8', mb: 1.5 }}>
          1. Executive Summary
        </Typography>
        <Typography variant="body2" sx={{ color: '#cbd5e1', lineHeight: 1.8, mb: 3 }}>
          An automated web security assessment was conducted against the authorized target <b>{job?.target_domain}</b>.
          The evaluation encompassed infrastructure asset discovery, HTTP security headers, cookie security configurations, TLS/SSL cryptographic posture, and scope-restricted endpoint crawling.
          A total of <b>{findings.length}</b> security findings were correlated across the application surface.
        </Typography>

        {/* Summary Table */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={6} sm={2.4}>
            <Box sx={{ p: 2, bgcolor: '#0d1527', border: '1px solid rgba(220, 38, 38, 0.4)', borderRadius: 1.5, textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 700 }}>Critical</Typography>
              <Typography variant="h5" sx={{ color: '#ef4444', fontWeight: 800 }}>{stats.critical || 0}</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={2.4}>
            <Box sx={{ p: 2, bgcolor: '#0d1527', border: '1px solid rgba(234, 88, 12, 0.4)', borderRadius: 1.5, textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: '#ea580c', fontWeight: 700 }}>High</Typography>
              <Typography variant="h5" sx={{ color: '#ea580c', fontWeight: 800 }}>{stats.high || 0}</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={2.4}>
            <Box sx={{ p: 2, bgcolor: '#0d1527', border: '1px solid rgba(217, 119, 6, 0.4)', borderRadius: 1.5, textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: '#d97706', fontWeight: 700 }}>Medium</Typography>
              <Typography variant="h5" sx={{ color: '#d97706', fontWeight: 800 }}>{stats.medium || 0}</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={2.4}>
            <Box sx={{ p: 2, bgcolor: '#0d1527', border: '1px solid rgba(37, 99, 235, 0.4)', borderRadius: 1.5, textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 700 }}>Low</Typography>
              <Typography variant="h5" sx={{ color: '#38bdf8', fontWeight: 800 }}>{stats.low || 0}</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={2.4}>
            <Box sx={{ p: 2, bgcolor: '#0d1527', border: '1px solid rgba(5, 150, 105, 0.4)', borderRadius: 1.5, textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 700 }}>Informational</Typography>
              <Typography variant="h5" sx={{ color: '#10b981', fontWeight: 800 }}>{stats.informational || 0}</Typography>
            </Box>
          </Grid>
        </Grid>

        {/* 2. Discovered Assets Overview */}
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#38bdf8', mb: 1.5 }}>
          2. Discovered Perimeter & Stack Inventory
        </Typography>
        <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }}>
          Total Perimeter Assets: <b>{assets.length}</b> | Crawled Pages: <b>{stats.urls || 0}</b> | Technologies Fingerprinted: <b>{technologies.length}</b>
        </Typography>
        <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {technologies.map(t => (
            <Chip key={t.id} label={`${t.name}${t.version ? ` (${t.version})` : ''}`} size="small" sx={{ bgcolor: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8' }} />
          ))}
        </Box>

        {/* 3. Detailed Findings List */}
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#38bdf8', mb: 2 }}>
          3. Detailed Findings Breakdown
        </Typography>

        {findings.length === 0 ? (
          <Typography variant="body2" sx={{ color: '#64748b' }}>No security vulnerabilities detected.</Typography>
        ) : (
          <Stack spacing={3}>
            {findings.map((f, idx) => (
              <Paper key={f.id} sx={{ p: 3, bgcolor: '#0d1527', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#f8fafc' }}>
                    #{idx + 1}. {f.title}
                  </Typography>
                  <Chip
                    label={f.severity.toUpperCase()}
                    size="small"
                    sx={{
                      fontWeight: 800,
                      bgcolor: f.severity === 'Critical' ? '#dc2626' : f.severity === 'High' ? '#ea580c' : f.severity === 'Medium' ? '#d97706' : '#2563eb',
                      color: '#ffffff'
                    }}
                  />
                </Stack>

                <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 2 }}>
                  Location: <b>{f.affected_url}</b> | Module: <b>{f.scanner_module}</b> | Confidence: <b>{f.confidence}</b>
                </Typography>

                {/* Evidence */}
                <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>
                  Observed Technical Evidence
                </Typography>
                <Paper sx={{ p: 1.5, bgcolor: '#060a14', border: '1px solid rgba(56, 189, 248, 0.15)', borderRadius: 1, my: 1 }}>
                  <pre style={{ margin: 0, color: '#38bdf8', fontFamily: 'monospace', fontSize: '0.78rem', whiteSpace: 'pre-wrap' }}>
                    {JSON.stringify(f.evidence, null, 2)}
                  </pre>
                </Paper>

                {/* Technical Analysis */}
                <Typography variant="caption" sx={{ color: '#f8fafc', fontWeight: 700, textTransform: 'uppercase', mt: 1.5, display: 'block' }}>
                  Technical Analysis
                </Typography>
                <Typography variant="body2" sx={{ color: '#cbd5e1', lineHeight: 1.6, my: 0.5 }}>
                  {f.description}
                </Typography>

                {/* Security Impact */}
                <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 700, textTransform: 'uppercase', mt: 1.5, display: 'block' }}>
                  Security Impact
                </Typography>
                <Typography variant="body2" sx={{ color: '#cbd5e1', lineHeight: 1.6, my: 0.5 }}>
                  {f.impact}
                </Typography>

                {/* Remediation */}
                <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 700, textTransform: 'uppercase', mt: 1.5, display: 'block' }}>
                  Remediation Recommendation
                </Typography>
                <Typography variant="body2" sx={{ color: '#34d399', lineHeight: 1.6, my: 0.5 }}>
                  {f.remediation}
                </Typography>
              </Paper>
            ))}
          </Stack>
        )}

        {/* 4. Assessment Limitations & Disclaimer */}
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', my: 4 }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#64748b', mb: 1 }}>
          Assessment Scope Limitations & Legal Disclaimer
        </Typography>
        <Typography variant="caption" sx={{ color: '#64748b', lineHeight: 1.6, display: 'block' }}>
          This security evaluation was conducted strictly in accordance with authorized scope parameters. Testing reflects security posture at the time of execution. Dynamic non-destructive testing cannot guarantee the total absence of zero-day vulnerabilities or unauthenticated architectural logic bugs. Routine remediation and validation are strongly recommended.
        </Typography>
      </Paper>
    </Box>
  )
}
