import { NextResponse } from "next/server";
import { getMockDashboardData } from "@/lib/mockData";
import { computeAllAnalytics } from "@/lib/analytics";
import { refreshAccessToken } from "@/lib/spotify";

// ── Safely force dynamic rendering (no caching) ──
export const dynamic = "force-dynamic";

/**
 * Fetch a single Spotify endpoint. Returns { items: [] } on failure
 * so we never crash the aggregated pipeline.
 */
async function safeFetchSpotify(endpoint, accessToken) {
  try {
    const res = await fetch(`https://api.spotify.com/v1${endpoint}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
    if (!res.ok) {
      const errorBody = await res.text();
      console.error(`Spotify ${endpoint} returned ${res.status} ${res.statusText}:`, errorBody);
      return { items: [] };
    }
    return await res.json();
  } catch (err) {
    console.error(`Spotify fetch error for ${endpoint}:`, err?.message || err);
    return { items: [] };
  }
}

/**
 * Attempt to refresh the access token.
 * Returns { accessToken, cookies[] } or null.
 */
async function tryRefreshToken(refreshToken) {
  try {
    const tokenData = await refreshAccessToken(refreshToken);
    if (!tokenData.access_token) return null;

    const newCookies = [
      {
        name: "spotify_access_token",
        value: tokenData.access_token,
        maxAge: tokenData.expires_in || 3600,
      },
    ];
    if (tokenData.refresh_token) {
      newCookies.push({
        name: "spotify_refresh_token",
        value: tokenData.refresh_token,
        maxAge: 60 * 60 * 24 * 30,
      });
    }
    return { accessToken: tokenData.access_token, cookies: newCookies };
  } catch (err) {
    console.error("Token refresh failed:", err.message);
    return null;
  }
}

/**
 * Apply cookies to a NextResponse.
 */
function applyCookies(response, cookieList) {
  for (const c of cookieList) {
    response.cookies.set(c.name, c.value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: c.maxAge,
      path: "/",
    });
  }
}

function mockResponse() {
  const mockData = getMockDashboardData();
  mockData.isMock = true;
  return NextResponse.json(mockData);
}

export async function GET(request) {
  try {
    let accessToken = request.cookies.get("spotify_access_token")?.value;
    const refreshToken = request.cookies.get("spotify_refresh_token")?.value;
    let pendingCookies = [];

    console.log("Dashboard token check:", {
      hasAccessToken: !!accessToken,
      accessTokenLength: accessToken?.length || 0,
      hasRefreshToken: !!refreshToken,
      refreshTokenLength: refreshToken?.length || 0,
    });

    // ── If no access token but we have a refresh token, try refreshing ──
    if (!accessToken && refreshToken) {
      console.warn("No access token present, attempting refresh using refresh token");
      const refreshed = await tryRefreshToken(refreshToken);
      if (refreshed) {
        accessToken = refreshed.accessToken;
        pendingCookies = refreshed.cookies;
      } else {
        console.error("Refresh token exchange failed or returned no access token");
      }
    }

    if (!accessToken) {
      console.error("No Spotify access token available in /api/dashboard. Returning mock data fallback.");
      return mockResponse();
    }

    // ── Test the token by fetching profile ──
    let profileRes = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    // ── If 401, try refreshing ONCE ──
    if (profileRes.status === 401 && refreshToken) {
      const refreshed = await tryRefreshToken(refreshToken);
      if (refreshed) {
        accessToken = refreshed.accessToken;
        pendingCookies = refreshed.cookies;
        profileRes = await fetch("https://api.spotify.com/v1/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
          cache: "no-store",
        });
      }
    }

    // ── Still failing? Log full response body and return an explicit error ──
    if (!profileRes.ok) {
      const bodyText = await profileRes.text();
      console.error("Profile fetch failed with status", profileRes.status, profileRes.statusText, "body:", bodyText);
      console.warn("Falling back to mock dashboard data due to Spotify profile fetch failure.");
      return mockResponse();
    }

    const profile = await profileRes.json();

    // ── Fetch all data in parallel ──
    const [
      artistsShort, artistsMedium, artistsLong,
      tracksShort, tracksMedium, tracksLong,
      recentlyPlayed,
    ] = await Promise.all([
      safeFetchSpotify("/me/top/artists?time_range=short_term&limit=20", accessToken),
      safeFetchSpotify("/me/top/artists?time_range=medium_term&limit=20", accessToken),
      safeFetchSpotify("/me/top/artists?time_range=long_term&limit=20", accessToken),
      safeFetchSpotify("/me/top/tracks?time_range=short_term&limit=20", accessToken),
      safeFetchSpotify("/me/top/tracks?time_range=medium_term&limit=20", accessToken),
      safeFetchSpotify("/me/top/tracks?time_range=long_term&limit=20", accessToken),
      safeFetchSpotify("/me/player/recently-played?limit=50", accessToken),
    ]);

    // ── Fetch audio features for medium-term tracks ──
    const trackIds = (tracksMedium.items || [])
      .map((t) => t.id)
      .filter(Boolean)
      .join(",");

    let audioFeatures = [];
    if (trackIds) {
      try {
        const afRes = await fetch(
          `https://api.spotify.com/v1/audio-features?ids=${trackIds}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            cache: "no-store",
          }
        );
        if (afRes.ok) {
          const afData = await afRes.json();
          audioFeatures = (afData.audio_features || []).filter(Boolean);
        }
      } catch (err) {
        console.error("Audio features fetch error:", err.message);
      }
    }

    // ── Compute analytics from real data ──
    const artists = {
      short_term: artistsShort,
      medium_term: artistsMedium,
      long_term: artistsLong,
    };
    const tracks = {
      short_term: tracksShort,
      medium_term: tracksMedium,
      long_term: tracksLong,
    };
    const analytics = computeAllAnalytics(
      artistsMedium,
      tracksMedium,
      audioFeatures,
      recentlyPlayed
    );

    // ── Build response with real data ──
    const payload = {
      profile,
      artists,
      tracks,
      audioFeatures,
      recentlyPlayed,
      analytics,
      isMock: false,
    };

    const response = NextResponse.json(payload);

    // Attach any refreshed token cookies
    if (pendingCookies.length > 0) {
      applyCookies(response, pendingCookies);
    }

    return response;
  } catch (error) {
    console.error("Dashboard API unhandled error:", error);
    return mockResponse();
  }
}
