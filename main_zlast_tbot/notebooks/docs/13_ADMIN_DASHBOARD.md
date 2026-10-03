# Admin Dashboard Documentation

## Overview

The Admin Dashboard is a modern React-based web application that provides a comprehensive interface for monitoring and managing the Malicious URL Detector Bot.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  React Frontend                         │
│                  (Port 3000)                            │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Dashboard  │  Reports  │  Statistics  │  etc.   │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/REST API
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Flask API Server                           │
│              (Port 5000)                                │
│  ┌──────────────────────────────────────────────────┐  │
│  │  /api/stats  │  /api/reports  │  /api/analyze   │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              SQLite Database                            │
│              (bot_data.db)                              │
└─────────────────────────────────────────────────────────┘
```

## Features

### 1. Dashboard Page
**Route**: `/dashboard`

**Features**:
- Real-time statistics cards
- Weekly activity line chart
- Detection distribution pie chart
- Trend indicators

**Components**:
- StatCard - Displays individual metrics
- LineChart - Shows activity over time
- PieChart - Shows category distribution

### 2. Reports Page
**Route**: `/reports`

**Features**:
- Searchable reports table
- Pagination
- Export to CSV
- Real-time refresh
- Category filtering

**Data Displayed**:
- Report ID
- URL
- Report type (user classification)
- ML prediction
- VirusTotal result
- User ID
- Timestamp

### 3. Statistics Page
**Route**: `/statistics`

**Features**:
- Time range selector (7/30/90 days, 1 year)
- Daily detection trends (area chart)
- Category distribution (bar chart)
- Accuracy metrics (horizontal bar chart)
- Detection rate over time (line chart)

**Metrics**:
- ML Accuracy
- VirusTotal match rate
- User agreement rate
- False positive rate

### 4. URL Analysis Page
**Route**: `/analysis`

**Features**:
- Real-time URL scanning
- Combined ML + VirusTotal analysis
- Confidence scores
- Probability distribution
- Visual verdict indicators

**Analysis Results**:
- Final verdict with icon
- ML prediction
- VirusTotal result
- Confidence percentage
- Probability breakdown

### 5. Settings Page
**Route**: `/settings`

**Features**:
- ML threshold configuration
- Cache expiry settings
- API key management
- Notification preferences
- Auto-refresh toggle

**Settings Categories**:
- Detection Settings
- API Configuration
- Notifications

## Component Structure

### Layout Component
```
Layout
├── AppBar (Top navigation)
├── Drawer (Sidebar navigation)
│   ├── Dashboard
│   ├── Reports
│   ├── Statistics
│   ├── URL Analysis
│   └── Settings
└── Main Content Area
```

### Page Components
```
src/pages/
├── Dashboard.jsx      # Overview and metrics
├── Reports.jsx        # User reports table
├── Statistics.jsx     # Detailed analytics
├── URLAnalysis.jsx    # URL scanning tool
└── Settings.jsx       # Configuration
```

### Shared Components
```
src/components/
└── Layout.jsx         # Main layout with navigation
```

### Services
```
src/services/
└── api.js            # API client and endpoints
```

## API Endpoints

### GET /api/stats
**Description**: Get overall statistics

**Response**:
```json
{
  "totalChecked": 1523,
  "malicious": 234,
  "benign": 1145,
  "phishing": 98,
  "defacement": 46,
  "reports": {
    "benign": 45,
    "malicious": 12,
    "phishing": 8,
    "defacement": 3
  }
}
```

### GET /api/reports?limit=100
**Description**: Get user reports with pagination

**Response**:
```json
[
  {
    "id": 1,
    "url": "https://example.com",
    "report_type": "malicious",
    "ml_prediction": "benign",
    "vt_result": "suspicious",
    "user_id": 123456,
    "timestamp": 1708387200,
    "notes": "User report"
  }
]
```

### GET /api/statistics?range=7days
**Description**: Get detailed statistics

**Parameters**:
- `range`: 7days, 30days, 90days, 1year

**Response**:
```json
{
  "daily": [...],
  "categories": {...},
  "accuracy": {...}
}
```

### POST /api/analyze
**Description**: Analyze a URL

**Request**:
```json
{
  "url": "https://example.com"
}
```

**Response**:
```json
{
  "url": "https://example.com",
  "final_verdict": "benign",
  "ml_label": "benign",
  "ml_conf": 0.92,
  "vt_result": "benign",
  "ml_probs": {
    "benign": 0.92,
    "malicious": 0.05,
    "phishing": 0.02,
    "defacement": 0.01
  }
}
```

### GET /api/activity/recent?limit=20
**Description**: Get recent activity

**Response**:
```json
[
  {
    "id": 1,
    "url": "https://example.com",
    "type": "malicious",
    "timestamp": 1708387200
  }
]
```

### GET /api/health
**Description**: Health check

**Response**:
```json
{
  "status": "healthy",
  "database": "connected",
  "ml_model": "loaded"
}
```

## Installation & Setup

### Prerequisites
- Node.js 16+
- npm or yarn
- Python 3.9+
- Flask and dependencies

### Frontend Setup

1. **Install dependencies**:
```bash
cd frontend
npm install
```

2. **Configure environment**:
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

3. **Start development server**:
```bash
npm run dev
```

Dashboard available at: `http://localhost:3000`

