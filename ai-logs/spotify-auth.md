# SonicDNA AI Development Log: Spotify Auth

## Goal
Implement secure, robust Spotify authentication using the PKCE flow.

## AI Usage
Used AI assistance for:
- Spotify OAuth PKCE setup
- Token exchange logic
- Handling HTTP-only cookies in Next.js App Router
- Refresh token rotation

## Example Prompt
"The Spotify OAuth flow is currently blocked because the app is requesting Spotify Premium playback scopes. Fix the authentication system to only request user-read-private, user-read-email, user-top-read, and user-read-recently-played."

## Outcome
Successfully implemented the `getAuthUrl`, `generatePKCE`, and `exchangeCode` functions in `src/lib/spotify.js`. We forced dynamic rendering on the API routes to prevent Next.js from caching the authorization redirects and PKCE challenges.

## Notes
Spotify's API requires `127.0.0.1:3000` instead of `localhost`. We successfully restricted scopes so that free accounts can log in and view their analytics without needing premium playback privileges.
