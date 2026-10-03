import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import FanosHome from './pages/FanosHome'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Reports from './pages/Reports'
import Statistics from './pages/Statistics'
import URLAnalysis from './pages/URLAnalysis'
import Settings from './pages/Settings'

// Enterprise Web Security Scanner Views
import WebScannerDashboard from './pages/WebScanner/WebScannerDashboard'
import NewWebScan from './pages/WebScanner/NewWebScan'
import LiveScanView from './pages/WebScanner/LiveScanView'
import ScanFindingsView from './pages/WebScanner/ScanFindingsView'
import ScanAssetsView from './pages/WebScanner/ScanAssetsView'
import ScanEvidenceView from './pages/WebScanner/ScanEvidenceView'
import ScanReportView from './pages/WebScanner/ScanReportView'

const cyberDarkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#38bdf8', // Cyber Cyan
      contrastText: '#0a0f1d',
    },
    secondary: {
      main: '#f59e0b', // Amber Gold
      contrastText: '#0a0f1d',
    },
    success: {
      main: '#10b981',
    },
    warning: {
      main: '#f59e0b',
    },
    error: {
      main: '#ef4444',
    },
    background: {
      default: '#0a0f1d',
      paper: '#0d1527',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
    },
  },
  typography: {
    fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
})

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        backgroundColor: '#0a0f1d',
        color: '#38bdf8'
      }}>
        Initializing Fanos SecOps Console...
      </div>
    )
  }
  
  return user ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  const { user } = useAuth()

  return (
    <Routes>
      {/* Public Home Page (Comprehensive Fanos CyberSec Landing Page) */}
      <Route path="/" element={<FanosHome />} />
      <Route path="/home" element={<FanosHome />} />

      {/* Authentication */}
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />

      {/* Authenticated SecOps Console & Scanner Service */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Layout><Dashboard /></Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/analysis"
        element={
          <PrivateRoute>
            <Layout><URLAnalysis /></Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <PrivateRoute>
            <Layout><Reports /></Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/statistics"
        element={
          <PrivateRoute>
            <Layout><Statistics /></Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <Layout><Settings /></Layout>
          </PrivateRoute>
        }
      />

      {/* Enterprise Web Security Scanner Module */}
      <Route
        path="/web-scanner"
        element={
          <PrivateRoute>
            <Layout><WebScannerDashboard /></Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/web-scanner/new"
        element={
          <PrivateRoute>
            <Layout><NewWebScan /></Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/web-scanner/:scanId"
        element={
          <PrivateRoute>
            <Layout><LiveScanView /></Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/web-scanner/:scanId/findings"
        element={
          <PrivateRoute>
            <Layout><ScanFindingsView /></Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/web-scanner/:scanId/assets"
        element={
          <PrivateRoute>
            <Layout><ScanAssetsView /></Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/web-scanner/:scanId/evidence"
        element={
          <PrivateRoute>
            <Layout><ScanEvidenceView /></Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/web-scanner/:scanId/report"
        element={
          <PrivateRoute>
            <Layout><ScanReportView /></Layout>
          </PrivateRoute>
        }
      />

      {/* Fallback to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <ThemeProvider theme={cyberDarkTheme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App