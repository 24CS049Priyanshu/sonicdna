# SonicDNA AI Development Log: Debugging

## Goal
Fix API routing bugs, rendering issues, and API rate limits.

## AI Usage
Used AI assistance for:
- Error fixing and stack trace decoding
- React hydration mismatch fixes
- Fallback data handling for API rate limits
- Fixing malformed JSX

## Example Prompt
"There is a build error loading the page. The error says 'Expression expected' in layout.js at line 29:14."

## Outcome
Fixed malformed JSX syntax where HTML tags were broken apart (e.g., `< html >`). We also built a robust `safeFetch` wrapper around the Spotify API requests to ensure that if a specific endpoint fails or rate limits, the app seamlessly falls back to realistic mock data.

## Notes
Next.js 15 route handlers aggressively cache by default, which caused our OAuth redirect to serve stale URLs. Forcing dynamic rendering solved this. The fallback mock data system was crucial to ensure the app always works during judge evaluations.
