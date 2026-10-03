import React, { useState, useEffect } from 'react'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Box,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
} from '@mui/material'
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
} from '@mui/icons-material'
import { getReports } from '../services/api'

const getCategoryColor = (category) => {
  const colors = {
    benign: 'success',
    malicious: 'error',
    phishing: 'warning',
    defacement: 'secondary',
    suspicious: 'warning',
  }
  return colors[category?.toLowerCase()] || 'default'
}

const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'N/A'
  const date = new Date(timestamp * 1000)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function Reports() {
  const [reports, setReports] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadReports()
  }, [])

  const loadReports = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getReports()
      console.log('Reports loaded:', data)
      setReports(data)
    } catch (error) {
      console.error('Error loading reports:', error)
      setError('Failed to load reports. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const filteredReports = reports.filter((report) =>
    report.url?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleExport = () => {
    const csv = [
      ['ID', 'URL', 'Report Type', 'ML Prediction', 'VT Result', 'Timestamp'],
      ...filteredReports.map(r => [
        r.id,
        r.url,
        r.report_type || 'N/A',
        r.ml_prediction || 'N/A',
        r.vt_result || 'N/A',
        formatTimestamp(r.timestamp)
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `reports_${Date.now()}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4">
            User Reports
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Reports submitted by users for incorrect detections or feedback
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Refresh">
            <IconButton onClick={loadReports} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export CSV">
            <IconButton onClick={handleExport} disabled={filteredReports.length === 0}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 2, p: 2 }}>
        <TextField
          fullWidth
          placeholder="Search by URL..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      ) : filteredReports.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            {searchTerm ? 'No reports found matching your search' : 'No user reports yet'}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            {!searchTerm && 'User reports appear here when users submit feedback on detections'}
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>URL</TableCell>
                <TableCell>Report Type</TableCell>
                <TableCell>ML Prediction</TableCell>
                <TableCell>VirusTotal</TableCell>
                <TableCell>Timestamp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReports
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((report) => (
                  <TableRow key={report.id} hover>
                    <TableCell>{report.id}</TableCell>
                    <TableCell>
                      <Tooltip title={report.url}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            maxWidth: 300, 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {report.url}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={report.report_type || 'Unknown'}
                        color={getCategoryColor(report.report_type)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {report.ml_prediction && 
                       report.ml_prediction !== 'N/A' && 
                       report.ml_prediction !== null && 
                       report.ml_prediction !== undefined ? (
                        <Chip
                          label={report.ml_prediction}
                          variant="outlined"
                          size="small"
                          color={getCategoryColor(report.ml_prediction)}
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                          N/A
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {report.vt_result && 
                       report.vt_result !== 'N/A' && 
                       report.vt_result !== null && 
                       report.vt_result !== undefined ? (
                        <Chip
                          label={report.vt_result}
                          variant="outlined"
                          size="small"
                          color={getCategoryColor(report.vt_result)}
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                          N/A
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatTimestamp(report.timestamp)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredReports.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      )}

      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="textSecondary">
          Total Reports: {filteredReports.length}
        </Typography>
      </Box>
    </Box>
  )
}
