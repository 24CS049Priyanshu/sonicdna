// ═══════════════════════════════════════════════
// SonicDNA — Spotify OAuth PKCE Utilities
// Handles secure authorization, token exchange,
// and token refresh against the Spotify Accounts API.
// ═══════════════════════════════════════════════

const rawBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:3000";
const BASE_URL = rawBaseUrl.replace(/\/$/, "");
const DEFAULT_REDIRECT_URI = `${BASE_URL}/api/auth/callback`;
const SCOPES = "user-read-private user-read-email user-top-read user-read-recently-played";

export function buildRedirectUri(origin) {
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || origin).replace(/\/$/, "");
  return `${baseUrl}/api/auth/callback`;
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
 */
export function getAuthUrl(codeChallenge, redirectUri = DEFAULT_REDIRECT_URI) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  if (!clientId) throw new Error("SPOTIFY_CLIENT_ID is not set");

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope: SCOPES,
    redirect_uri: redirectUri,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
}

/**
 * Exchange an authorization code for access + refresh tokens.
 */
export async function exchangeCode(code, codeVerifier, redirectUri = DEFAULT_REDIRECT_URI) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET is not set");
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
    client_id: clientId,
    code_verifier: codeVerifier,
  });

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
    },
    body: body.toString(),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    console.error(`Token exchange failed (${res.status}):`, errorBody);
    throw new Error(`Token exchange failed: ${res.status}`);
  }

  return res.json();
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

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
    },
    body: body.toString(),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    console.error(`Token refresh failed (${res.status}):`, errorBody);
    throw new Error(`Token refresh failed: ${res.status}`);
  }

  return res.json();
}
