# Quick Reference - Reports & Statistics

## Start the System

```bash
# Option 1: Use batch script
start.bat

# Option 2: Manual start
# Terminal 1
cd api && python app.py

# Terminal 2
cd frontend && npm run dev
```

## Access the Pages

1. Open: http://localhost:3002
2. Login: admin / admin123
3. Navigate:
   - Reports: Click "Reports" in sidebar
   - Statistics: Click "Statistics" in sidebar

## Reports Page

### What You'll See
- Table of all scanned URLs
- Search bar to filter
- Pagination controls
- Export to CSV button
- Refresh button

### Actions
- **Search**: Type URL to filter
- **Export**: Click download icon
- **Refresh**: Click refresh icon
- **Paginate**: Use bottom controls

### Data Columns
- ID
- URL (with tooltip)
- Report Type (color chip)
- ML Prediction (outlined chip)
- VirusTotal Result
- Timestamp

## Statistics Page

### What You'll See
- 4 summary cards
- Category distribution chart
- Detection distribution pie chart
- Detection rates chart
- Summary section

### Metrics
- Total URLs Checked
- Malicious Detected
- Benign URLs
- Phishing Attempts
- Detection rates (%)

## Generate Test Data

To see data in the pages:

1. Go to Dashboard
2. Scan some URLs:
   - https://google.com (safe)
   - https://github.com (safe)
   - Test malicious URL (if available)
3. Go to Reports page to see scans
4. Go to Statistics page to see charts

## Color Codes

- 🟢 Green = Benign/Safe
- 🔴 Red = Malicious/Dangerous
- 🟠 Orange = Phishing/Warning
- 🟣 Purple = Defacement
- 🟤 Deep Orange = Suspicious

## Troubleshooting

### No data showing?
- Scan some URLs first
- Check backend is running
- Check browser console (F12)

### Error loading data?
- Restart backend server
- Check database exists
- Clear browser cache

### Charts not showing?
- Wait for data to load
- Check console for errors
- Refresh the page

## Files Modified

1. `api/app.py` - Enhanced stats endpoint
2. `frontend/src/pages/Reports.jsx` - Complete redesign
3. `frontend/src/pages/Statistics.jsx` - Complete redesign
4. `frontend/src/pages/Dashboard.jsx` - Updated data
5. `frontend/src/services/api.js` - Enhanced API calls

## API Endpoints

- `GET /api/stats` - Get statistics
- `GET /api/admin/status` - Get reports
- `POST /api/scan` - Scan URL
- `POST /api/report` - Submit report

## Database Tables

- `reports` - Stores scan results
- `stats` - Stores statistics
- `vt_cache` - Caches VirusTotal results

## Features

### Reports Page ✅
- Real-time data
- Search functionality
- Pagination
- CSV export
- Color-coded status
- Loading states
- Error handling

### Statistics Page ✅
- Real-time statistics
- Multiple charts
- Summary cards
- Percentage calculations
- Color-coded visualizations
- Loading states
- Error handling

## Next Steps

1. Start the system
2. Login to dashboard
3. Scan some URLs
4. Check Reports page
5. Check Statistics page
6. Export data if needed

Everything is working with real data! 🎉
