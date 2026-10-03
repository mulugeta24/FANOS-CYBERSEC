# Frontend Pages Overview

## Reports Page

### Layout
```
┌─────────────────────────────────────────────────────────┐
│  URL Scan Reports                    [Refresh] [Export] │
├─────────────────────────────────────────────────────────┤
│  [Search by URL...]                                     │
├─────────────────────────────────────────────────────────┤
│  ID │ URL              │ Type      │ ML    │ VT   │ Time│
│  1  │ google.com       │ [Benign]  │ [Ben] │ Safe │ ... │
│  2  │ malware-site.com │ [Malicious]│ [Mal] │ Mal  │ ... │
│  3  │ phishing.com     │ [Phishing]│ [Phi] │ Susp │ ... │
├─────────────────────────────────────────────────────────┤
│  Rows per page: [10 ▼]              < 1 of 5 >         │
└─────────────────────────────────────────────────────────┘
```

### Features
- Search bar to filter URLs
- Color-coded chips:
  - Green for Benign
  - Red for Malicious
  - Orange for Phishing
  - Purple for Defacement
- Pagination controls
- Export to CSV button
- Refresh button
- Tooltips on hover for long URLs

### Data Displayed
- Report ID
- Full URL (truncated with tooltip)
- Report Type (color-coded chip)
- ML Prediction (outlined chip)
- VirusTotal Result
- Timestamp (formatted)

---

## Statistics Page

### Layout
```
┌─────────────────────────────────────────────────────────┐
│  Statistics & Analytics                                 │
├─────────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ Total    │ │ Malicious│ │ Benign   │ │ Phishing │  │
│  │ 1,234    │ │ 89       │ │ 1,145    │ │ 12       │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────┐ ┌─────────────────────┐      │
│  │ Category Dist.      │ │ Detection Dist.     │      │
│  │                     │ │                     │      │
│  │  [Bar Chart]        │ │  [Pie Chart]        │      │
│  │                     │ │                     │      │
│  └─────────────────────┘ └─────────────────────┘      │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────┐       │
│  │ Detection Rates                             │       │
│  │                                             │       │
│  │  [Horizontal Bar Chart]                     │       │
│  │                                             │       │
│  └─────────────────────────────────────────────┘       │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────┐       │
│  │ Summary                                     │       │
│  │  1,234      89%        11%       12         │       │
│  │  Total    Malicious  Benign   Phishing     │       │
│  └─────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────┘
```

### Features
- 4 Summary cards at the top
- Category Distribution bar chart
- Detection Distribution pie chart
- Detection Rates horizontal bar chart
- Summary section with key metrics
- All data from real database
- Color-coded visualizations
- Responsive design

### Charts
1. **Category Distribution (Bar Chart)**
   - X-axis: Categories (Benign, Malicious, Phishing, Defacement)
   - Y-axis: Count
   - Color-coded bars

2. **Detection Distribution (Pie Chart)**
   - Shows percentage of each category
   - Color-coded slices
   - Labels with percentages

3. **Detection Rates (Horizontal Bar Chart)**
   - Detection Rate %
   - Benign Rate %
   - Phishing Rate %
   - Green bars

4. **Summary Section**
   - Total Scans (large number)
   - Malicious Rate % (red)
   - Benign Rate % (green)
   - Phishing Detected (orange)

---

## Dashboard Page

