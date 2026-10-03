# Frontend White Screen Fix

## Issue
Frontend shows a white screen with nothing displayed.

## Likely Causes
1. Frontend dev server needs restart after code changes
2. API connection issue
3. React error in console

## Quick Fix Steps

### Step 1: Stop Frontend Dev Server
Press `Ctrl+C` in the terminal where frontend is running

### Step 2: Clear Cache and Restart
```bash
cd frontend
npm run dev
```

### Step 3: Check Browser Console
1. Open browser at http://localhost:3002
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Look for any red error messages
5. Share the error messages if any

### Step 4: Verify Backend is Running
The backend should be running on port 5000. Test it:
```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{
  "status": "healthy",
  "ml_model": true,
  "virustotal": true,
  "database": true
}
```

## Common Issues and Solutions

### Issue: CORS Error
If you see CORS errors in console:
- Make sure backend is running
- Backend already has CORS enabled

### Issue: Network Error
If you see "Network Error" or "Failed to fetch":
- Check if backend is running on port 5000
- Check if frontend is accessing correct URL

### Issue: React Component Error
If you see React errors:
- Check browser console for specific error
- Look for missing imports or syntax errors

## Manual Test

### Test 1: Can you see the Login page?
- Go to http://localhost:3002
- You should see a login form with username/password fields
- If you see this, the app is working!

### Test 2: Can you login?
- Username: `admin`
- Password: `admin123`
- Click "Sign In"
- Should redirect to Dashboard

### Test 3: Check Network Tab
1. Open Developer Tools (F12)
2. Go to Network tab
3. Try to login
4. Look for the `/api/auth/login` request
5. Check if it returns 200 OK or an error

## What I Changed

1. Fixed `Tooltip` naming conflict (Material-UI vs Recharts)
2. Updated API base URL to use `http://localhost:5000/api`
3. Changed frontend port to 3002 in vite.config.js
4. Added explicit API_BASE_URL in AuthContext

## Next Steps

1. **Restart the frontend dev server** (most important!)
2. Clear browser cache (Ctrl+Shift+Delete)
3. Hard refresh the page (Ctrl+F5)
4. Check browser console for errors
5. Share any error messages you see

## If Still White Screen

Please check and share:
1. Browser console errors (F12 → Console tab)
2. Network tab errors (F12 → Network tab)
3. Is the URL http://localhost:3002 or different?
4. Can you see the page source (Ctrl+U)?
