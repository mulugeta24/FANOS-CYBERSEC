import React, { useState, useEffect } from 'react'
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material'
import {
  Security as SecurityIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  TrendingUp as TrendingIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts'
import { getStats } from '../services/api'

const StatCard = ({ title, value, icon, color, trend }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography color="textSecondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" component="div">
            {value}
          </Typography>
          {trend && (
            <Typography variant="body2" sx={{ color: trend > 0 ? 'success.main' : 'error.main', mt: 1 }}>
              {trend > 0 ? '+' : ''}{trend}% from last week
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            backgroundColor: `${color}.light`,
            borderRadius: 2,
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
)

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalChecked: 0,
    malicious: 0,
    benign: 0,
    phishing: 0,
    defacement: 0,
  })
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const data = await getStats()
      console.log('Dashboard stats loaded:', data)
      
      setStats({
        totalChecked: data.total_checked || 0,
        malicious: data.malicious_count || 0,
        benign: data.benign_count || 0,
        phishing: data.reports_by_category?.phishing || 0,
        defacement: data.reports_by_category?.defacement || 0,
      })
      
      // Use real daily activity data if available
      if (data.daily_activity && data.daily_activity.length > 0) {
        const formattedData = data.daily_activity.map(day => ({
          name: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
          checks: day.total || 0,
          malicious: day.malicious || 0,
        }))
        setChartData(formattedData)
      } else {
        // Default empty chart data
        setChartData([
          { name: 'Mon', checks: 0, malicious: 0 },
          { name: 'Tue', checks: 0, malicious: 0 },
          { name: 'Wed', checks: 0, malicious: 0 },
          { name: 'Thu', checks: 0, malicious: 0 },
          { name: 'Fri', checks: 0, malicious: 0 },
          { name: 'Sat', checks: 0, malicious: 0 },
          { name: 'Sun', checks: 0, malicious: 0 },
        ])
      }
      
      setLoading(false)
    } catch (error) {
      console.error('Error loading data:', error)
      setStats({
        totalChecked: 0,
        malicious: 0,
        benign: 0,
        phishing: 0,
        defacement: 0,
      })
      setChartData([])
      setLoading(false)
    }
  }

  const pieData = [
    { name: 'Benign', value: stats.benign || 0, color: '#4caf50' },
    { name: 'Malicious', value: stats.malicious || 0, color: '#f44336' },
    { name: 'Phishing', value: stats.phishing || 0, color: '#ff9800' },
    { name: 'Defacement', value: stats.defacement || 0, color: '#9c27b0' },
  ]

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Dashboard Overview
        </Typography>
        <Tooltip title="Refresh Data">
          <IconButton onClick={loadData} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : <RefreshIcon />}
          </IconButton>
        </Tooltip>
      </Box>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard
            title="Total URLs Checked"
            value={stats.totalChecked}
            icon={<SecurityIcon sx={{ color: 'primary.main' }} />}
            color="primary"
            trend={12}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard
            title="Total Threats Detected"
            value={stats.malicious}
            icon={<WarningIcon sx={{ color: 'error.main' }} />}
            color="error"
            trend={-5}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard
            title="Benign URLs"
            value={stats.benign}
            icon={<CheckIcon sx={{ color: 'success.main' }} />}
            color="success"
            trend={8}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard
            title="Phishing Attempts"
            value={stats.phishing}
            icon={<TrendingIcon sx={{ color: 'warning.main' }} />}
            color="warning"
            trend={-3}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard
            title="Defacement Detected"
            value={stats.defacement}
            icon={<WarningIcon sx={{ color: 'secondary.main' }} />}
            color="secondary"
            trend={2}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Weekly Activity
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Line type="monotone" dataKey="checks" stroke="#1976d2" strokeWidth={2} />
                <Line type="monotone" dataKey="malicious" stroke="#f44336" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Detection Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
