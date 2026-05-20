# Spotify OAuth Setup Guide — SonicDNA

## ✅ What's Already Implemented

Your application has a **complete, production-ready Spotify OAuth PKCE flow**:

### 1. **Authentication Routes** ✓
- `/api/auth/login` — Initiates OAuth with PKCE challenge
- `/api/auth/callback` — Secure token exchange
- `/api/auth/logout` — Clean session termination

### 2. **PKCE Implementation** ✓
- 64-character code verifier generation
- SHA-256 hashing
- Base64 URL-safe encoding
- Secure verification on callback

### 3. **Token Management** ✓
- HTTP-only cookie storage
- Automatic token refresh on 401
- 30-day refresh token rotation
- Graceful fallback to mock data

### 4. **Data Fetching** ✓
- Real Spotify user profile
- Top artists (short/medium/long term)
- Top tracks (short/medium/long term)
- Recently played tracks
- Audio features analysis
- Error handling with safe fallbacks

### 5. **UI Integration** ✓
- Existing SonicDNA dashboard components
- Real data population
- Demo mode with mock data
- Navbar with user profile display
- Logout functionality

---

## 🚀 Setup Instructions

### Step 1: Create Spotify Developer App

1. Go to **[Spotify Developer Dashboard](https://developer.spotify.com/dashboard)**
2. Log in or create a Spotify account (free)
3. Click **Create an App**
4. Accept terms, create app
5. Go to your app's settings
6. Copy your **Client ID** and **Client Secret**

### Step 2: Configure Redirect URI

In your Spotify app settings, add this redirect URI:

```
http://127.0.0.1:3000/api/auth/callback
```

⚠️ **Important**: Spotify blocks `localhost`. Use `127.0.0.1` instead.

### Step 3: Set Environment Variables

Create or update `.env.local` in your project root:

```env
# Spotify OAuth Credentials
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here

# Base URL (must use 127.0.0.1, not localhost)
NEXT_PUBLIC_BASE_URL=http://127.0.0.1:3000
```

### Step 4: Verify Installation

```bash
# The dev server should already be running
# Navigate to http://127.0.0.1:3000 in your browser
```

---

## 🔍 How the OAuth Flow Works

### 1. User clicks "Connect with Spotify"
```
GET /api/auth/login
```

### 2. App generates PKCE challenge
```
code_verifier (64 chars)
code_challenge (SHA-256 hash, base64 URL-safe)
```

### 3. User redirected to Spotify
```
https://accounts.spotify.com/authorize?
  client_id=...
  code_challenge=...
  redirect_uri=http://127.0.0.1:3000/api/auth/callback
```

### 4. User grants permissions
Scopes requested:
- `user-read-private` — Read user profile
- `user-read-email` — Read email address
- `user-top-read` — Read top artists/tracks
- `user-read-recently-played` — Read recently played

### 5. Spotify redirects with auth code
```
GET /api/auth/callback?code=...&state=...
```

### 6. App exchanges code for tokens
```
POST https://accounts.spotify.com/api/token
  grant_type: authorization_code
  code: <from callback>
  code_verifier: <from cookie>
  client_id: <env var>
  client_secret: <env var>
```

### 7. Tokens stored in HTTP-only cookies
```
spotify_access_token (1 hour expiry)
spotify_refresh_token (30 days expiry)
```

### 8. Dashboard loads real Spotify data
```
GET /api/dashboard
```

Fetches:
- User profile (`/v1/me`)
- Top artists — 3 time ranges (`/v1/me/top/artists`)
- Top tracks — 3 time ranges (`/v1/me/top/tracks`)
- Recently played (`/v1/me/player/recently-played`)
- Audio features (`/v1/audio-features`)

### 9. Dashboard renders real analytics
All SonicDNA components display actual user data:
- Genre distribution from top artists
- Audio mood analysis from track features
- Listening heatmap from recently played
- Top artists and tracks cards
- Listening statistics

---

## 🛡️ Security Features

### ✓ PKCE (Proof Key for Code Exchange)
Prevents authorization code interception attacks

### ✓ HTTP-Only Cookies
Client-side JavaScript cannot access tokens

### ✓ Secure Flag (Production)
Cookies only sent over HTTPS in production

### ✓ SameSite=Lax
Protection against CSRF attacks

### ✓ Token Refresh
Automatic refresh on 401 without user interaction

### ✓ Graceful Fallback
Uses mock data if Spotify API is unavailable

---

## 🧪 Testing the Flow

### Test with Demo Data
```
Click "Try with demo data →"
```

### Test with Real Spotify
1. Click "Connect with Spotify"
2. Log in to Spotify
3. Grant permissions
4. Dashboard loads with real data

### Test Token Refresh
1. Let tokens expire (in development)
2. Navigate to dashboard
3. API automatically refreshes token
4. No re-login required

### Test Logout
1. Click logout in navbar
2. Tokens cleared
3. Redirected to home page
4. Next dashboard load shows demo data

---

## 📊 API Endpoints

### Authentication
```
GET /api/auth/login
GET /api/auth/callback?code=...
GET /api/auth/logout
```

### Data Fetching
```
GET /api/dashboard
Response: {
  profile: { display_name, email, image, ... },
  artists: { short_term, medium_term, long_term },
  tracks: { short_term, medium_term, long_term },
  audioFeatures: [ { danceability, energy, ... } ],
  recentlyPlayed: { items: [...] },
  analytics: { topGenre, moodLabel, auraColors, ... }
}
```

---

## ⚙️ Environment Configuration

### Development (.env.local)
```env
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
NEXT_PUBLIC_BASE_URL=http://127.0.0.1:3000
```

### Production (.env.production)
```env
SPOTIFY_CLIENT_ID=your_production_client_id
SPOTIFY_CLIENT_SECRET=your_production_client_secret
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

Don't forget to update Spotify redirect URI in dashboard:
```
https://yourdomain.com/api/auth/callback
```

---

## 🐛 Troubleshooting

### "Spotify is not configured"
**Problem**: SPOTIFY_CLIENT_ID is not set
**Solution**: Copy Client ID from Spotify dashboard to `.env.local`

### "Redirect URI mismatch"
**Problem**: Callback URL doesn't match Spotify settings
**Solution**: 
- Use exactly: `http://127.0.0.1:3000/api/auth/callback`
- Not: `http://localhost:3000/...`

### "No code verifier in cookie"
**Problem**: PKCE flow interrupted
**Solution**: Check browser cookies are enabled

### "App shows demo data instead of real data"
**Problem**: Access token expired or API error
**Solution**: 
- Check browser console for errors
- Log out and log in again
- Verify Spotify API status: https://developer.spotify.com/status

### "Hydration mismatch warning"
**Problem**: Browser extension modifying DOM
**Solution**: Disable extensions or ignore warning (cosmetic only)

---

## 🔗 Useful Links

- **Spotify Developer Dashboard**: https://developer.spotify.com/dashboard
- **Spotify Web API Docs**: https://developer.spotify.com/documentation/web-api
- **OAuth 2.0 PKCE**: https://tools.ietf.org/html/rfc7636
- **Next.js Auth Guide**: https://nextjs.org/docs/app/building-your-application/authentication

---

## 📝 File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.js      ← OAuth initiation
│   │   │   ├── callback/route.js   ← Token exchange
│   │   │   └── logout/route.js     ← Session termination
│   │   └── dashboard/route.js      ← Data aggregation
│   ├── dashboard/
│   │   ├── layout.js               ← Data fetching context
│   │   └── page.js                 ← Dashboard UI
│   └── page.js                     ← Landing page
├── lib/
│   └── spotify.js                  ← PKCE & token functions
└── components/
    ├── Navbar.jsx                  ← User profile & logout
    ├── ArtistCard.jsx
    ├── TrackCard.jsx
    ├── GenreChart.jsx
    └── ... (other components)
```

---

## ✨ Next Steps

1. **Get Spotify credentials** from developer.spotify.com
2. **Update .env.local** with your credentials
3. **Set redirect URI** in Spotify dashboard
4. **Start dev server**: `npm run dev`
5. **Test login**: http://127.0.0.1:3000
6. **Connect real Spotify account**
7. **Watch dashboard populate** with real data

---

**Status**: ✅ Production-ready Spotify OAuth PKCE implementation

**Last Updated**: May 20, 2026
