# URL Detector Admin Dashboard

Modern React admin dashboard for the Malicious URL Detector Bot.

## Features

- 📊 Real-time statistics and analytics
- 📈 Interactive charts and visualizations
- 📝 User reports management
- 🔍 URL analysis tool
- ⚙️ System settings configuration
- 📱 Responsive design
- 🎨 Material-UI components

## Tech Stack

- React 18
- Material-UI (MUI)
- Recharts for data visualization
- React Router for navigation
- Axios for API calls
- Vite for fast development

## Prerequisites

- Node.js 16+ and npm
- Python backend API server running

## Installation

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Configure API URL in `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

## Development

Start the development server:
```bash
npm run dev
```

The dashboard will be available at `http://localhost:3000`

## Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

## Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   │   └── Layout.jsx   # Main layout with sidebar
│   ├── pages/           # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Reports.jsx
│   │   ├── Statistics.jsx
│   │   ├── URLAnalysis.jsx
│   │   └── Settings.jsx
│   ├── services/        # API services
│   │   └── api.js
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html
├── package.json
└── vite.config.js
```

## Available Pages

### Dashboard
- Overview statistics
- Weekly activity charts
- Detection distribution
- Quick metrics

### Reports
- User feedback reports
- Searchable table
- Export to CSV
- Pagination

### Statistics
- Detailed analytics
- Time-range filtering
- Multiple chart types
- Accuracy metrics

### URL Analysis
- Real-time URL scanning
- ML and VirusTotal results
- Confidence scores
- Probability distribution

### Settings
- ML threshold configuration
- API key management
- Notification preferences
- System settings

## API Integration

The dashboard connects to the Flask API server (`api_server.py`) which provides:

- `/api/stats` - Overall statistics
- `/api/reports` - User reports
- `/api/statistics` - Detailed analytics
- `/api/analyze` - URL analysis
- `/api/activity/recent` - Recent activity

## Environment Variables

```env
VITE_API_URL=http://localhost:5000/api
```

## Customization

### Theme
Edit `src/App.jsx` to customize the Material-UI theme:

```javascript
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
})
```

### Colors
Modify category colors in components:
- Benign: Green (#4caf50)
- Malicious: Red (#f44336)
- Phishing: Orange (#ff9800)
- Defacement: Purple (#9c27b0)

## Troubleshooting

### CORS Issues
Ensure the Flask API server has CORS enabled:
```python
from flask_cors import CORS
CORS(app)
```

### API Connection
Check that the API server is running on the correct port and the `VITE_API_URL` is set correctly.

### Build Errors
Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## License

MIT License - See main project LICENSE file
