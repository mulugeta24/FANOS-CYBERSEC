import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  TextField,
  MenuItem,
  Alert,
  Snackbar,
  Divider,
} from '@mui/material'
import {
  Psychology as MLIcon,
  SmartToy as BotIcon,
  Shield as ShieldIcon,
  Analytics as AnalyticsIcon,
  Speed as SpeedIcon,
  Storage as StorageIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Dangerous as DangerousIcon,
  Code as CodeIcon,
  ArrowForward as ArrowForwardIcon,
  Send as SendIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  Hub as HubIcon,
  Terminal as TerminalIcon,
  VerifiedUser as VerifiedIcon,
  Lightbulb as LanternIcon,
  PlayArrow as PlayArrowIcon,
  Timeline as TimelineIcon,
  Link as LinkIcon,
  Memory as MemoryIcon,
  Description as DescriptionIcon,
  Language as GlobeIcon,
  FlashOn as FlashIcon,
} from '@mui/icons-material'
import FanosNavbar from '../components/FanosNavbar'
import FanosLogo from '../components/FanosLogo'
import axios from 'axios'

export default function FanosHome() {
  const navigate = useNavigate()

  // Telemetry stats state
  const [stats, setStats] = useState({
    total_checked: 57,
    malicious_count: 29,
    benign_count: 28,
    db_engine: 'Enterprise Cloud',
    ml_status: true,
    vt_status: true,
  })

  // Simulated Threat Demo state
  const [selectedDemo, setSelectedDemo] = useState('phishing')

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    category: 'false_positive',
    message: '',
    targetUrl: '',
  })
  const [contactSuccess, setContactSuccess] = useState(false)

  // Fetch real telemetry from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/public/stats')
        if (res.data) {
          setStats(res.data)
        }
      } catch (err) {
        console.log('Using default telemetry data:', err.message)
      }
    }
    fetchStats()
  }, [])

  // Demo scenarios for the simulator showcase
  const demoScenarios = {
    phishing: {
      url: 'https://secure-paypal-login.update-billing-verification.com/login.php',
      type: 'Phishing',
      risk: 94,
      color: '#fbbf24',
      indicators: [
        'Domain Typosquatting detected targeting PayPal',
        'Suspicious multi-subdomain depth (level 3)',
        'Sensitive keyword triggers: "login", "update", "verification"',
        'Zero reputational trust on WHOIS registrar',
      ],
      features: { length: 73, entropy: 4.62, subdomains: 3, suspiciousTld: 'Yes' },
    },
    malicious: {
      url: 'http://185.220.101.4/payload_drop/trojan_dropper.exe',
      type: 'Malicious (Malware)',
      risk: 99,
      color: '#f43f5e',
      indicators: [
        'Direct IP Address hostname masking',
        'Executable binary payload extension (.exe)',
        'Flagged by 48/70 VirusTotal security engines',
        'High likelihood of Command & Control dropper',
      ],
      features: { length: 54, entropy: 3.88, subdomains: 0, suspiciousTld: 'Raw IP' },
    },
    defacement: {
      url: 'http://compromised-gov-portal.org/hacked_by_ghost_squad.html',
      type: 'Defacement',
      risk: 88,
      color: '#a78bfa',
      indicators: [
        'Known defacement signature patterns in path structure',
        'Hactivist attribution tags recognized by ML model',
        'Unauthorized site override indicator detected',
      ],
      features: { length: 63, entropy: 4.15, subdomains: 1, suspiciousTld: 'Compromised' },
    },
    benign: {
      url: 'https://aws.amazon.com/security/cybersecurity-overview/',
      type: 'Benign (Safe)',
      risk: 2,
      color: '#10b981',
      indicators: [
        'Valid Extended Validation SSL certificate',
        'High domain reputation with 15+ years WHOIS age',
        '0/70 detections across all VirusTotal scanning engines',
        'Verified corporate digital signature',
      ],
      features: { length: 57, entropy: 3.45, subdomains: 2, suspiciousTld: 'Verified' },
    },
  }

  const handleContactSubmit = (e) => {
    e.preventDefault()
    setContactSuccess(true)
    setContactForm({
      name: '',
      email: '',
      category: 'false_positive',
      message: '',
      targetUrl: '',
    })
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0a0f1d', color: '#f8fafc' }}>
      {/* Top Navigation Bar */}
      <FanosNavbar />

      {/* =========================================================================
          HERO & TOP SECTION (EXACT ULTRA-MODERN REPLICA OF THE REFERENCE IMAGE)
          ========================================================================= */}
      <Box
        id="home"
        sx={{
          pt: { xs: 4, sm: 6, md: 8 },
          pb: { xs: 6, md: 8 },
          backgroundColor: '#060b17',
          backgroundImage:
            'radial-gradient(ellipse 90% 50% at 50% 0%, rgba(14, 165, 233, 0.16), transparent 70%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2.5, sm: 4, md: 6 } }}>
          {/* Main 2-Column Hero Split */}
          <Grid container spacing={{ xs: 4, lg: 6 }} alignItems="center">
            {/* Left Column: Hero Typography, Badges & CTA */}
            <Grid item xs={12} lg={6}>
              {/* Main Headline */}
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.8rem', sm: '3.8rem', md: '4.75rem' },
                  fontWeight: 900,
                  lineHeight: 1.08,
                  letterSpacing: '-0.03em',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  mb: 3,
                }}
              >
                <Box component="span" sx={{ color: '#ffffff', display: 'block' }}>
                  Smarter Detection.
                </Box>
                <Box
                  component="span"
                  sx={{
                    background: 'linear-gradient(135deg, #38bdf8 0%, #60a5fa 60%, #38bdf8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'block',
                    textShadow: '0 0 40px rgba(56, 189, 248, 0.3)',
                  }}
                >
                  Stronger Security.
                </Box>
              </Typography>

              {/* Sub-headline */}
              <Typography
                sx={{
                  fontSize: { xs: '1rem', md: '1.14rem' },
                  color: '#94a3b8',
                  lineHeight: 1.65,
                  maxWidth: '530px',
                  mb: 4,
                }}
              >
                Fanos CyberSec uses AI-powered threat intelligence and advanced analysis to detect,
                prevent and respond to malicious activity — before it's too late.
              </Typography>

              {/* 3 Feature Micro-badges in a row */}
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: { xs: 2, sm: 3.5 },
                  mb: 4.5,
                }}
              >
                {/* 1: AI-Powered Threat Detection */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                  <MLIcon sx={{ fontSize: 28, color: '#38bdf8' }} />
                  <Typography sx={{ fontSize: '0.86rem', fontWeight: 600, color: '#cbd5e1', lineHeight: 1.3 }}>
                    AI-Powered<br />Threat Detection
                  </Typography>
                </Box>

                {/* 2: Real-time Monitoring */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                  <TimelineIcon sx={{ fontSize: 28, color: '#2dd4bf' }} />
                  <Typography sx={{ fontSize: '0.86rem', fontWeight: 600, color: '#cbd5e1', lineHeight: 1.3 }}>
                    Real-time<br />Monitoring
                  </Typography>
                </Box>

                {/* 3: Malicious URL Analysis */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                  <LinkIcon sx={{ fontSize: 28, color: '#c084fc' }} />
                  <Typography sx={{ fontSize: '0.86rem', fontWeight: 600, color: '#cbd5e1', lineHeight: 1.3 }}>
                    Malicious URL<br />Analysis
                  </Typography>
                </Box>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  onClick={() => navigate('/login?mode=signup')}
                  endIcon={<ArrowForwardIcon sx={{ fontSize: '18px !important' }} />}
                  sx={{
                    background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 60%, #38bdf8 100%)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.98rem',
                    textTransform: 'none',
                    px: { xs: 3, sm: 3.8 },
                    py: 1.35,
                    borderRadius: '28px',
                    boxShadow: '0 4px 20px rgba(14, 165, 233, 0.45)',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0369a1 0%, #0284c7 60%, #0ea5e9 100%)',
                      boxShadow: '0 6px 28px rgba(14, 165, 233, 0.7)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Get Started Free
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => {
                    const el = document.getElementById('scanner-showcase')
                    if (el) el.scrollIntoView({ behavior: 'smooth' })
                  }}
                  startIcon={<PlayArrowIcon sx={{ fontSize: '20px !important', color: '#ffffff' }} />}
                  sx={{
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    borderColor: 'rgba(148, 163, 184, 0.3)',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    textTransform: 'none',
                    px: { xs: 2.5, sm: 3.2 },
                    py: 1.3,
                    borderRadius: '28px',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(30, 41, 59, 0.95)',
                      borderColor: 'rgba(56, 189, 248, 0.5)',
                      color: '#38bdf8',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Watch Demo
                </Button>
              </Box>
            </Grid>

            {/* Right Column: Holographic 3D Cyber Globe & Glass HUD Badges */}
            <Grid item xs={12} lg={6}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '620px',
                  margin: '0 auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: { xs: '380px', sm: '480px', md: '540px' },
                }}
              >
                {/* 3D Holographic Globe Centerpiece Image */}
                <Box
                  component="img"
                  src="/assets/cyber_globe_hologram.jpg"
                  alt="Fanos CyberSec 3D Holographic Globe with Shield and Padlock"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: { xs: '380px', sm: '480px', md: '520px' },
                    objectFit: 'contain',
                    borderRadius: '20px',
                    filter: 'drop-shadow(0 0 35px rgba(14, 165, 233, 0.35))',
                    zIndex: 1,
                  }}
                />

                {/* Overlaid HUD Badge 1: Threats Blocked (Top Left) */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: { xs: '2%', sm: '6%' },
                    left: { xs: '0%', sm: '3%' },
                    backgroundColor: 'rgba(8, 14, 28, 0.88)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(56, 189, 248, 0.35)',
                    borderRadius: '12px',
                    p: 1.8,
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.7), 0 0 20px rgba(56, 189, 248, 0.15)',
                    zIndex: 3,
                    minWidth: { xs: '140px', sm: '165px' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.9, mb: 0.6 }}>
                    <Box
                      sx={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        backgroundColor: '#10b981',
                        boxShadow: '0 0 8px #10b981',
                      }}
                    />
                    <Typography sx={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 600 }}>
                      Threats Blocked
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 0.5 }}>
                    <Typography sx={{ fontSize: { xs: '1.25rem', sm: '1.45rem' }, fontWeight: 800, color: '#ffffff' }}>
                      12,493
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: '#10b981',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      ↑ 24%
                    </Typography>
                  </Box>
                  {/* Glowing green sparkline */}
                  <svg width="100%" height="22" viewBox="0 0 120 22" fill="none">
                    <path
                      d="M0 16 Q 20 20, 35 12 T 70 14 T 95 6 T 120 4"
                      stroke="#10b981"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </Box>

                {/* Overlaid HUD Badge 2: Live Analysis (Top Right) */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: { xs: '6%', sm: '10%' },
                    right: { xs: '0%', sm: '2%' },
                    backgroundColor: 'rgba(8, 14, 28, 0.88)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(56, 189, 248, 0.35)',
                    borderRadius: '12px',
                    p: 1.8,
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.7), 0 0 20px rgba(56, 189, 248, 0.15)',
                    zIndex: 3,
                    minWidth: { xs: '150px', sm: '180px' },
                    display: { xs: 'none', sm: 'block' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.9, mb: 0.4 }}>
                    <Box
                      sx={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        backgroundColor: '#38bdf8',
                        boxShadow: '0 0 8px #38bdf8',
                      }}
                    />
                    <Typography sx={{ fontSize: '0.78rem', color: '#e2e8f0', fontWeight: 600 }}>
                      Live Analysis
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: '0.72rem', color: '#94a3b8', mb: 0.8 }}>
                    Analyzing network traffic...
                  </Typography>
                  {/* Glowing blue undulating wave */}
                  <svg width="100%" height="22" viewBox="0 0 120 22" fill="none">
                    <path
                      d="M0 13 Q 22 3, 45 16 T 85 6 T 120 12"
                      stroke="#38bdf8"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </Box>

                {/* Overlaid HUD Badge 3: Malicious Activity Blocked (Middle Right) */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: { xs: '58%', sm: '52%' },
                    right: { xs: '0%', sm: '1%' },
                    backgroundColor: 'rgba(24, 10, 20, 0.9)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(244, 63, 94, 0.45)',
                    borderRadius: '12px',
                    py: 1.3,
                    px: 1.8,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.3,
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.75), 0 0 22px rgba(244, 63, 94, 0.25)',
                    zIndex: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: 34,
                      height: 34,
                      borderRadius: '8px',
                      backgroundColor: 'rgba(244, 63, 94, 0.15)',
                      border: '1px solid rgba(244, 63, 94, 0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#f43f5e',
                      flexShrink: 0,
                    }}
                  >
                    <DangerousIcon sx={{ fontSize: 20 }} />
                  </Box>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#fda4af', lineHeight: 1.25 }}>
                    Malicious Activity<br />Blocked
                  </Typography>
                </Box>

                {/* Overlaid HUD Badge 4: Security Checklist (Middle Left) */}
                {/* USER EXPLICIT REQUIREMENT: "BUT REMOVE THE SURICATA IDS FROM THIS IMAGE" */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: { xs: '48%', sm: '46%' },
                    left: { xs: '0%', sm: '2%' },
                    backgroundColor: 'rgba(8, 14, 28, 0.9)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(56, 189, 248, 0.35)',
                    borderRadius: '12px',
                    p: 1.8,
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.75), 0 0 22px rgba(56, 189, 248, 0.2)',
                    zIndex: 3,
                    minWidth: { xs: '155px', sm: '185px' },
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                    {/* Item 1: AI Detector */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MemoryIcon sx={{ fontSize: 17, color: '#38bdf8' }} />
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#f1f5f9' }}>
                          AI Detector
                        </Typography>
                      </Box>
                      <CheckCircleIcon sx={{ fontSize: 16, color: '#10b981' }} />
                    </Box>

                    {/* Item 2: URL Analyzer */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinkIcon sx={{ fontSize: 17, color: '#38bdf8' }} />
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#f1f5f9' }}>
                          URL Analyzer
                        </Typography>
                      </Box>
                      <CheckCircleIcon sx={{ fontSize: 16, color: '#10b981' }} />
                    </Box>

                    {/* Item 3: Report Generator */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DescriptionIcon sx={{ fontSize: 17, color: '#38bdf8' }} />
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#f1f5f9' }}>
                          Report Generator
                        </Typography>
                      </Box>
                      <CheckCircleIcon sx={{ fontSize: 16, color: '#10b981' }} />
                    </Box>

                    {/* Item 4: Threat Intelligence (Suricata IDS replaced cleanly) */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ShieldIcon sx={{ fontSize: 17, color: '#38bdf8' }} />
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#f1f5f9' }}>
                          Threat Intelligence
                        </Typography>
                      </Box>
                      <CheckCircleIcon sx={{ fontSize: 16, color: '#10b981' }} />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* =========================================================================
              BOTTOM ASYMMETRICAL STATS & INTELLIGENCE CONSOLE (EXACT REPLICA)
              ========================================================================= */}
          <Box
            sx={{
              mt: { xs: 5, md: 7 },
              borderRadius: '16px',
              backgroundColor: '#070c18',
              border: '1px solid rgba(56, 189, 248, 0.22)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.75), 0 0 25px rgba(56, 189, 248, 0.08)',
              overflow: 'hidden',
            }}
          >
            <Grid container alignItems="stretch">
              {/* Left Segment: 4 Telemetry Stats */}
              <Grid
                item
                xs={12}
                lg={7}
                sx={{
                  p: { xs: 2.5, sm: 3.5, md: 4 },
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Grid container spacing={3}>
                  {/* Stat 1: 99.9% Detection Accuracy */}
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <ShieldIcon sx={{ fontSize: 32, color: '#38bdf8' }} />
                      <Box>
                        <Typography sx={{ fontSize: { xs: '1.25rem', sm: '1.55rem' }, fontWeight: 800, color: '#ffffff', lineHeight: 1.1 }}>
                          99.9%
                        </Typography>
                        <Typography sx={{ fontSize: '0.78rem', color: '#94a3b8', mt: 0.3 }}>
                          Detection Accuracy
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Stat 2: < 1s Real-time Response */}
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <FlashIcon sx={{ fontSize: 32, color: '#38bdf8' }} />
                      <Box>
                        <Typography sx={{ fontSize: { xs: '1.25rem', sm: '1.55rem' }, fontWeight: 800, color: '#ffffff', lineHeight: 1.1 }}>
                          &lt; 1s
                        </Typography>
                        <Typography sx={{ fontSize: '0.78rem', color: '#94a3b8', mt: 0.3 }}>
                          Real-time Response
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Stat 3: 24/7 Threat Monitoring */}
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <GlobeIcon sx={{ fontSize: 32, color: '#38bdf8' }} />
                      <Box>
                        <Typography sx={{ fontSize: { xs: '1.25rem', sm: '1.55rem' }, fontWeight: 800, color: '#ffffff', lineHeight: 1.1 }}>
                          24/7
                        </Typography>
                        <Typography sx={{ fontSize: '0.78rem', color: '#94a3b8', mt: 0.3 }}>
                          Threat Monitoring
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Stat 4: 100% Secure & Private */}
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <StorageIcon sx={{ fontSize: 32, color: '#38bdf8' }} />
                      <Box>
                        <Typography sx={{ fontSize: { xs: '1.25rem', sm: '1.55rem' }, fontWeight: 800, color: '#ffffff', lineHeight: 1.1 }}>
                          100%
                        </Typography>
                        <Typography sx={{ fontSize: '0.78rem', color: '#94a3b8', mt: 0.3 }}>
                          Secure &amp; Private
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>

              {/* Right Segment: Elevated Cyber Intelligence Panel with Glowing Divider */}
              <Grid
                item
                xs={12}
                lg={5}
                sx={{
                  p: { xs: 3, sm: 3.5, md: 4 },
                  backgroundColor: 'rgba(11, 22, 44, 0.75)',
                  backgroundImage:
                    'linear-gradient(135deg, rgba(14, 165, 233, 0.12) 0%, rgba(8, 14, 28, 0.9) 100%)',
                  borderLeft: { lg: '2px solid #38bdf8' },
                  borderTop: { xs: '1px solid rgba(56, 189, 248, 0.25)', lg: 'none' },
                  boxShadow: { lg: '-8px 0 25px rgba(56, 189, 248, 0.25)' },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Box sx={{ width: 18, height: 2, backgroundColor: '#38bdf8' }} />
                  <Typography
                    sx={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      letterSpacing: '0.12em',
                      color: '#38bdf8',
                      textTransform: 'uppercase',
                    }}
                  >
                    BUILT FOR A SAFER DIGITAL WORLD
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontSize: { xs: '1.15rem', md: '1.3rem' },
                    fontWeight: 800,
                    color: '#ffffff',
                    lineHeight: 1.3,
                    mb: 1,
                  }}
                >
                  Advanced Threat Intelligence for Modern Businesses
                </Typography>
                <Typography sx={{ fontSize: '0.86rem', color: '#94a3b8', lineHeight: 1.55 }}>
                  From network analysis to AI-driven detection, Fanos CyberSec helps you stay one step ahead of cyber threats.
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* =========================================================================
          SECTION 2: ABOUT / THE FANOS AI ARCHITECTURE (MODERN CYBERSEC REPLICA)
          ========================================================================= */}
      <Box
        id="about"
        sx={{
          py: { xs: 8, md: 12 },
          backgroundColor: '#060b17',
          backgroundImage:
            'radial-gradient(ellipse 80% 50% at 50% 20%, rgba(14, 165, 233, 0.1), transparent 75%)',
          borderTop: '1px solid rgba(56, 189, 248, 0.15)',
          position: 'relative',
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2.5, sm: 4, md: 6 } }}>
          {/* Section Heading */}
          <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 7 } }}>
            <Chip
              icon={<MLIcon sx={{ fontSize: '16px !important', color: '#38bdf8 !important' }} />}
              label="CYBER THREAT INTELLIGENCE & ARCHITECTURE"
              size="small"
              sx={{
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                fontWeight: 700,
                fontSize: '0.78rem',
                letterSpacing: '0.08em',
                mb: 2,
                px: 1,
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2.2rem', sm: '2.9rem', md: '3.4rem' },
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1.15,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                letterSpacing: '-0.02em',
                mb: 2,
              }}
            >
              Why{' '}
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(135deg, #38bdf8 0%, #60a5fa 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 35px rgba(56, 189, 248, 0.3)',
                }}
              >
                Fanos
              </Box>
              ? Illuminating What Others Miss.
            </Typography>
            <Typography
              sx={{
                color: '#94a3b8',
                fontSize: { xs: '0.98rem', md: '1.08rem' },
                maxWidth: '820px',
                margin: '0 auto',
                lineHeight: 1.7,
              }}
            >
              In classical etymology, <strong>Fanos (ፋኖስ)</strong> represents the guiding lantern—an
              inextinguishable light cast into deep obscurity. In contemporary cyber warfare,
              adversaries conceal zero-day exploits behind multi-tier redirects, Punycode tricks, and
              ephemeral credential harvesting portals.
            </Typography>
          </Box>

          {/* 2-Column Core Architecture Showcase */}
          <Grid container spacing={{ xs: 4, lg: 6 }} alignItems="center" sx={{ mb: 7 }}>
            {/* Left Column: Holographic AI Threat Detection Engine Visual */}
            <Grid item xs={12} lg={6}>
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(14, 165, 233, 0.25)',
                  backgroundColor: '#070d1a',
                }}
              >
                {/* 3D Generated AI Neural Network Threat Graphic */}
                <Box
                  component="img"
                  src="/assets/about_ai_neural_threat.jpg"
                  alt="Fanos AI Neural Threat Detection Engine"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    objectFit: 'cover',
                    maxHeight: '440px',
                    transition: 'transform 0.5s ease',
                    '&:hover': {
                      transform: 'scale(1.02)',
                    },
                  }}
                />

                {/* Glass HUD Overlay Badges */}
                {/* Badge 1: < 35ms Feature Extraction */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '5%',
                    left: '4%',
                    backgroundColor: 'rgba(8, 14, 28, 0.88)',
                    backdropFilter: 'blur(14px)',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    borderRadius: '10px',
                    py: 1,
                    px: 1.8,
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.6)',
                  }}
                >
                  <Typography sx={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>
                    Inference Speed
                  </Typography>
                  <Typography sx={{ fontSize: '1.05rem', fontWeight: 800, color: '#38bdf8' }}>
                    &lt; 35ms Feature Extraction
                  </Typography>
                </Box>

                {/* Badge 2: 99.9% Model Accuracy */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '5%',
                    right: '4%',
                    backgroundColor: 'rgba(8, 14, 28, 0.88)',
                    backdropFilter: 'blur(14px)',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    borderRadius: '10px',
                    py: 1,
                    px: 1.8,
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.6)',
                    display: { xs: 'none', sm: 'block' },
                  }}
                >
                  <Typography sx={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>
                    Precision Metric
                  </Typography>
                  <Typography sx={{ fontSize: '1.05rem', fontWeight: 800, color: '#10b981' }}>
                    99.9% Detection Accuracy
                  </Typography>
                </Box>

                {/* Badge 3: Autonomous AI Core */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: '6%',
                    left: '4%',
                    backgroundColor: 'rgba(8, 14, 28, 0.88)',
                    backdropFilter: 'blur(14px)',
                    border: '1px solid rgba(56, 189, 248, 0.35)',
                    borderRadius: '10px',
                    py: 1,
                    px: 1.8,
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.6)',
                  }}
                >
                  <Typography sx={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>
                    Core Intelligence
                  </Typography>
                  <Typography sx={{ fontSize: '0.98rem', fontWeight: 800, color: '#f1f5f9' }}>
                    Autonomous AI Threat Engine
                  </Typography>
                </Box>

                {/* Badge 4: Behavioral Analysis */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: '6%',
                    right: '4%',
                    backgroundColor: 'rgba(8, 14, 28, 0.88)',
                    backdropFilter: 'blur(14px)',
                    border: '1px solid rgba(56, 189, 248, 0.35)',
                    borderRadius: '10px',
                    py: 1,
                    px: 1.8,
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.6)',
                    display: { xs: 'none', sm: 'block' },
                  }}
                >
                  <Typography sx={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>
                    Threat Heuristics
                  </Typography>
                  <Typography sx={{ fontSize: '0.98rem', fontWeight: 800, color: '#38bdf8' }}>
                    Multi-Vector Defense
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Right Column: Clean, Modern AI Security Architecture Panel */}
            <Grid item xs={12} lg={6}>
              <Box
                sx={{
                  backgroundColor: '#091022',
                  borderRadius: '20px',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  p: { xs: 3, sm: 4 },
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 25px rgba(56, 189, 248, 0.08)',
                }}
              >
                {/* Console Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: '8px',
                        backgroundColor: 'rgba(56, 189, 248, 0.1)',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                      }}
                    >
                      <ShieldIcon sx={{ color: '#38bdf8', fontSize: 22 }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 800, fontSize: '1.2rem', color: '#ffffff' }}>
                        Next-Gen Threat Architecture
                      </Typography>
                      <Typography sx={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                        Autonomous Zero-Latency URL &amp; Domain Security Engine
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    size="small"
                    label="ONLINE"
                    sx={{
                      backgroundColor: 'rgba(16, 185, 129, 0.15)',
                      color: '#10b981',
                      border: '1px solid rgba(16, 185, 129, 0.35)',
                      fontWeight: 700,
                      fontSize: '0.72rem',
                    }}
                  />
                </Box>

                <Typography sx={{ color: '#94a3b8', fontSize: '0.88rem', mb: 3, lineHeight: 1.6 }}>
                  Fanos combines predictive artificial intelligence, behavioral heuristics, and global threat intelligence to stop advanced web threats in milliseconds:
                </Typography>

                {/* 4 Clean Enterprise Capability Cards */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {/* Capability 1: Domain Forensics */}
                  <Grid item xs={12} sm={6}>
                    <Box
                      sx={{
                        p: 2,
                        height: '100%',
                        backgroundColor: '#0c152a',
                        borderRadius: '12px',
                        border: '1px solid rgba(56, 189, 248, 0.2)',
                        transition: 'all 0.25s ease',
                        '&:hover': {
                          borderColor: '#38bdf8',
                          boxShadow: '0 8px 20px rgba(56, 189, 248, 0.12)',
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8 }}>
                        <LinkIcon sx={{ color: '#38bdf8', fontSize: 18 }} />
                        <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>
                          URL &amp; Domain Forensics
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.55 }}>
                        Inspects redirection chains, homograph attacks, and deceptive typosquatting disguises instantly.
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Capability 2: Autonomous AI Classification */}
                  <Grid item xs={12} sm={6}>
                    <Box
                      sx={{
                        p: 2,
                        height: '100%',
                        backgroundColor: '#0c152a',
                        borderRadius: '12px',
                        border: '1px solid rgba(56, 189, 248, 0.2)',
                        transition: 'all 0.25s ease',
                        '&:hover': {
                          borderColor: '#38bdf8',
                          boxShadow: '0 8px 20px rgba(56, 189, 248, 0.12)',
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8 }}>
                        <MLIcon sx={{ color: '#38bdf8', fontSize: 18 }} />
                        <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>
                          Adaptive AI Engine
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.55 }}>
                        High-throughput neural models analyzing lexical patterns and zero-day threat vectors with 99.9% accuracy.
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Capability 3: Global Threat Feeds */}
                  <Grid item xs={12} sm={6}>
                    <Box
                      sx={{
                        p: 2,
                        height: '100%',
                        backgroundColor: '#0c152a',
                        borderRadius: '12px',
                        border: '1px solid rgba(56, 189, 248, 0.2)',
                        transition: 'all 0.25s ease',
                        '&:hover': {
                          borderColor: '#38bdf8',
                          boxShadow: '0 8px 20px rgba(56, 189, 248, 0.12)',
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8 }}>
                        <GlobeIcon sx={{ color: '#38bdf8', fontSize: 18 }} />
                        <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>
                          70+ Security Feeds
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.55 }}>
                        Continuous threat correlation with global antivirus networks and real-time blacklists.
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Capability 4: Instant Automated Response */}
                  <Grid item xs={12} sm={6}>
                    <Box
                      sx={{
                        p: 2,
                        height: '100%',
                        backgroundColor: '#0c152a',
                        borderRadius: '12px',
                        border: '1px solid rgba(56, 189, 248, 0.2)',
                        transition: 'all 0.25s ease',
                        '&:hover': {
                          borderColor: '#38bdf8',
                          boxShadow: '0 8px 20px rgba(56, 189, 248, 0.12)',
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8 }}>
                        <FlashIcon sx={{ color: '#38bdf8', fontSize: 18 }} />
                        <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>
                          Automated Defense
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.55 }}>
                        Instant policy enforcement, automated quarantine alerts, and immediate dispatch to SOC &amp; Telegram.
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                {/* Speed & Protection Status Footer */}
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: 'rgba(56, 189, 248, 0.08)',
                    borderRadius: '10px',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography sx={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                      Inference Latency:
                    </Typography>
                    <Typography sx={{ fontSize: '1.05rem', fontWeight: 800, color: '#38bdf8' }}>
                      &lt; 35ms Real-Time
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography sx={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                      Detection Core:
                    </Typography>
                    <Typography sx={{ fontSize: '1.05rem', fontWeight: 800, color: '#10b981' }}>
                      Autonomous AI Active
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* =========================================================================
              THE 4 THREAT CLASSIFICATION PILLARS (INTERACTIVE CARDS)
              ========================================================================= */}
          <Box sx={{ mt: 5 }}>
            <Typography
              sx={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#ffffff',
                mb: 3,
                textAlign: 'center',
                letterSpacing: '-0.01em',
              }}
            >
              Multi-Class Automated Classification Pillars
            </Typography>

            <Grid container spacing={3}>
              {/* Pillar 1: Benign Traffic */}
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    height: '100%',
                    backgroundColor: '#091022',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    borderRadius: '16px',
                    p: 2.5,
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6), 0 0 15px rgba(16, 185, 129, 0.08)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#10b981',
                      transform: 'translateY(-4px)',
                      boxShadow: '0 16px 40px rgba(0, 0, 0, 0.75), 0 0 25px rgba(16, 185, 129, 0.2)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Chip
                      size="small"
                      label="SAFE"
                      sx={{
                        backgroundColor: 'rgba(16, 185, 129, 0.15)',
                        color: '#34d399',
                        fontWeight: 800,
                        fontSize: '0.7rem',
                      }}
                    />
                    <CheckCircleIcon sx={{ color: '#10b981', fontSize: 22 }} />
                  </Box>
                  <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#ffffff', mb: 1 }}>
                    01. Benign Traffic
                  </Typography>
                  <Typography sx={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.55 }}>
                    Authentic domain hierarchies, validated Extended Validation SSL certificates, and 0/70 clean VirusTotal reputation scores.
                  </Typography>
                </Card>
              </Grid>

              {/* Pillar 2: Phishing Vectors */}
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    height: '100%',
                    backgroundColor: '#091022',
                    border: '1px solid rgba(251, 191, 36, 0.25)',
                    borderRadius: '16px',
                    p: 2.5,
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6), 0 0 15px rgba(251, 191, 36, 0.08)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#fbbf24',
                      transform: 'translateY(-4px)',
                      boxShadow: '0 16px 40px rgba(0, 0, 0, 0.75), 0 0 25px rgba(251, 191, 36, 0.2)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Chip
                      size="small"
                      label="PHISHING"
                      sx={{
                        backgroundColor: 'rgba(251, 191, 36, 0.15)',
                        color: '#fbbf24',
                        fontWeight: 800,
                        fontSize: '0.7rem',
                      }}
                    />
                    <WarningIcon sx={{ color: '#fbbf24', fontSize: 22 }} />
                  </Box>
                  <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#ffffff', mb: 1 }}>
                    02. Phishing Vectors
                  </Typography>
                  <Typography sx={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.55 }}>
                    Credential harvesting portals, typosquatting domains mimicking financial institutions, and fake authentication portals.
                  </Typography>
                </Card>
              </Grid>

              {/* Pillar 3: Malicious Payloads */}
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    height: '100%',
                    backgroundColor: '#091022',
                    border: '1px solid rgba(244, 63, 94, 0.25)',
                    borderRadius: '16px',
                    p: 2.5,
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6), 0 0 15px rgba(244, 63, 94, 0.08)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#f43f5e',
                      transform: 'translateY(-4px)',
                      boxShadow: '0 16px 40px rgba(0, 0, 0, 0.75), 0 0 25px rgba(244, 63, 94, 0.2)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Chip
                      size="small"
                      label="MALWARE"
                      sx={{
                        backgroundColor: 'rgba(244, 63, 94, 0.15)',
                        color: '#fda4af',
                        fontWeight: 800,
                        fontSize: '0.7rem',
                      }}
                    />
                    <DangerousIcon sx={{ color: '#f43f5e', fontSize: 22 }} />
                  </Box>
                  <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#ffffff', mb: 1 }}>
                    03. Malicious Payloads
                  </Typography>
                  <Typography sx={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.55 }}>
                    Drive-by droppers, ransomware C2 command &amp; control beacons, trojan binaries, and direct-to-IP payload hosts.
                  </Typography>
                </Card>
              </Grid>

              {/* Pillar 4: Web Defacement */}
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    height: '100%',
                    backgroundColor: '#091022',
                    border: '1px solid rgba(168, 85, 247, 0.25)',
                    borderRadius: '16px',
                    p: 2.5,
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6), 0 0 15px rgba(168, 85, 247, 0.08)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#a855f7',
                      transform: 'translateY(-4px)',
                      boxShadow: '0 16px 40px rgba(0, 0, 0, 0.75), 0 0 25px rgba(168, 85, 247, 0.2)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Chip
                      size="small"
                      label="DEFACEMENT"
                      sx={{
                        backgroundColor: 'rgba(168, 85, 247, 0.15)',
                        color: '#c084fc',
                        fontWeight: 800,
                        fontSize: '0.7rem',
                      }}
                    />
                    <CodeIcon sx={{ color: '#a855f7', fontSize: 22 }} />
                  </Box>
                  <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#ffffff', mb: 1 }}>
                    04. Web Defacement
                  </Typography>
                  <Typography sx={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.55 }}>
                    Unauthorized hacktivist takeover tags, server DOM content overrides, ideological spray, and hijacked DNS redirect pages.
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* =========================================================================
          SECTION 3: VULNERABILITY SCANNER SHOWCASE & INTERACTIVE THREAT SIMULATOR
          ========================================================================= */}
      <Box
        id="scanner-showcase"
        sx={{
          py: { xs: 8, md: 12 },
          backgroundColor: '#0a0f1d',
          position: 'relative',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Chip
              label="SCANNER ARCHITECTURE & PIPELINE"
              size="small"
              sx={{
                backgroundColor: 'rgba(56, 189, 248, 0.12)',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                fontWeight: 700,
                fontSize: '0.75rem',
                letterSpacing: '0.08em',
                mb: 2,
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.8rem', md: '2.6rem' },
                fontWeight: 800,
                color: '#ffffff',
                mb: 1.5,
              }}
            >
              How the Fanos Vulnerability Scanner Operates
            </Typography>
            <Typography
              sx={{
                color: '#94a3b8',
                fontSize: '1rem',
                maxWidth: '750px',
                margin: '0 auto',
                lineHeight: 1.6,
              }}
            >
              Learn how our multi-stage inspection pipeline identifies threats before execution.
              To launch live scans against active URLs, please sign in to the analyst terminal.
            </Typography>
          </Box>

          {/* 4-Step Pipeline Flow with Connected Cyan Accents */}
          <Grid container spacing={3} sx={{ mb: 7, position: 'relative' }}>
            {[
              {
                step: '01',
                title: 'URL Ingestion & Forensic Normalization',
                desc: 'Parses protocol schemes, analyzes structural domain patterns, and isolates obfuscated tokens in milliseconds.',
                icon: <CodeIcon sx={{ color: '#38bdf8', fontSize: 24 }} />,
              },
              {
                step: '02',
                title: 'Autonomous AI Threat Classification',
                desc: 'Evaluates structural indicators and behavioral threat heuristics using our multi-vector AI detection engine.',
                icon: <MLIcon sx={{ color: '#38bdf8', fontSize: 24 }} />,
              },
              {
                step: '03',
                title: 'Global Threat Intelligence Correlation',
                desc: 'Cross-references instant telemetry from 70+ global security vendors and caches intelligence in ultra-fast secure memory.',
                icon: <ShieldIcon sx={{ color: '#38bdf8', fontSize: 24 }} />,
              },
              {
                step: '04',
                title: 'Immutable Threat Ledger & Alert Dispatch',
                desc: 'Audits verdicts with cryptographic timestamps and triggers immediate quarantine alerts to SOC teams and Telegram.',
                icon: <StorageIcon sx={{ color: '#38bdf8', fontSize: 24 }} />,
              },
            ].map((p) => (
              <Grid item xs={12} sm={6} md={3} key={p.step}>
                <Box
                  sx={{
                    p: 3,
                    height: '100%',
                    backgroundColor: '#091022',
                    border: '1px solid rgba(56, 189, 248, 0.22)',
                    borderRadius: '16px',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4), 0 0 15px rgba(56, 189, 248, 0.05)',
                    '&:hover': {
                      borderColor: '#38bdf8',
                      boxShadow: '0 20px 45px rgba(0, 0, 0, 0.7), 0 0 30px rgba(56, 189, 248, 0.25)',
                      transform: 'translateY(-6px)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2.5,
                    }}
                  >
                    <Box
                      sx={{
                        px: 1.4,
                        py: 0.35,
                        borderRadius: '20px',
                        backgroundColor: 'rgba(56, 189, 248, 0.12)',
                        border: '1px solid rgba(56, 189, 248, 0.35)',
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '0.82rem',
                          fontWeight: 900,
                          color: '#38bdf8',
                          fontFamily: 'monospace',
                        }}
                      >
                        STEP {p.step}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        p: 1.2,
                        borderRadius: '10px',
                        backgroundColor: 'rgba(56, 189, 248, 0.08)',
                        border: '1px solid rgba(56, 189, 248, 0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {p.icon}
                    </Box>
                  </Box>
                  <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#ffffff', mb: 1.2 }}>
                    {p.title}
                  </Typography>
                  <Typography sx={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.6 }}>
                    {p.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Interactive Threat Simulator (Showcase) */}
          <Box
            sx={{
              backgroundColor: '#091022',
              borderRadius: '20px',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              p: { xs: 3, md: 4.5 },
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 25px rgba(56, 189, 248, 0.08)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', md: 'center' },
                gap: 2,
                mb: 3.5,
              }}
            >
              <Box>
                <Typography sx={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>
                  Interactive Threat Simulation Studio
                </Typography>
                <Typography sx={{ fontSize: '0.86rem', color: '#94a3b8' }}>
                  Select a threat vector below to preview real-time forensic decomposition:
                </Typography>
              </Box>

              {/* Selector Tabs */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.2 }}>
                {Object.keys(demoScenarios).map((key) => {
                  const item = demoScenarios[key]
                  const isSelected = selectedDemo === key
                  return (
                    <Button
                      key={key}
                      size="small"
                      onClick={() => setSelectedDemo(key)}
                      variant={isSelected ? 'contained' : 'outlined'}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '0.84rem',
                        px: 2.2,
                        py: 0.7,
                        borderRadius: '20px',
                        backgroundColor: isSelected ? item.color : 'rgba(15, 23, 42, 0.65)',
                        borderColor: isSelected ? item.color : 'rgba(255, 255, 255, 0.15)',
                        color: isSelected ? '#030712' : '#f8fafc',
                        boxShadow: isSelected ? `0 0 16px ${item.color}66` : 'none',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: item.color,
                          color: '#030712',
                          boxShadow: `0 0 20px ${item.color}88`,
                        },
                      }}
                    >
                      {item.type}
                    </Button>
                  )
                })}
              </Box>
            </Box>

            {/* Simulated Output Display */}
            {(() => {
              const current = demoScenarios[selectedDemo]
              return (
                <Box
                  sx={{
                    p: 3,
                    borderRadius: '12px',
                    backgroundColor: '#080d19',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  {/* Sample URL Bar */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 1.5,
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      border: '1px solid rgba(56, 189, 248, 0.2)',
                      mb: 3,
                      overflowX: 'auto',
                    }}
                  >
                    <Chip
                      label="SAMPLE TARGET"
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(56, 189, 248, 0.15)',
                        color: '#38bdf8',
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        mr: 1.5,
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      sx={{
                        fontFamily: 'monospace',
                        fontSize: '0.9rem',
                        color: '#f8fafc',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {current.url}
                    </Typography>
                  </Box>

                  {/* Verdict & Metrics Grid */}
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={4}>
                      <Box
                        sx={{
                          p: 2,
                          backgroundColor: '#0c1527',
                          borderRadius: '8px',
                          borderLeft: `4px solid ${current.color}`,
                        }}
                      >
                        <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>
                          Model Final Verdict
                        </Typography>
                        <Typography sx={{ fontSize: '1.2rem', fontWeight: 800, color: current.color }}>
                          {current.type}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Box
                        sx={{
                          p: 2,
                          backgroundColor: '#0c1527',
                          borderRadius: '8px',
                          borderLeft: '4px solid #38bdf8',
                        }}
                      >
                        <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>
                          Risk Probability Score
                        </Typography>
                        <Typography sx={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8' }}>
                          {current.risk}% Confidence
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Box
                        sx={{
                          p: 2,
                          backgroundColor: '#0c1527',
                          borderRadius: '8px',
                          borderLeft: '4px solid #818cf8',
                        }}
                      >
                        <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>
                          Heuristic Structural Depth
                        </Typography>
                        <Typography sx={{ fontSize: '1.2rem', fontWeight: 800, color: '#818cf8' }}>
                          {current.features.entropy} bits / {current.features.subdomains} levels
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Indicators List */}
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#cbd5e1', mb: 1.5 }}>
                    Extracted Behavioral Indicators:
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {current.indicators.map((ind, i) => (
                      <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ArrowForwardIcon sx={{ fontSize: 14, color: current.color }} />
                        <Typography sx={{ fontSize: '0.84rem', color: '#94a3b8' }}>
                          {ind}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )
            })()}

            {/* Callout: Live Scanner Protected by Login */}
            <Box
              sx={{
                mt: 4,
                p: { xs: 2.5, sm: 3 },
                borderRadius: '12px',
                backgroundColor: 'rgba(14, 165, 233, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                justifyContent: 'space-between',
                gap: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LockIcon sx={{ color: '#38bdf8', fontSize: 32 }} />
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>
                    Live URL Vulnerability Scanner Console
                  </Typography>
                  <Typography sx={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                    Live domain audits, raw HTML inspection, and CSV threat ledger exports are
                    available upon analyst sign-in.
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1.5, width: { xs: '100%', sm: 'auto' } }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/login')}
                  sx={{
                    color: '#ffffff',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    fontSize: '0.85rem',
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Sign In
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate('/login')}
                  sx={{
                    background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    textTransform: 'none',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    boxShadow: '0 4px 14px rgba(14, 165, 233, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0369a1 0%, #0284c7 100%)',
                    },
                  }}
                >
                  Launch Live Scanner
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* =========================================================================
          SECTION 4: LIVE THREAT TELEMETRY & SYSTEM STATISTICS
          ========================================================================= */}
      <Box
        id="stats"
        sx={{
          py: { xs: 8, md: 10 },
          backgroundColor: '#080d19',
          borderTop: '1px solid rgba(56, 189, 248, 0.1)',
          borderBottom: '1px solid rgba(56, 189, 248, 0.1)',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Chip
              label="REAL-TIME TELEMETRY"
              size="small"
              sx={{
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                color: '#10b981',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                fontWeight: 700,
                fontSize: '0.75rem',
                letterSpacing: '0.08em',
                mb: 2,
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.8rem', md: '2.5rem' },
                fontWeight: 800,
                color: '#ffffff',
                mb: 1.5,
              }}
            >
              Live Security Telemetry & Metrics
            </Typography>
            <Typography sx={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              Real-time threat intelligence streaming from our enterprise cloud security network
            </Typography>
          </Box>

          {/* Telemetry Counter Cards */}
          <Grid container spacing={3} sx={{ mb: 5 }}>
            <Grid item xs={6} md={3}>
              <Box
                sx={{
                  p: 3,
                  backgroundColor: '#0c1527',
                  borderRadius: '12px',
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  textAlign: 'center',
                }}
              >
                <Typography sx={{ fontSize: '2.4rem', fontWeight: 900, color: '#38bdf8', mb: 0.5 }}>
                  {stats.total_checked}+
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>
                  TOTAL URLS AUDITED
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6} md={3}>
              <Box
                sx={{
                  p: 3,
                  backgroundColor: '#0c1527',
                  borderRadius: '12px',
                  border: '1px solid rgba(244, 63, 94, 0.25)',
                  textAlign: 'center',
                }}
              >
                <Typography sx={{ fontSize: '2.4rem', fontWeight: 900, color: '#f43f5e', mb: 0.5 }}>
                  {stats.malicious_count}
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>
                  THREATS MITIGATED
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6} md={3}>
              <Box
                sx={{
                  p: 3,
                  backgroundColor: '#0c1527',
                  borderRadius: '12px',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  textAlign: 'center',
                }}
              >
                <Typography sx={{ fontSize: '2.4rem', fontWeight: 900, color: '#10b981', mb: 0.5 }}>
                  {stats.benign_count}
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>
                  VERIFIED BENIGN SAFE
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6} md={3}>
              <Box
                sx={{
                  p: 3,
                  backgroundColor: '#0c1527',
                  borderRadius: '12px',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  textAlign: 'center',
                }}
              >
                <Typography sx={{ fontSize: '2.4rem', fontWeight: 900, color: '#38bdf8', mb: 0.5 }}>
                  70+
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>
                  GLOBAL THREAT ENGINES
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* System Status Indicators Bar */}
          <Box
            sx={{
              p: 2.5,
              backgroundColor: '#0f172a',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-around',
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <Box
                className="status-pulse"
                sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#10b981' }}
              />
              <Typography sx={{ fontSize: '0.88rem', color: '#f8fafc', fontWeight: 600 }}>
                Security Cloud Core: <span style={{ color: '#10b981' }}>Operational &amp; Synced</span>
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <Box
                className="status-pulse"
                sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#38bdf8' }}
              />
              <Typography sx={{ fontSize: '0.88rem', color: '#f8fafc', fontWeight: 600 }}>
                AI Threat Engine: <span style={{ color: '#38bdf8' }}>Operational (99.9% Acc)</span>
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <Box
                className="status-pulse"
                sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#38bdf8' }}
              />
              <Typography sx={{ fontSize: '0.88rem', color: '#f8fafc', fontWeight: 600 }}>
                Telegram SecOps: <span style={{ color: '#38bdf8' }}>@URLDetector_Bot Ready</span>
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <SpeedIcon sx={{ fontSize: 18, color: '#38bdf8' }} />
              <Typography sx={{ fontSize: '0.88rem', color: '#94a3b8' }}>
                Classification Latency: <span style={{ color: '#ffffff', fontWeight: 700 }}>&lt; 35ms</span>
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* =========================================================================
          SECTION 5: INTEGRATIONS
          ========================================================================= */}
      <Box
        id="integrations"
        sx={{
          py: { xs: 8, md: 12 },
          backgroundColor: '#060b17',
          backgroundImage:
            'radial-gradient(ellipse 70% 40% at 50% 10%, rgba(14, 165, 233, 0.08), transparent 75%)',
          borderTop: '1px solid rgba(56, 189, 248, 0.15)',
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2.5, sm: 4, md: 6 } }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Chip
              icon={<HubIcon sx={{ fontSize: '16px !important', color: '#38bdf8 !important' }} />}
              label="CONNECTIVITY & ECOSYSTEM"
              size="small"
              sx={{
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                fontWeight: 700,
                fontSize: '0.75rem',
                letterSpacing: '0.08em',
                mb: 2,
                px: 1,
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '2.8rem' },
                fontWeight: 900,
                color: '#ffffff',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                letterSpacing: '-0.02em',
                mb: 1.5,
              }}
            >
              Enterprise-Ready Integrations
            </Typography>
            <Typography sx={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '680px', margin: '0 auto' }}>
              Seamlessly deploy Fanos CyberSec across chat platforms, REST microservices, and enterprise SecOps workflows
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* Telegram Bot */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  p: { xs: 3, sm: 4 },
                  backgroundColor: '#091022',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  borderRadius: '20px',
                  height: '100%',
                  boxShadow: '0 20px 45px rgba(0, 0, 0, 0.6), 0 0 20px rgba(56, 189, 248, 0.05)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#38bdf8',
                    transform: 'translateY(-4px)',
                    boxShadow: '0 25px 55px rgba(0, 0, 0, 0.75), 0 0 30px rgba(56, 189, 248, 0.2)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: '12px',
                      backgroundColor: 'rgba(56, 189, 248, 0.12)',
                      border: '1px solid rgba(56, 189, 248, 0.35)',
                      color: '#38bdf8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <BotIcon sx={{ fontSize: 32 }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 800, fontSize: '1.2rem', color: '#ffffff' }}>
                      Telegram CyberSec Bot (@URLDetector_Bot)
                    </Typography>
                    <Typography sx={{ fontSize: '0.82rem', color: '#38bdf8', fontWeight: 600 }}>
                      Mobile SecOps Assistant • Live 24/7
                    </Typography>
                  </Box>
                </Box>
                <Typography sx={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, mb: 3 }}>
                  Deploy instant URL diagnostics directly into Telegram groups, private chats, or automated channel monitors.
                </Typography>

                <Box
                  sx={{
                    p: 2.2,
                    backgroundColor: '#060a14',
                    borderRadius: '12px',
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    color: '#38bdf8',
                    mb: 3,
                    lineHeight: 1.7,
                  }}
                >
                  <div><span style={{ color: '#94a3b8' }}>$ </span>/scan https://suspicious-site.com/login</div>
                  <div><span style={{ color: '#94a3b8' }}>$ </span>/report phishing</div>
                  <div><span style={{ color: '#94a3b8' }}>$ </span>/stats</div>
                </Box>

                <Button
                  variant="outlined"
                  href="https://t.me/URLDetector_Bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    borderColor: 'rgba(56, 189, 248, 0.4)',
                    color: '#38bdf8',
                    textTransform: 'none',
                    fontWeight: 700,
                    borderRadius: '24px',
                    px: 3,
                    py: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(56, 189, 248, 0.12)',
                      borderColor: '#38bdf8',
                    },
                  }}
                >
                  Open in Telegram →
                </Button>
              </Card>
            </Grid>

            {/* RESTful API */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  p: { xs: 3, sm: 4 },
                  backgroundColor: '#091022',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  borderRadius: '20px',
                  height: '100%',
                  boxShadow: '0 20px 45px rgba(0, 0, 0, 0.6), 0 0 20px rgba(56, 189, 248, 0.05)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#38bdf8',
                    transform: 'translateY(-4px)',
                    boxShadow: '0 25px 55px rgba(0, 0, 0, 0.75), 0 0 30px rgba(56, 189, 248, 0.2)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: '12px',
                      backgroundColor: 'rgba(56, 189, 248, 0.12)',
                      border: '1px solid rgba(56, 189, 248, 0.35)',
                      color: '#38bdf8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <HubIcon sx={{ fontSize: 32 }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 800, fontSize: '1.2rem', color: '#ffffff' }}>
                      RESTful Threat API &amp; Webhooks
                    </Typography>
                    <Typography sx={{ fontSize: '0.82rem', color: '#38bdf8', fontWeight: 600 }}>
                      High-Throughput JSON Microservice
                    </Typography>
                  </Box>
                </Box>
                <Typography sx={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, mb: 3 }}>
                  Integrate automated vulnerability scanning directly into your CI/CD pipelines, email firewalls, or browser extensions with JSON schemas.
                </Typography>

                <Box
                  sx={{
                    p: 2.2,
                    backgroundColor: '#060a14',
                    borderRadius: '12px',
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    color: '#e2e8f0',
                    mb: 3,
                    lineHeight: 1.7,
                  }}
                >
                  <div><span style={{ color: '#38bdf8' }}>POST</span> /api/scan</div>
                  <div><span style={{ color: '#94a3b8' }}>Headers:</span> Authorization: Bearer &lt;TOKEN&gt;</div>
                  <div><span style={{ color: '#94a3b8' }}>Body:</span> &#123; "url": "https://example.com" &#125;</div>
                </Box>

                <Button
                  variant="contained"
                  onClick={() => navigate('/login?mode=signup')}
                  sx={{
                    background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)',
                    color: '#ffffff',
                    textTransform: 'none',
                    fontWeight: 700,
                    borderRadius: '24px',
                    px: 3,
                    py: 1,
                    boxShadow: '0 4px 18px rgba(14, 165, 233, 0.45)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0369a1 0%, #0284c7 100%)',
                      boxShadow: '0 6px 24px rgba(14, 165, 233, 0.65)',
                    },
                  }}
                >
                  Generate API Key →
                </Button>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* =========================================================================
          SECTION 6: PRICING & ACCESS TIERS
          ========================================================================= */}
      <Box
        id="pricing"
        sx={{
          py: { xs: 8, md: 12 },
          backgroundColor: '#080d19',
          borderTop: '1px solid rgba(56, 189, 248, 0.1)',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Chip
              label="ACCESS TIERS & PLANS"
              size="small"
              sx={{
                backgroundColor: 'rgba(56, 189, 248, 0.12)',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                fontWeight: 700,
                fontSize: '0.75rem',
                letterSpacing: '0.08em',
                mb: 2,
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.8rem', md: '2.5rem' },
                fontWeight: 800,
                color: '#ffffff',
                mb: 1.5,
              }}
            >
              Transparent Security Access
            </Typography>
            <Typography sx={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              Choose the tier that fits your individual analysis or enterprise SecOps requirements
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {/* Community Free */}
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  p: 4,
                  height: '100%',
                  backgroundColor: '#0c1527',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', mb: 1 }}>
                  Community Open Access
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: '#94a3b8', mb: 3 }}>
                  Ideal for personal safety and Telegram lookups
                </Typography>
                <Typography sx={{ fontSize: '2.2rem', fontWeight: 900, color: '#ffffff', mb: 3 }}>
                  $0{' '}
                  <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 400 }}>
                    / forever
                  </span>
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4, flexGrow: 1 }}>
                  {[
                    'Telegram Bot (@URLDetector_Bot) access',
                    'Autonomous AI Threat evaluation',
                    'Community threat feed updates',
                    'Standard scan queue',
                  ].map((feat) => (
                    <Box key={feat} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleIcon sx={{ fontSize: 16, color: '#10b981' }} />
                      <Typography sx={{ fontSize: '0.85rem', color: '#cbd5e1' }}>{feat}</Typography>
                    </Box>
                  ))}
                </Box>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate('/login?mode=signup')}
                  sx={{
                    color: '#ffffff',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Join Community Free
                </Button>
              </Box>
            </Grid>

            {/* Pro Security Analyst (Recommended) - Modern Electric Cyan Theme */}
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  p: 4,
                  height: '100%',
                  backgroundColor: '#0a1428',
                  backgroundImage:
                    'linear-gradient(180deg, rgba(14, 165, 233, 0.12) 0%, rgba(9, 16, 34, 0.95) 100%)',
                  borderRadius: '16px',
                  border: '2px solid #38bdf8',
                  boxShadow: '0 0 35px rgba(56, 189, 248, 0.3), 0 20px 50px rgba(0, 0, 0, 0.7)',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                }}
              >
                <Chip
                  label="MOST POPULAR"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: -12,
                    right: 24,
                    backgroundColor: '#38bdf8',
                    color: '#030712',
                    fontWeight: 800,
                    fontSize: '0.72rem',
                    boxShadow: '0 0 12px rgba(56, 189, 248, 0.8)',
                  }}
                />
                <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', mb: 1 }}>
                  Security Analyst (Pro)
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: '#94a3b8', mb: 3 }}>
                  For researchers, SOC triage teams &amp; webmasters
                </Typography>
                <Typography sx={{ fontSize: '2.2rem', fontWeight: 900, color: '#38bdf8', mb: 3 }}>
                  $49{' '}
                  <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 400 }}>
                    / analyst / mo
                  </span>
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4, flexGrow: 1 }}>
                  {[
                    'Full Live Vulnerability Scanner console',
                    'VirusTotal 70+ engine deep forensics',
                    'Dedicated immutable threat ledger',
                    'CSV & JSON forensic report exports',
                    'False positive appeal priority',
                  ].map((feat) => (
                    <Box key={feat} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleIcon sx={{ fontSize: 16, color: '#38bdf8' }} />
                      <Typography sx={{ fontSize: '0.85rem', color: '#ffffff' }}>{feat}</Typography>
                    </Box>
                  ))}
                </Box>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => navigate('/login?mode=signup')}
                  sx={{
                    background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)',
                    color: '#ffffff',
                    textTransform: 'none',
                    fontWeight: 700,
                    boxShadow: '0 4px 20px rgba(14, 165, 233, 0.45)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0369a1 0%, #0284c7 100%)',
                    },
                  }}
                >
                  Start Pro Trial
                </Button>
              </Box>
            </Grid>

            {/* Enterprise SOC */}
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  p: 4,
                  height: '100%',
                  backgroundColor: '#0c1527',
                  borderRadius: '16px',
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', mb: 1 }}>
                  Enterprise SOC Cluster
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: '#94a3b8', mb: 3 }}>
                  For high-throughput organizations &amp; telecommunications
                </Typography>
                <Typography sx={{ fontSize: '2.2rem', fontWeight: 900, color: '#38bdf8', mb: 3 }}>
                  Custom
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4, flexGrow: 1 }}>
                  {[
                    'High-throughput REST API key (>50k req/min)',
                    'Dedicated clustered enterprise storage instance',
                    'Autonomous AI threat model retraining',
                    'Automated SIEM & SOAR webhook streaming',
                    '24/7 dedicated incident response engineer',
                  ].map((feat) => (
                    <Box key={feat} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleIcon sx={{ fontSize: 16, color: '#38bdf8' }} />
                      <Typography sx={{ fontSize: '0.85rem', color: '#cbd5e1' }}>{feat}</Typography>
                    </Box>
                  ))}
                </Box>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    const el = document.getElementById('contact')
                    if (el) el.scrollIntoView({ behavior: 'smooth' })
                  }}
                  sx={{
                    color: '#38bdf8',
                    borderColor: 'rgba(56, 189, 248, 0.4)',
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Contact Enterprise Team
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* =========================================================================
          SECTION 7: CONTACT & FALSE POSITIVE REPORTING
          ========================================================================= */}
      <Box
        id="contact"
        sx={{
          py: { xs: 8, md: 12 },
          backgroundColor: '#0a0f1d',
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Chip
              label="SECURITY COMMUNICATIONS"
              size="small"
              sx={{
                backgroundColor: 'rgba(245, 158, 11, 0.12)',
                color: '#f59e0b',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                fontWeight: 700,
                fontSize: '0.75rem',
                letterSpacing: '0.08em',
                mb: 2,
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.8rem', md: '2.5rem' },
                fontWeight: 800,
                color: '#ffffff',
                mb: 1.5,
              }}
            >
              Get in Touch with Fanos SecOps
            </Typography>
            <Typography sx={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              Report false positives, submit zero-day samples, or request enterprise custom deployments
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleContactSubmit}
            sx={{
              backgroundColor: '#0c1527',
              borderRadius: '16px',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              p: { xs: 3, md: 4.5 },
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            }}
          >
            {contactSuccess && (
              <Alert severity="success" sx={{ mb: 3 }} onClose={() => setContactSuccess(false)}>
                Inquiry received! A Fanos SecOps specialist will review your ticket within 2 hours.
              </Alert>
            )}

            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <Typography sx={{ fontSize: '0.82rem', color: '#cbd5e1', mb: 0.8, fontWeight: 600 }}>
                  Your Name
                </Typography>
                <TextField
                  fullWidth
                  required
                  placeholder="Security Analyst"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#080d19',
                      color: '#ffffff',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography sx={{ fontSize: '0.82rem', color: '#cbd5e1', mb: 0.8, fontWeight: 600 }}>
                  Work Email
                </Typography>
                <TextField
                  fullWidth
                  required
                  type="email"
                  placeholder="analyst@organization.com"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#080d19',
                      color: '#ffffff',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography sx={{ fontSize: '0.82rem', color: '#cbd5e1', mb: 0.8, fontWeight: 600 }}>
                  Communication Category
                </Typography>
                <TextField
                  fullWidth
                  select
                  value={contactForm.category}
                  onChange={(e) => setContactForm({ ...contactForm, category: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#080d19',
                      color: '#ffffff',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
                    },
                  }}
                >
                  <MenuItem value="false_positive">Report False Positive Classification</MenuItem>
                  <MenuItem value="malicious_submission">Submit Zero-Day Phishing / Malicious Sample</MenuItem>
                  <MenuItem value="enterprise_api">Request Enterprise API Key & Onboarding</MenuItem>
                  <MenuItem value="general">General SecOps Inquiry</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography sx={{ fontSize: '0.82rem', color: '#cbd5e1', mb: 0.8, fontWeight: 600 }}>
                  Target Domain or URL (Optional)
                </Typography>
                <TextField
                  fullWidth
                  placeholder="https://example.com/check"
                  value={contactForm.targetUrl}
                  onChange={(e) => setContactForm({ ...contactForm, targetUrl: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#080d19',
                      color: '#ffffff',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography sx={{ fontSize: '0.82rem', color: '#cbd5e1', mb: 0.8, fontWeight: 600 }}>
                  Message / Threat Observation Details
                </Typography>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={4}
                  placeholder="Provide any relevant context, IOC hashes, or remediation notes..."
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#080d19',
                      color: '#ffffff',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SendIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)',
                    color: '#ffffff',
                    fontWeight: 700,
                    px: 4,
                    py: 1.2,
                    borderRadius: '8px',
                    boxShadow: '0 4px 18px rgba(14, 165, 233, 0.45)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0369a1 0%, #0284c7 100%)',
                    },
                  }}
                >
                  Submit Security Dispatch
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* =========================================================================
          SECTION 8: ENTERPRISE FOOTER
          ========================================================================= */}
      <Box
        component="footer"
        sx={{
          backgroundColor: '#060a14',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          pt: 8,
          pb: 5,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={5} sx={{ mb: 6 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 2 }}>
                <FanosLogo size={36} showText={true} />
              </Box>
              <Typography sx={{ color: '#94a3b8', fontSize: '0.86rem', lineHeight: 1.6, mb: 2.5 }}>
                Illuminating hidden web threats through machine learning multi-class vectorization,
                VirusTotal threat intelligence aggregation, and enterprise zero-trust persistence.
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <VerifiedIcon sx={{ fontSize: 18, color: '#10b981' }} />
                <Typography sx={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                  Enterprise Encrypted Ledger Active
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6} md={2}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff', mb: 2 }}>
                Platform
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  onClick={() => {
                    const el = document.getElementById('scanner-showcase')
                    if (el) el.scrollIntoView({ behavior: 'smooth' })
                  }}
                  sx={{ color: '#94a3b8', p: 0, justifyContent: 'flex-start', textTransform: 'none' }}
                >
                  Vulnerability Scanner
                </Button>
                <Button
                  onClick={() => {
                    const el = document.getElementById('about')
                    if (el) el.scrollIntoView({ behavior: 'smooth' })
                  }}
                  sx={{ color: '#94a3b8', p: 0, justifyContent: 'flex-start', textTransform: 'none' }}
                >
                  AI Threat Architecture
                </Button>
                <Button
                  onClick={() => {
                    const el = document.getElementById('stats')
                    if (el) el.scrollIntoView({ behavior: 'smooth' })
                  }}
                  sx={{ color: '#94a3b8', p: 0, justifyContent: 'flex-start', textTransform: 'none' }}
                >
                  Live Telemetry
                </Button>
                <Button
                  onClick={() => navigate('/login')}
                  sx={{ color: '#38bdf8', p: 0, justifyContent: 'flex-start', textTransform: 'none', fontWeight: 600 }}
                >
                  Analyst Terminal
                </Button>
              </Box>
            </Grid>

            <Grid item xs={6} md={3}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff', mb: 2 }}>
                Integrations
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  href="https://t.me/URLDetector_Bot"
                  target="_blank"
                  sx={{ color: '#94a3b8', p: 0, justifyContent: 'flex-start', textTransform: 'none' }}
                >
                  Telegram Bot (@URLDetector_Bot)
                </Button>
                <Button
                  onClick={() => {
                    const el = document.getElementById('integrations')
                    if (el) el.scrollIntoView({ behavior: 'smooth' })
                  }}
                  sx={{ color: '#94a3b8', p: 0, justifyContent: 'flex-start', textTransform: 'none' }}
                >
                  RESTful Scan API
                </Button>
                <Button
                  onClick={() => {
                    const el = document.getElementById('integrations')
                    if (el) el.scrollIntoView({ behavior: 'smooth' })
                  }}
                  sx={{ color: '#94a3b8', p: 0, justifyContent: 'flex-start', textTransform: 'none' }}
                >
                  VirusTotal v3 Partner
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff', mb: 2 }}>
                Compliance &amp; Standards
              </Typography>
              <Typography sx={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: 1.6, mb: 2 }}>
                Built in accordance with OWASP Top 10 Web Application Security and NIST Cybersecurity
                Framework (CSF) URL telemetry guidelines.
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate('/login')}
                sx={{
                  color: '#ffffff',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  textTransform: 'none',
                }}
              >
                Sign In to Console
              </Button>
            </Grid>
          </Grid>

          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', mb: 3 }} />

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Typography sx={{ color: '#64748b', fontSize: '0.82rem' }}>
              &copy; 2026 Fanos CyberSec. All rights reserved. Illuminating Hidden Web Threats.
            </Typography>
            <Typography sx={{ color: '#64748b', fontSize: '0.82rem' }}>
              Autonomous Multi-Class AI Detection Engine v2.4
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
