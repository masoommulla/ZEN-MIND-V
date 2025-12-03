# 🔍 Jitsi Video Conference Debugging Guide

## Quick Console Log Reference

When you join a video session, you should see these logs in order:

### ✅ SUCCESSFUL CONNECTION FLOW

```
🔄 Loading Jitsi Meet API...
✅ Jitsi Meet API loaded successfully
🔄 Initializing Jitsi with room: zenmind-1234567890-abc123
✅ Jitsi API instance created
✅ Participant joined (you or someone else)
```

**OR**

```
🔄 Loading Jitsi Meet API...
✅ Jitsi Meet API loaded successfully
🔄 Initializing Jitsi with room: zenmind-1234567890-abc123
✅ Jitsi API instance created
✅ Joined video conference successfully
```

### ⚠️ TIMEOUT (Still works, just slow)

```
🔄 Loading Jitsi Meet API...
✅ Jitsi Meet API loaded successfully
🔄 Initializing Jitsi with room: zenmind-1234567890-abc123
✅ Jitsi API instance created
⚠️ Jitsi took too long to join, clearing loading state
```

**Result:** Loading screen clears after 30 seconds, video should still work

### ❌ ERROR SCENARIOS

#### Invalid Room Name
```
🔄 Loading Jitsi Meet API...
✅ Jitsi Meet API loaded successfully
❌ Invalid room name: (empty)
```
**Fix:** Re-join the session, contact support if persists

#### Network Error
```
🔄 Loading Jitsi Meet API...
❌ Error initializing Jitsi: Failed to load Jitsi Meet API
```
**Fix:** Check internet connection, refresh page

#### Jitsi Error
```
🔄 Loading Jitsi Meet API...
✅ Jitsi Meet API loaded successfully
🔄 Initializing Jitsi with room: zenmind-1234567890-abc123
✅ Jitsi API instance created
❌ Jitsi error occurred: [error message]
```
**Fix:** Try rejoining, check camera/mic permissions

---

## Common Issues & Solutions

### Issue 1: Stuck on "Connecting to session..."
**Symptoms:** Loading spinner for more than 30 seconds

**Check:**
1. Open browser console (F12)
2. Look for emoji logs
3. Check if Jitsi API loaded (✅ Jitsi Meet API loaded successfully)

**Solution:**
- If no logs appear: Refresh page
- If "❌" errors appear: Follow error-specific fix above
- If "⚠️ Jitsi took too long": Wait for auto-clear (30s) or refresh

### Issue 2: Black screen / No video
**Symptoms:** Video conference loads but shows black screen

**Check:**
1. Camera/microphone permissions
2. Browser console for errors
3. Other tabs using camera

**Solution:**
```javascript
// Should see in console:
✅ Participant joined (you or someone else)
```
- Grant camera/mic permissions when prompted
- Close other apps using camera
- Try different browser (Chrome recommended)

### Issue 3: "Too many requests" error
**Symptoms:** Error when trying to join

**Check:**
```javascript
// In Network tab:
Response: "Too many requests" or similar
```

**Solution:**
- Wait 1-2 minutes
- Refresh page
- Try again
- Error should be caught gracefully (no crash)

### Issue 4: Appointments keep reloading
**Symptoms:** Page refreshes constantly, flickering

**Check:**
```javascript
// Should NOT see rapid reloads in console
// Should reload every 30 seconds only
```

**Solution:**
- Fixed! Should only reload every 30 seconds now
- No reload during active video calls
- If still occurring, clear browser cache

---

## Performance Monitoring

### Expected Behavior
- Initial page load: < 2 seconds
- Jitsi script load: < 5 seconds
- Video conference join: < 15 seconds
- Auto-reload interval: 30 seconds
- Countdown timer: Updates every 1 second

### Performance Issues
If any metric exceeds expected time:
1. Check network speed
2. Check browser console for errors
3. Try different browser
4. Clear cache and cookies

---

## Browser Compatibility

### Recommended
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Known Issues
- ⚠️ Safari on iOS: May need explicit camera permission
- ⚠️ Firefox: May ask for permissions twice
- ❌ Internet Explorer: Not supported

---

## Emergency Fixes

### Quick Fix 1: Refresh Page
```
1. Press F5 or Ctrl+R
2. Wait for page to load
3. Try joining again
```

### Quick Fix 2: Clear Console Errors
```
1. Open console (F12)
2. Click "Clear Console" 🚫
3. Try action again
4. Check for new errors only
```

### Quick Fix 3: Check Permissions
```
1. Click lock icon 🔒 in address bar
2. Check Camera and Microphone permissions
3. Set to "Allow"
4. Refresh page
```

### Quick Fix 4: Hard Refresh
```
1. Press Ctrl+Shift+R (Windows/Linux)
2. Press Cmd+Shift+R (Mac)
3. Clears cache and reloads
```

---

## Reporting Issues

When reporting a bug, include:

1. **Console logs** (F12 → Console → Copy all)
2. **Network tab** (F12 → Network → Filter: XHR)
3. **Steps to reproduce**
4. **Browser version**
5. **Screenshot of error**

---

## Contact Support

If issue persists after trying all fixes:
1. Copy console logs
2. Screenshot the error
3. Note the exact time it occurred
4. Contact: support@zenmind.app

---

**Last Updated: December 2, 2025**
