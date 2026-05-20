# Planning & Architecture Log

## Initial Architecture Phase
- Decided on Next.js 15 App Router for performance and server components.
- Tailwind CSS v4 chosen for rapid styling and granular control.
- Designed a 3-page "cinematic" architecture (Landing -> Dashboard -> Personality) to reduce routing overhead and maximize visual impact.

## Spotify API Constraints
- Researched the February 2026 Spotify Web API deprecations.
- Confirmed PKCE OAuth flow is now mandatory.
- Migrated away from deprecated `top-tracks` by artist endpoints to `me/top/artists` and `me/top/tracks` endpoints.

## Fallback Strategy
- Implemented a robust mock data layer (`mockData.js`) that mimics the exact shape of Spotify API responses.
- Ensures the demo is 100% reliable even if Spotify rate-limits the app during judging.
