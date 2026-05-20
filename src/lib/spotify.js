// ═══════════════════════════════════════════════
// SonicDNA — Spotify OAuth PKCE Utilities
// Single source of truth for redirect_uri — used
// identically in BOTH getAuthUrl and exchangeCode.
// ═══════════════════════════════════════════════

const SCOPES = "user-read-private user-read-email user-top-read user-read-recently-played";

/**
 * Always returns the canonical production redirect URI.
 * Derived once here, used everywhere — never re-derived from request headers.
 */
function getRedirectUri() {
  const base = (process.env.NEXT_PUBLIC_BASE_URL || "https://sonicdna.vercel.app").replace(/\/$/, "");
  return `${base}/api/auth/callback`;
}

// ── PKCE helpers ──

function generateRandomString(length) {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_.-~";
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

async function sha256(plain) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return await crypto.subtle.digest("SHA-256", data);
}

function base64urlEncode(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Generate a PKCE code_verifier and code_challenge pair.
 */
export async function generatePKCE() {
  const codeVerifier = generateRandomString(64);
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64urlEncode(hashed);
  return { codeVerifier, codeChallenge };
}

/**
 * Build the Spotify authorization URL with PKCE challenge.
 * Uses getRedirectUri() — the single source of truth.
 */
export function getAuthUrl(codeChallenge) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  if (!clientId) throw new Error("SPOTIFY_CLIENT_ID is not set");

  const redirectUri = getRedirectUri();
  console.log("[getAuthUrl] redirect_uri =", redirectUri);

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope: SCOPES,
    redirect_uri: redirectUri,     // ← single source of truth
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
}

/**
 * Exchange an authorization code for access + refresh tokens.
 * Uses getRedirectUri() — IDENTICAL to getAuthUrl — byte-for-byte match guaranteed.
 */
export async function exchangeCode(code, codeVerifier) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET is not set");
  }

  const redirectUri = getRedirectUri();
  console.log("[exchangeCode] redirect_uri =", redirectUri);

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,     // ← identical to getAuthUrl — guaranteed by using same function
    client_id: clientId,
    code_verifier: codeVerifier,
  });

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`,
    },
    body: body.toString(),
  });

  const responseText = await res.text();
  if (!res.ok) {
    console.error(`[exchangeCode] Token exchange failed (${res.status}):`, responseText);
    throw new Error(`Token exchange failed: ${res.status} — ${responseText}`);
  }

  return JSON.parse(responseText);
}

/**
 * Refresh an expired access token using a refresh token.
 */
export async function refreshAccessToken(refreshToken) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET is not set");
  }

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: clientId,
  });

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`,
    },
    body: body.toString(),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    console.error(`[refreshAccessToken] Token refresh failed (${res.status}):`, errorBody);
    throw new Error(`Token refresh failed: ${res.status}`);
  }

  return res.json();
}
