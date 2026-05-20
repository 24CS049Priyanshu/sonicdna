# Quick Start — Get Real Spotify Data Running in 5 Minutes

## Step 1: Get Spotify Credentials (2 minutes)

### Go to Spotify Developer
https://developer.spotify.com/dashboard

### Create Account or Log In
(Use any Spotify account - free or premium)

### Create New App
1. Click **"Create an App"**
2. Name it: `SonicDNA` (or any name)
3. Accept terms
4. Click **Create**

### Copy Credentials
In your app settings page, you'll see:
- **Client ID** ← Copy this
- **Client Secret** ← Copy this

⚠️ **Keep Client Secret private!**

---

## Step 2: Configure Redirect URI (1 minute)

In your app settings, find **Redirect URIs** section

Add this exact URL:
```
http://127.0.0.1:3000/api/auth/callback
```

Click **Save**

---

## Step 3: Update .env.local (1 minute)

In your project root, create or update `.env.local`:

```env
SPOTIFY_CLIENT_ID=your_client_id_from_step_1
SPOTIFY_CLIENT_SECRET=your_client_secret_from_step_1
NEXT_PUBLIC_BASE_URL=http://127.0.0.1:3000
```

⚠️ **Don't commit .env.local to Git!** (Already in .gitignore)

---

## Step 4: Restart Dev Server (1 minute)

In terminal:
```bash
# Kill old server (if running)
taskkill /PID <process_id> /F

# Or just stop with Ctrl+C, then:
npm run dev
```

You should see:
```
✓ Ready in 576ms
- Local:         http://localhost:3000
```

---

## Step 5: Test Real Login (0 minutes)

### Visit App
Open **http://127.0.0.1:3000** in your browser

### Click "Connect with Spotify"
You'll be redirected to Spotify login

### Log In & Grant Permissions
Click "Agree" when asked for permissions

### See Real Data!
Dashboard will load with YOUR actual:
- Top artists
- Top tracks
- Listening history
- Genre analysis
- Audio features

---

## ✅ Verification Checklist

### After Logging In

- [ ] Browser shows Spotify username in navbar
- [ ] Navbar shows your profile image
- [ ] Dashboard shows "Currently viewing with demo analytics data" message is **GONE**
- [ ] Artist cards show your real top artists
- [ ] Track cards show your real listening history
- [ ] Genre chart shows your actual top genres
- [ ] Audio features radar shows your listening profile
- [ ] Listening heatmap shows your active hours

### If Something's Wrong

**Problem**: Page shows demo data still
```
Solution: Check browser console (F12)
- Look for error messages
- Verify SPOTIFY_CLIENT_ID is set
- Check that .env.local is in project root
- Restart dev server
```

**Problem**: "Redirect URI mismatch" error
```
Solution: Double-check redirect URI
- Must be: http://127.0.0.1:3000/api/auth/callback
- Not: http://localhost:3000/... (localhost won't work)
- Update in Spotify dashboard
```

**Problem**: Spotify login page won't load
```
Solution: Check credentials
- Verify Client ID is correct (starts with letters)
- Verify Client Secret is correct (long alphanumeric)
- Restart dev server after updating .env.local
```

---

## 🧪 Testing the Full Flow

### Test 1: Real Login
1. Click "Connect with Spotify"
2. Log in with your Spotify account
3. Dashboard shows your real data

### Test 2: Logout & Demo Mode
1. Click logout in navbar
2. Redirected to home page
3. Click "Try with demo data"
4. Dashboard shows sample data with blue indicator

### Test 3: Refresh Token
1. Stay on dashboard for 1+ hour
2. Refresh page (F5)
3. Dashboard still loads (token auto-refreshed)
4. No need to log in again

### Test 4: Error Handling
1. Turn off internet
2. Refresh dashboard
3. Shows mock data (graceful fallback)
4. Turn internet back on
5. Refresh again
6. Shows real data again

---

## 📱 Mobile Testing

Your app works on mobile!

### On Same Network
```
Open: http://192.168.x.x:3000
(Your computer's local IP)
```

### On Different Network
Deploy to production (Vercel, etc.)

---

## 🔒 Security Notes

### ✓ Safe to Share
- ✓ Client ID (shown in Spotify dashboard)
- ✓ Redirect URI (public)
- ✓ This guide

### ✗ Never Share
- ✗ Client Secret (keep in .env.local)
- ✗ Access tokens (in cookies)
- ✗ Refresh tokens (in cookies)
- ✗ .env.local file

### Development vs Production

**Development (.env.local)**:
```env
SPOTIFY_CLIENT_ID=dev_client_id
SPOTIFY_CLIENT_SECRET=dev_client_secret
NEXT_PUBLIC_BASE_URL=http://127.0.0.1:3000
```

**Production (.env.production)**:
```env
SPOTIFY_CLIENT_ID=prod_client_id
SPOTIFY_CLIENT_SECRET=prod_client_secret
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

(Create separate Spotify app for production)

---

## 🚀 Next Steps

### Immediate
- [x] Get Spotify credentials
- [x] Update .env.local
- [x] Test real login
- [x] See real data

### Soon
- [ ] Test all features work with real data
- [ ] Test on mobile
- [ ] Share with friends

### Later (Before Launch)
- [ ] Create production Spotify app
- [ ] Deploy to Vercel/production
- [ ] Update production Spotify app redirect URI
- [ ] Set up error logging/monitoring
- [ ] Test token refresh after long periods

---

## 📚 Learn More

- **Spotify OAuth**: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
- **Next.js Auth**: https://nextjs.org/docs/app/building-your-application/authentication
- **Your Code**:
  - Authentication: `src/app/api/auth/`
  - Dashboard Data: `src/app/api/dashboard/route.js`
  - OAuth Logic: `src/lib/spotify.js`

---

## 💬 Need Help?

### Check Logs
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for error messages

### Check Env Vars
```bash
# In terminal, verify file exists:
cat .env.local
# Should show your credentials
```

### Spotify Status
Check if Spotify API is down:
https://developer.spotify.com/status

### Restart Everything
```bash
# Kill server
taskkill /PID <pid> /F

# Delete cache
rmdir .next /s /q

# Start fresh
npm run dev
```

---

## ✨ What You're Testing

Your application demonstrates:

1. **Real OAuth Integration**
   - Spotify PKCE flow
   - Secure token exchange
   - Automatic token refresh

2. **Live Data Fetching**
   - Real user profile
   - Top artists (short/medium/long term)
   - Top tracks with audio features
   - Recently played history

3. **Beautiful UI**
   - Cinematic design preserved
   - Real data populates all charts
   - Smooth animations
   - Mobile responsive

4. **Production Quality**
   - Error handling
   - Fallback to demo mode
   - No crashes
   - Fast performance

---

**Enjoy your SonicDNA dashboard with real Spotify data!** 🎵

---

Last Updated: May 20, 2026
