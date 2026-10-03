import React, { useState, useEffect } from 'react'
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
} from '@mui/material'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { getStats, getAllScans } from '../services/api'

const COLORS = {
  benign: '#4caf50',
  malicious: '#f44336',
  phishing: '#ff9800',
  defacement: '#9c27b0',
  suspicious: '#ff5722',
}

const StatCard = ({ title, value, color }) => (
  <Card>
    <CardContent>
      <Typography color="textSecondary" gutterBottom variant="body2">
        {title}
      </Typography>
      <Typography variant="h4" component="div" sx={{ color }}>
        {value.toLocaleString()}
      </Typography>
    </CardContent>
  </Card>
)

export default function Statistics() {
  const [stats, setStats] = useState(null)
  const [scans, setScans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  useEffect(() => {
    loadStatistics()
  }, [])

  const loadStatistics = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Load stats and scans in parallel
      const [statsData, scansData] = await Promise.all([
        getStats(),
        getAllScans()
      ])
      
      console.log('Statistics API response:', statsData)
      console.log('Scans data:', scansData)
      
      // Handle the corrected data structure
      const processedStats = {
        totalChecked: statsData.total_checked || 0,
        malicious: statsData.malicious_count || 0,
        benign: statsData.benign_count || 0,
        phishing: statsData.reports_by_category?.phishing || 0,
        defacement: statsData.reports_by_category?.defacement || 0,
        suspicious: statsData.reports_by_category?.suspicious || 0,
      }
      
      console.log('Processed stats data:', processedStats)
      setStats(processedStats)
      setScans(scansData)
    } catch (error) {
      console.error('Error loading statistics:', error)
      setError('Failed to load statistics. Please try again.')
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" onClose={() => setError('')}>
        {error}
      </Alert>
    )
  }

  if (!stats || stats.totalChecked === 0) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Statistics & Analytics
        </Typography>
        <Alert severity="info">
          No statistics available yet. Start scanning URLs to see data here.
        </Alert>
      </Box>
    )
  }

  // Prepare category distribution data
  const categoryData = [
    { category: 'Benign', count: stats.benign || 0, color: COLORS.benign },
    { category: 'Malicious', count: stats.malicious || 0, color: COLORS.malicious },
    { category: 'Phishing', count: stats.phishing || 0, color: COLORS.phishing },
    { category: 'Defacement', count: stats.defacement || 0, color: COLORS.defacement },
  ].filter(item => item.count > 0)

  // Prepare pie chart data
  const pieData = categoryData.map(item => ({
    name: item.category,
    value: item.count,
  }))

  // Calculate percentages for the 4 main classes
  const total = stats.totalChecked || 1
  
  // Get individual class counts from by_type
  const maliciousOnly = stats.malicious - (stats.phishing || 0) - (stats.defacement || 0) - (stats.suspicious || 0)
  
  const accuracyData = [
    { 
      metric: 'Benign', 
      value: total > 0 ? Math.round((stats.benign / total) * 100) : 0,
      color: '#4caf50'
    },
    { 
      metric: 'Malicious', 
      value: total > 0 ? Math.round((maliciousOnly / total) * 100) : 0,
      color: '#f44336'
    },
    { 
      metric: 'Phishing', 
      value: total > 0 ? Math.round((stats.phishing / total) * 100) : 0,
      color: '#ff9800'
    },
    { 
      metric: 'Defacement', 
      value: total > 0 ? Math.round((stats.defacement / total) * 100) : 0,
      color: '#9c27b0'
    },
  ]

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Statistics & Analytics
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard
            title="Total URLs Checked"
            value={stats.totalChecked}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard
            title="Total Threats Detected"
            value={stats.malicious}
            color="error.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard
            title="Benign URLs"
            value={stats.benign}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard
            title="Phishing Attempts"
            value={stats.phishing}
            color="warning.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard
            title="Defacement Detected"
            value={stats.defacement}
            color="secondary.main"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Category Distribution
            </Typography>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#1976d2">
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="textSecondary">
                  No data available yet
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Detection Distribution
            </Typography>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={categoryData[index]?.color || '#8884d8'} 
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="textSecondary">
                  No data available yet
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Detection Rates by Category
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={accuracyData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="metric" type="category" width={120} />
                <RechartsTooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="value">
                  {accuracyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={2.4}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h3" color="primary">
                    {stats.totalChecked}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total Scans
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={2.4}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h3" color="error">
                    {total > 0 ? Math.round((stats.malicious / total) * 100) : 0}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Malicious Rate
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={2.4}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h3" color="success.main">
                    {total > 0 ? Math.round((stats.benign / total) * 100) : 0}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Benign Rate
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={2.4}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h3" color="warning.main">
                    {stats.phishing}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Phishing Detected
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={2.4}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h3" color="secondary.main">
                    {stats.defacement}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Defacement Detected
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {scans.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Scans
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>URL</TableCell>
                    <TableCell>Verdict</TableCell>
                    <TableCell>ML Prediction</TableCell>
                    <TableCell>Timestamp</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {scans
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((scan) => (
                      <TableRow key={scan.id} hover>
                        <TableCell>{scan.id}</TableCell>
                        <TableCell>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              maxWidth: 300, 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                            title={scan.url}
                          >
                            {scan.url}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={scan.report_type || 'Unknown'}
                            color={getCategoryColor(scan.report_type)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={scan.ml_prediction || 'N/A'}
                            variant="outlined"
                            size="small"
                            color={getCategoryColor(scan.ml_prediction)}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatTimestamp(scan.timestamp)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={scans.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          </Paper>
        </Box>
      )}
    </Box>
  )
}
