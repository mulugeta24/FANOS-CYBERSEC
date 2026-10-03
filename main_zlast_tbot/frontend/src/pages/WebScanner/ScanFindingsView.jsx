import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  TextField,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material'
import {
  BugReport as BugReportIcon,
  Visibility as VisibilityIcon,
  FilterList as FilterListIcon,
  Check as CheckIcon,
  Launch as LaunchIcon
} from '@mui/icons-material'
import { getScannerJob, getScannerFindings, updateFindingStatus } from '../../services/scannerApi'
import ScannerHeader from './ScannerHeader'

const SEVERITY_COLORS = {
  Critical: { bg: '#dc2626', text: '#ffffff' },
  High: { bg: '#ea580c', text: '#ffffff' },
  Medium: { bg: '#d97706', text: '#ffffff' },
  Low: { bg: '#2563eb', text: '#ffffff' },
  Informational: { bg: '#059669', text: '#ffffff' },
}

export default function ScanFindingsView() {
  const { scanId } = useParams()
  const [job, setJob] = useState(null)
  const [findings, setFindings] = useState([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [filterSeverity, setFilterSeverity] = useState('ALL')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  // Selected Finding Modal
  const [selectedFinding, setSelectedFinding] = useState(null)
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false)

  const loadData = async () => {
    try {
      const [jobData, findingsData] = await Promise.all([
        getScannerJob(scanId),
        getScannerFindings(scanId),
      ])
      setJob(jobData)
      setFindings(findingsData)
    } catch (err) {
      console.error('Failed to load findings:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [scanId])

  const handleStatusChange = async (newStatus) => {
    if (!selectedFinding) return
    setStatusUpdateLoading(true)
    try {
      await updateFindingStatus(selectedFinding.id, newStatus)
      setSelectedFinding({ ...selectedFinding, status: newStatus })
      // Update in list
      setFindings(findings.map(f => f.id === selectedFinding.id ? { ...f, status: newStatus } : f))
    } catch (err) {
      alert('Failed to update finding status: ' + err.message)
    } finally {
      setStatusUpdateLoading(false)
    }
  }

  // Filter findings
  const filteredFindings = findings.filter(f => {
    if (filterSeverity !== 'ALL' && f.severity !== filterSeverity) return false
    if (filterStatus !== 'ALL' && f.status !== filterStatus) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return (
        f.title.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q) ||
        f.affected_url.toLowerCase().includes(q)
      )
    }
    return true
  })

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <ScannerHeader job={job} onRefresh={loadData} />

      {/* Filter Toolbar */}
      <Paper sx={{ p: 2.5, bgcolor: '#0d1527', border: '1px solid rgba(56, 189, 248, 0.15)', borderRadius: 2, mb: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }}>
          <TextField
            size="small"
            placeholder="Search findings by title, category, or URL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              flexGrow: 1,
              bgcolor: '#0a0f1d',
              '& .MuiOutlinedInput-root': { color: '#f8fafc' }
            }}
          />

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel sx={{ color: '#94a3b8' }}>Severity</InputLabel>
            <Select
              value={filterSeverity}
              label="Severity"
              onChange={(e) => setFilterSeverity(e.target.value)}
              sx={{ bgcolor: '#0a0f1d', color: '#f8fafc' }}
            >
              <MenuItem value="ALL">All Severities</MenuItem>
              <MenuItem value="Critical">Critical</MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Informational">Informational</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel sx={{ color: '#94a3b8' }}>Status</InputLabel>
            <Select
              value={filterStatus}
              label="Status"
              onChange={(e) => setFilterStatus(e.target.value)}
              sx={{ bgcolor: '#0a0f1d', color: '#f8fafc' }}
            >
              <MenuItem value="ALL">All Statuses</MenuItem>
              <MenuItem value="Open">Open</MenuItem>
              <MenuItem value="Confirmed">Confirmed</MenuItem>
              <MenuItem value="False Positive">False Positive</MenuItem>
              <MenuItem value="Accepted Risk">Accepted Risk</MenuItem>
              <MenuItem value="Resolved">Resolved</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* Findings Table */}
      <Paper sx={{ bgcolor: '#0d1527', border: '1px solid rgba(56, 189, 248, 0.15)', borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: 'rgba(10, 15, 29, 0.6)' }}>
              <TableRow>
                <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Severity</TableCell>
                <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Title & Description</TableCell>
                <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Category</TableCell>
                <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Confidence</TableCell>
                <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Status</TableCell>
                <TableCell align="right" sx={{ color: '#94a3b8', fontWeight: 600 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: '#38bdf8' }} />
                  </TableCell>
                </TableRow>
              ) : filteredFindings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6, color: '#64748b' }}>
                    No security findings matching the specified criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredFindings.map((f) => {
                  const sColor = SEVERITY_COLORS[f.severity] || { bg: '#64748b', text: '#ffffff' }
                  return (
                    <TableRow key={f.id} hover sx={{ '&:hover': { bgcolor: 'rgba(56, 189, 248, 0.04)' } }}>
                      <TableCell>
                        <Chip
                          label={f.severity.toUpperCase()}
                          size="small"
                          sx={{
                            bgcolor: sColor.bg,
                            color: sColor.text,
                            fontWeight: 700,
                            fontSize: '0.68rem',
                            height: 22
                          }}
                        />
                      </TableCell>

                      <TableCell sx={{ maxWidth: 400 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                          {f.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mt: 0.3 }} noWrap>
                          {f.affected_url}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                        {f.category}
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={f.confidence}
                          size="small"
                          variant="outlined"
                          sx={{ borderColor: 'rgba(56, 189, 248, 0.3)', color: '#38bdf8', fontSize: '0.72rem' }}
                        />
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={f.status}
                          size="small"
                          sx={{
                            bgcolor: f.status === 'Resolved' ? 'rgba(16, 185, 129, 0.15)' : f.status === 'False Positive' ? 'rgba(148, 163, 184, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                            color: f.status === 'Resolved' ? '#10b981' : f.status === 'False Positive' ? '#94a3b8' : '#f59e0b',
                            fontWeight: 600,
                            fontSize: '0.72rem'
                          }}
                        />
                      </TableCell>

                      <TableCell align="right">
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<VisibilityIcon />}
                          onClick={() => setSelectedFinding(f)}
                          sx={{ borderColor: '#38bdf8', color: '#38bdf8', textTransform: 'none' }}
                        >
                          View Finding
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Detailed Technical Finding Modal */}
      <Dialog
        open={Boolean(selectedFinding)}
        onClose={() => setSelectedFinding(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { bgcolor: '#0d1527', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: 2 }
        }}
      >
        {selectedFinding && (
          <>
            <DialogTitle sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', pb: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                    <Chip
                      label={selectedFinding.severity.toUpperCase()}
                      size="small"
                      sx={{
                        bgcolor: SEVERITY_COLORS[selectedFinding.severity]?.bg || '#64748b',
                        color: '#ffffff',
                        fontWeight: 800
                      }}
                    />
                    <Chip
                      label={`Confidence: ${selectedFinding.confidence}`}
                      size="small"
                      variant="outlined"
                      sx={{ borderColor: 'rgba(56, 189, 248, 0.4)', color: '#38bdf8' }}
                    />
                  </Stack>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#f8fafc' }}>
                    {selectedFinding.title}
                  </Typography>
                </Box>

                {/* Workflow Status Selector */}
                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <InputLabel sx={{ color: '#94a3b8' }}>Status</InputLabel>
                  <Select
                    value={selectedFinding.status}
                    label="Status"
                    onChange={(e) => handleStatusChange(e.target.value)}
                    disabled={statusUpdateLoading}
                    sx={{ bgcolor: '#0a0f1d', color: '#f8fafc' }}
                  >
                    <MenuItem value="Open">Open</MenuItem>
                    <MenuItem value="Confirmed">Confirmed</MenuItem>
                    <MenuItem value="False Positive">False Positive</MenuItem>
                    <MenuItem value="Accepted Risk">Accepted Risk</MenuItem>
                    <MenuItem value="Resolved">Resolved</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </DialogTitle>

            <DialogContent sx={{ py: 3 }}>
              {/* Finding Location & Metadata */}
              <Paper sx={{ p: 2, bgcolor: '#0a0f1d', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: 1.5, mb: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>Affected Asset</Typography>
                    <Typography variant="body2" sx={{ color: '#f8fafc', fontWeight: 600, fontFamily: 'monospace' }}>
                      {selectedFinding.affected_asset}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>Target URL</Typography>
                    <Typography variant="body2" sx={{ color: '#38bdf8', fontWeight: 600, fontFamily: 'monospace' }}>
                      {selectedFinding.affected_url}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>HTTP Method</Typography>
                    <Typography variant="body2" sx={{ color: '#f8fafc' }}>
                      {selectedFinding.http_method || 'GET'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>Parameter</Typography>
                    <Typography variant="body2" sx={{ color: '#f8fafc' }}>
                      {selectedFinding.parameter || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>Scanner Module</Typography>
                    <Typography variant="body2" sx={{ color: '#f8fafc' }}>
                      {selectedFinding.scanner_module}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>Category</Typography>
                    <Typography variant="body2" sx={{ color: '#f8fafc' }}>
                      {selectedFinding.category}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Observed Technical Evidence */}
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#38bdf8', mb: 1 }}>
                Observed Technical Evidence
              </Typography>
              <Paper sx={{ p: 2, bgcolor: '#060a14', border: '1px solid rgba(56, 189, 248, 0.15)', borderRadius: 1.5, mb: 3 }}>
                <pre style={{ margin: 0, color: '#38bdf8', fontFamily: 'monospace', fontSize: '0.82rem', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                  {JSON.stringify(selectedFinding.evidence, null, 2)}
                </pre>
              </Paper>

              {/* Analysis */}
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#f8fafc', mb: 0.5 }}>
                Technical Analysis & Context
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.6, mb: 3 }}>
                {selectedFinding.description}
              </Typography>

              {/* Impact */}
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#ef4444', mb: 0.5 }}>
                Security Impact
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.6, mb: 3 }}>
                {selectedFinding.impact}
              </Typography>

              {/* Recommendation */}
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#10b981', mb: 0.5 }}>
                Recommended Remediation
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 1.5, mb: 3 }}>
                <Typography variant="body2" sx={{ color: '#34d399', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  {selectedFinding.remediation}
                </Typography>
              </Paper>

              {/* References */}
              {selectedFinding.references?.length > 0 && (
                <>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#f8fafc', mb: 1 }}>
                    Security References & Standards
                  </Typography>
                  <Stack spacing={0.8}>
                    {selectedFinding.references.map((ref, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LaunchIcon sx={{ fontSize: 14, color: '#38bdf8' }} />
                        <a href={ref.url} target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8', fontSize: '0.85rem', textDecoration: 'none' }}>
                          {ref.title || ref.url}
                        </a>
                      </Box>
                    ))}
                  </Stack>
                </>
              )}
            </DialogContent>

            <DialogActions sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', px: 3, py: 2 }}>
              <Button onClick={() => setSelectedFinding(null)} sx={{ color: '#94a3b8' }}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  )
}