### Layout
```
┌─────────────────────────────────────────────────────────┐
│  Dashboard Overview                                     │
├─────────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ Total    │ │ Malicious│ │ Benign   │ │ Phishing │  │
│  │ 1,234    │ │ 89       │ │ 1,145    │ │ 12       │  │
│  │ +12%     │ │ -5%      │ │ +8%      │ │ -3%      │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────┐ ┌─────────────────┐   │
│  │ Weekly Activity             │ │ Detection Dist. │   │
│  │                             │ │                 │   │
│  │  [Line Chart]               │ │  [Pie Chart]    │   │
│  │                             │ │                 │   │
│  └─────────────────────────────┘ └─────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Features
- 4 Summary cards with trend indicators
- Weekly activity line chart (real data)
- Detection distribution pie chart
- Icons for each metric
- Color-coded cards
- Responsive layout

---

## Color Scheme

### Status Colors
- **Benign**: Green (#4caf50) - Safe URLs
- **Malicious**: Red (#f44336) - Dangerous URLs
- **Phishing**: Orange (#ff9800) - Phishing attempts
- **Defacement**: Purple (#9c27b0) - Defaced sites
- **Suspicious**: Deep Orange (#ff5722) - Suspicious URLs

### UI Colors
- **Primary**: Blue (#1976d2) - Main actions
- **Success**: Green (#4caf50) - Positive actions
- **Warning**: Orange (#ff9800) - Warnings
- **Error**: Red (#f44336) - Errors
- **Secondary**: Pink (#dc004e) - Secondary actions

---

## Navigation

```
┌─────────────────┐
│  URL Detector   │
├─────────────────┤
│ 📊 Dashboard    │
│ 📝 Reports      │ ← Reports Page
│ 📈 Statistics   │ ← Statistics Page
│ 🔍 URL Analysis │
│ ⚙️  Settings    │
│ 🚪 Logout       │
└─────────────────┘
```

---

## Responsive Behavior

### Desktop (> 1200px)
- Multi-column layout
- Full-width charts
- All features visible

### Tablet (768px - 1200px)
- 2-column layout
- Stacked charts
- Compact navigation

### Mobile (< 768px)
- Single column layout
- Stacked cards
- Hamburger menu
- Scrollable tables

---

## Empty States

### Reports Page (No Data)
```
┌─────────────────────────────────────┐
│                                     │
│     No reports available yet        │
│  Start scanning URLs to see         │
│        reports here                 │
│                                     │
└─────────────────────────────────────┘
```

### Statistics Page (No Data)
```
┌─────────────────────────────────────┐
│                                     │
│  No statistics available yet        │
│  Start scanning URLs to see         │
│        data here                    │
│                                     │
└─────────────────────────────────────┘
```

---

## Loading States

Both pages show a centered loading spinner while fetching data:
```
┌─────────────────────────────────────┐
│                                     │
│              ⟳                      │
│          Loading...                 │
│                                     │
└─────────────────────────────────────┘
```

---

## Error States

Both pages show error alerts with retry option:
```
┌─────────────────────────────────────┐
│  ⚠️ Failed to load data             │
│  Please try again                [X]│
└─────────────────────────────────────┘
```

---

## Interactions

### Reports Page
1. **Search**: Type in search box to filter URLs
2. **Pagination**: Click page numbers or arrows
3. **Rows per page**: Select from dropdown (5, 10, 25, 50)
4. **Export**: Click export button to download CSV
5. **Refresh**: Click refresh button to reload data
6. **Hover**: Hover over URL to see full text in tooltip

### Statistics Page
1. **View Charts**: Scroll to see all visualizations
2. **Hover**: Hover over chart elements to see details
3. **Responsive**: Resize window to see responsive behavior

---

## Data Updates

Both pages fetch real-time data from the database:
- Reports page shows all scanned URLs
- Statistics page shows aggregated statistics
- Dashboard shows summary and trends
- All data updates when you scan new URLs

---

## Performance

- Fast loading with optimized queries
- Pagination for large datasets
- Lazy loading of charts
- Efficient data caching
- Responsive design for all devices

---

## Accessibility

- Keyboard navigation support
- Screen reader friendly
- High contrast colors
- Clear labels and tooltips
- ARIA attributes
- Focus indicators

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

---

## Summary

Both Reports and Statistics pages are now fully functional with:
✅ Real data from database
✅ Beautiful visualizations
✅ Responsive design
✅ Error handling
✅ Loading states
✅ Empty states
✅ Export functionality
✅ Search and filtering
✅ Pagination
✅ Color-coded status
✅ Tooltips and interactions

Everything is ready to use! 🎉
