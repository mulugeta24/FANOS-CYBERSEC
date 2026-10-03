# Statistics Calculation Explained

## How Statistics Are Calculated

### Backend (`backend/core/database.py` - `get_accurate_stats()`)

The backend calculates statistics from the `scans` table (automatic detections):

```python
# Total checked URLs
SELECT COUNT(*) FROM scans
→ total_checked = 9

# Count by final_verdict (breakdown)
SELECT final_verdict, COUNT(*) FROM scans GROUP BY final_verdict
→ by_type = {
    'benign': 2,
    'defacement': 4,
    'phishing': 3,
    'malicious': 0,
    'suspicious': 0
}

# Count ALL threats (malicious + phishing + defacement + suspicious)
SELECT COUNT(*) FROM scans 
WHERE final_verdict IN ('malicious', 'phishing', 'defacement', 'suspicious')
→ malicious_count = 7  (includes phishing + defacement)

# Count benign only
SELECT COUNT(*) FROM scans WHERE final_verdict = 'benign'
→ benign_count = 2
```

### Frontend (`frontend/src/pages/Statistics.jsx`)

The frontend receives this data and calculates percentages:

```javascript
// Data from backend
stats = {
  totalChecked: 9,
  malicious: 7,      // ALL threats (malicious + phishing + defacement + suspicious)
  benign: 2,
  phishing: 3,       // Phishing only
  defacement: 4      // Defacement only
}

// Calculate percentages
total = 9

accuracyData = [
  {
    metric: 'Threat Detection Rate',
    value: (7 / 9) * 100 = 78%    // All threats
  },
  {
    metric: 'Benign Rate',
    value: (2 / 9) * 100 = 22%    // Benign only
  },
  {
    metric: 'Phishing Rate',
    value: (3 / 9) * 100 = 33%    // Phishing only
  },
  {
    metric: 'Defacement Rate',
    value: (4 / 9) * 100 = 44%    // Defacement only
  }
]
```

## Example with Your Data

Based on your current data:
- Total URLs Checked: 9
- Malicious Detected: 7 (includes all threats)
- Benign URLs: 2
- Phishing Attempts: 3
- Defacement Detected: 4

### Breakdown by Type
```
benign: 2
defacement: 4
phishing: 3
malicious: 0
suspicious: 0
```

### Detection Rates Chart
```
Threat Detection Rate: 78%  (7 out of 9 are threats)
Benign Rate: 22%            (2 out of 9 are benign)
Phishing Rate: 33%          (3 out of 9 are phishing)
Defacement Rate: 44%        (4 out of 9 are defacement)
```

## Why Rates Don't Add Up to 100%

The rates are **NOT mutually exclusive**:
- **Threat Detection Rate (78%)** = All threats combined (phishing + defacement + malicious + suspicious)
- **Benign Rate (22%)** = Only benign URLs
- **Phishing Rate (33%)** = Subset of threats (part of the 78%)
- **Defacement Rate (44%)** = Subset of threats (part of the 78%)

So:
- Threat Detection Rate (78%) + Benign Rate (22%) = 100% ✅
- Phishing (33%) + Defacement (44%) = 77% ≈ 78% (rounding) ✅

## Verification

Let's verify with your data:

```
Total: 9 URLs

Threats: 7 URLs
  - Phishing: 3
  - Defacement: 4
  - Malicious: 0
  - Suspicious: 0

Benign: 2 URLs

Threat Detection Rate = 7/9 = 77.78% ≈ 78% ✅
Benign Rate = 2/9 = 22.22% ≈ 22% ✅
Phishing Rate = 3/9 = 33.33% ≈ 33% ✅
Defacement Rate = 4/9 = 44.44% ≈ 44% ✅

Threat + Benign = 78% + 22% = 100% ✅
Phishing + Defacement = 33% + 44% = 77% ≈ 78% ✅
```

## Summary

✅ **The statistics are calculated correctly!**

- **Threat Detection Rate** shows the percentage of ALL threats detected
- **Benign Rate** shows the percentage of safe URLs
- **Phishing Rate** shows what portion are phishing (subset of threats)
- **Defacement Rate** shows what portion are defacement (subset of threats)

The chart is designed to show:
1. Overall threat vs benign split (78% vs 22%)
2. Breakdown of specific threat types (phishing 33%, defacement 44%)

This gives you both the big picture (threat detection) and the details (what types of threats).