### Backend API Setup

1. **Install Flask dependencies**:
```bash
pip install flask flask-cors
```

2. **Start API server**:
```bash
python api_server.py
```

API available at: `http://localhost:5000/api`

## Development

### Running Both Servers

**Terminal 1 - API Server**:
```bash
python api_server.py
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
```

### Hot Reload
Both servers support hot reload:
- Frontend: Vite HMR (instant updates)
- Backend: Flask debug mode (auto-restart)

## Production Deployment

### Build Frontend
```bash
cd frontend
npm run build
```

Output in `frontend/dist/`

### Serve Static Files
Option 1 - Separate servers:
```bash
# Serve frontend with nginx/apache
# Run API server separately
```

Option 2 - Flask serves frontend:
```python
from flask import send_from_directory

@app.route('/')
def serve_frontend():
    return send_from_directory('frontend/dist', 'index.html')
```

### Environment Variables

**Production .env**:
```env
VITE_API_URL=https://your-domain.com/api
FLASK_ENV=production
API_PORT=5000
```

## Customization

### Theme Colors
Edit `src/App.jsx`:
```javascript
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    success: { main: '#4caf50' },
    warning: { main: '#ff9800' },
    error: { main: '#f44336' },
  },
})
```

### Add New Page

1. Create page component:
```javascript
// src/pages/NewPage.jsx
export default function NewPage() {
  return <div>New Page</div>
}
```

2. Add route in `App.jsx`:
```javascript
<Route path="/newpage" element={<NewPage />} />
```

3. Add menu item in `Layout.jsx`:
```javascript
{ text: 'New Page', icon: <Icon />, path: '/newpage' }
```

## Security

### API Authentication
Add authentication to API endpoints:
```python
from functools import wraps

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not verify_token(token):
            return jsonify({'error': 'Unauthorized'}), 401
        return f(*args, **kwargs)
    return decorated

@app.route('/api/stats')
@require_auth
def get_stats():
    # ...
```

### CORS Configuration
Restrict CORS in production:
```python
CORS(app, origins=['https://your-domain.com'])
```

### Environment Variables
Never commit sensitive data:
- Use `.env` files
- Add `.env` to `.gitignore`
- Use environment-specific configs

## Performance

### Frontend Optimization
- Code splitting with React.lazy()
- Memoization with useMemo/useCallback
- Virtual scrolling for large tables
- Image optimization

### Backend Optimization
- Database connection pooling
- Response caching
- Pagination for large datasets
- Async operations

### Caching Strategy
```javascript
// Cache API responses
const cache = new Map()

export const getCachedStats = async () => {
  if (cache.has('stats')) {
    return cache.get('stats')
  }
  const data = await getStats()
  cache.set('stats', data)
  setTimeout(() => cache.delete('stats'), 60000) // 1 min
  return data
}
```

## Troubleshooting

### Common Issues

**1. CORS Errors**
```
Access to XMLHttpRequest blocked by CORS policy
```
Solution: Ensure Flask CORS is enabled and configured correctly

**2. API Connection Failed**
```
Network Error
```
Solution: Check API server is running and VITE_API_URL is correct

**3. Build Errors**
```
Module not found
```
Solution: Run `npm install` and check imports

**4. Port Already in Use**
```
Port 3000 is already in use
```
Solution: Kill process or use different port in vite.config.js

## Monitoring

### Frontend Monitoring
- Browser DevTools Console
- React DevTools
- Network tab for API calls

### Backend Monitoring
- Flask logs
- Database query logs
- API response times

### Health Checks
```bash
# Check API health
curl http://localhost:5000/api/health

# Check frontend
curl http://localhost:3000
```

## Future Enhancements

- [ ] Real-time updates with WebSockets
- [ ] User authentication and roles
- [ ] Advanced filtering and search
- [ ] Data export in multiple formats
- [ ] Email notifications
- [ ] Mobile app
- [ ] Dark mode
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] Automated reports

## Support

For issues and questions:
- Check documentation
- Review API logs
- Check browser console
- Open GitHub issue
