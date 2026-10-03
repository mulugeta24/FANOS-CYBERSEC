import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Card,
  CardContent,
  Stack,
  CircularProgress
} from '@mui/material'
import {
  Dns as DnsIcon,
  Language as LanguageIcon,
  Code as CodeIcon,
  Link as LinkIcon,
  Api as ApiIcon,
  Storage as StorageIcon
} from '@mui/icons-material'
import {
  getScannerJob,
  getScannerAssets,
  getScannerTechnologies,
  getScannerUrls,
  getScannerEndpoints
} from '../../services/scannerApi'
import ScannerHeader from './ScannerHeader'

export default function ScanAssetsView() {
  const { scanId } = useParams()
  const [job, setJob] = useState(null)
  const [assets, setAssets] = useState([])
  const [technologies, setTechnologies] = useState([])
  const [urls, setUrls] = useState([])
  const [endpoints, setEndpoints] = useState([])
  const [activeTab, setActiveTab] = useState('all_assets')
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      const [jobData, assetsData, techData, urlsData, epData] = await Promise.all([
        getScannerJob(scanId),
        getScannerAssets(scanId),
        getScannerTechnologies(scanId),
        getScannerUrls(scanId),
        getScannerEndpoints(scanId)
      ])
      setJob(jobData)
      setAssets(assetsData)
      setTechnologies(techData)
      setUrls(urlsData)
      setEndpoints(epData)
    } catch (err) {
      console.error('Failed to load asset discovery data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [scanId])

  const dnsAssets = assets.filter(a => a.asset_type === 'dns_record' || a.asset_type === 'domain')
  const ipAssets = assets.filter(a => a.asset_type === 'ip_address')
  const subdomainAssets = assets.filter(a => a.asset_type === 'subdomain')
  const serviceAssets = assets.filter(a => a.asset_type === 'service')

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <ScannerHeader job={job} onRefresh={loadData} />

      {/* Distinction Banner */}
      <Paper sx={{ p: 2, bgcolor: 'rgba(56, 189, 248, 0.05)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: 2, mb: 3 }}>
        <Typography variant="body2" sx={{ color: '#38bdf8', fontWeight: 600 }}>
          ℹ️ Asset Inventory Principle:
        </Typography>
        <Typography variant="caption" sx={{ color: '#94a3b8' }}>
          Assets discovered below represent the authorized perimeter, services, technologies, and routes mapped during assessment. Discovered assets are strictly separated from confirmed security vulnerabilities.
        </Typography>
      </Paper>

      {/* Sub tabs for Asset Inventory */}
      <Paper sx={{ bgcolor: '#0d1527', border: '1px solid rgba(56, 189, 248, 0.15)', borderRadius: 2, mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, val) => setActiveTab(val)}
          sx={{
            px: 2,
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            '& .MuiTabs-indicator': { bgcolor: '#38bdf8' },
            '& .MuiTab-root': { color: '#94a3b8', textTransform: 'none', fontWeight: 600, '&.Mui-selected': { color: '#38bdf8' } }
          }}
        >
          <Tab value="all_assets" label={`Infrastructure (${assets.length})`} icon={<StorageIcon fontSize="small" />} iconPosition="start" />
          <Tab value="tech_stack" label={`Technologies (${technologies.length})`} icon={<CodeIcon fontSize="small" />} iconPosition="start" />
          <Tab value="crawled_urls" label={`Crawled URLs (${urls.length})`} icon={<LinkIcon fontSize="small" />} iconPosition="start" />
          <Tab value="api_routes" label={`API Endpoints (${endpoints.length})`} icon={<ApiIcon fontSize="small" />} iconPosition="start" />
        </Tabs>

        <Box sx={{ p: 2.5 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress size={32} sx={{ color: '#38bdf8' }} />
            </Box>
          ) : activeTab === 'all_assets' ? (
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: 'rgba(10, 15, 29, 0.6)' }}>
                  <TableRow>
                    <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Asset Classification</TableCell>
                    <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Asset Target / Value</TableCell>
                    <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Metadata / Details</TableCell>
                    <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Discovered At</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 4, color: '#64748b' }}>
                        No infrastructure assets recorded yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    assets.map((a) => (
                      <TableRow key={a.id} hover sx={{ '&:hover': { bgcolor: 'rgba(56, 189, 248, 0.04)' } }}>
                        <TableCell>
                          <Chip
                            label={a.asset_type.replace('_', ' ').toUpperCase()}
                            size="small"
                            sx={{
                              bgcolor: a.asset_type === 'ip_address' ? 'rgba(56, 189, 248, 0.15)' : a.asset_type === 'dns_record' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                              color: a.asset_type === 'ip_address' ? '#38bdf8' : a.asset_type === 'dns_record' ? '#10b981' : '#f59e0b',
                              fontWeight: 700,
                              fontSize: '0.68rem'
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ color: '#f8fafc', fontWeight: 600, fontFamily: 'monospace' }}>
                          {a.asset_value}
                        </TableCell>
                        <TableCell sx={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                          <pre style={{ margin: 0, fontSize: '0.75rem', fontFamily: 'monospace' }}>
                            {JSON.stringify(a.metadata, null, 1)}
                          </pre>
                        </TableCell>
                        <TableCell sx={{ color: '#64748b', fontSize: '0.85rem' }}>
                          {a.created_at ? new Date(a.created_at).toLocaleTimeString() : '-'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          ) : activeTab === 'tech_stack' ? (
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: 'rgba(10, 15, 29, 0.6)' }}>
                  <TableRow>
                    <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Category</TableCell>
                    <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Component / Technology</TableCell>
                    <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Detected Version</TableCell>
                    <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Confidence</TableCell>
                    <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Detection Evidence</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {technologies.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4, color: '#64748b' }}>
                        No application technologies fingerprinted.
                      </TableCell>
                    </TableRow>
                  ) : (
                    technologies.map((t) => (
                      <TableRow key={t.id} hover sx={{ '&:hover': { bgcolor: 'rgba(56, 189, 248, 0.04)' } }}>
                        <TableCell sx={{ color: '#38bdf8', fontWeight: 600 }}>
                          {t.category}
                        </TableCell>
                        <TableCell sx={{ color: '#f8fafc', fontWeight: 700 }}>
                          {t.name}
                        </TableCell>
                        <TableCell sx={{ color: '#f59e0b', fontFamily: 'monospace' }}>
                          {t.version || 'Unspecified'}
                        </TableCell>
                        <TableCell>
                          <Chip label={t.confidence} size="small" variant="outlined" sx={{ color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)' }} />
                        </TableCell>
                        <TableCell sx={{ color: '#94a3b8', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                          {t.evidence_text || 'Matched signature rules'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          ) : activeTab === 'crawled_urls' ? (
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: 'rgba(10, 15, 29, 0.6)' }}>
                  <TableRow>
                    <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>HTTP Status</TableCell>
                    <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Crawled URL</TableCell>
                    <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Content-Type</TableCell>
                    <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Latency</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {urls.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 4, color: '#64748b' }}>
                        No URLs crawled yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    urls.map((u) => (
                      <TableRow key={u.id} hover sx={{ '&:hover': { bgcolor: 'rgba(56, 189, 248, 0.04)' } }}>
                        <TableCell>
                          <Chip
                            label={u.status_code || 'ERR'}
                            size="small"
                            sx={{
                              bgcolor: u.status_code === 200 ? 'rgba(16, 185, 129, 0.15)' : u.status_code >= 400 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                              color: u.status_code === 200 ? '#10b981' : u.status_code >= 400 ? '#ef4444' : '#38bdf8',
                              fontWeight: 700
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ color: '#f8fafc', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                          {u.url}
                        </TableCell>
                        <TableCell sx={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                          {u.content_type || 'Unknown'}
                        </TableCell>
                        <TableCell sx={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                          {u.response_time_ms ? `${u.response_time_ms}ms` : '-'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: 'rgba(10, 15, 29, 0.6)' }}>
                  <TableRow>
                    <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Method</TableCell>
                    <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>API Endpoint Route</TableCell>
                    <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Parameters</TableCell>
                    <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Discovered</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {endpoints.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 4, color: '#64748b' }}>
                        No REST/GraphQL endpoints discovered.
                      </TableCell>
                    </TableRow>
                  ) : (
                    endpoints.map((ep) => (
                      <TableRow key={ep.id} hover sx={{ '&:hover': { bgcolor: 'rgba(56, 189, 248, 0.04)' } }}>
                        <TableCell>
                          <Chip label={ep.http_method || 'GET'} size="small" sx={{ bgcolor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', fontWeight: 700 }} />
                        </TableCell>
                        <TableCell sx={{ color: '#38bdf8', fontFamily: 'monospace', fontWeight: 600 }}>
                          {ep.endpoint_url}
                        </TableCell>
                        <TableCell sx={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                          {ep.parameters?.length > 0 ? ep.parameters.join(', ') : 'None extracted'}
                        </TableCell>
                        <TableCell sx={{ color: '#64748b', fontSize: '0.85rem' }}>
                          {ep.created_at ? new Date(ep.created_at).toLocaleTimeString() : '-'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Paper>
    </Box>
  )
}
