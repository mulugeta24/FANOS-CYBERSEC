import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  Divider,
  CircularProgress
} from '@mui/material'
import {
  ReceiptLong as ReceiptIcon,
  Shield as ShieldIcon,
  Lock as LockIcon
} from '@mui/icons-material'
import { getScannerJob, getScannerEvidence } from '../../services/scannerApi'
import ScannerHeader from './ScannerHeader'

export default function ScanEvidenceView() {
  const { scanId } = useParams()
  const [job, setJob] = useState(null)
  const [evidenceList, setEvidenceList] = useState([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      const [jobData, evidenceData] = await Promise.all([
        getScannerJob(scanId),
        getScannerEvidence(scanId)
      ])
      setJob(jobData)
      setEvidenceList(evidenceData)
    } catch (err) {
      console.error('Failed to load evidence items:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [scanId])

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <ScannerHeader job={job} onRefresh={loadData} />

      {/* Security Redaction Guarantee Banner */}
      <Paper sx={{ p: 2, bgcolor: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 2, mb: 3 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <LockIcon sx={{ color: '#10b981' }} />
          <Box>
            <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 700 }}>
              Automated Secret Sanitization & Redaction Active
            </Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
              All HTTP response payloads, authorization tokens, session cookies, and sensitive headers are cryptographically redacted prior to persistence.
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Evidence Cards */}
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#f8fafc', mb: 2 }}>
        Technical Evidence Artifacts ({evidenceList.length})
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={32} sx={{ color: '#38bdf8' }} />
        </Box>
      ) : evidenceList.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', bgcolor: '#0d1527', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 2, color: '#64748b' }}>
          No technical evidence records saved for this scan.
        </Paper>
      ) : (
        <Grid container spacing={2.5}>
          {evidenceList.map((item) => (
            <Grid item xs={12} md={6} key={item.id}>
              <Paper sx={{ p: 2.5, bgcolor: '#0d1527', border: '1px solid rgba(56, 189, 248, 0.15)', borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.5 }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                      {item.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', fontFamily: 'monospace' }}>
                      Finding Ref: {item.finding_id}
                    </Typography>
                  </Box>
                  <Chip
                    label={item.evidence_type.toUpperCase()}
                    size="small"
                    sx={{ bgcolor: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8', fontWeight: 700, fontSize: '0.68rem' }}
                  />
                </Stack>

                <Box sx={{ p: 2, bgcolor: '#060a14', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: 1.5, flexGrow: 1, overflowX: 'auto' }}>
                  <pre style={{ margin: 0, color: '#38bdf8', fontFamily: 'monospace', fontSize: '0.8rem', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                    {JSON.stringify(item.data, null, 2)}
                  </pre>
                </Box>

                <Typography variant="caption" sx={{ color: '#64748b', mt: 1.5, display: 'block', textAlign: 'right' }}>
                  Recorded: {item.created_at ? new Date(item.created_at).toLocaleString() : 'N/A'}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}
