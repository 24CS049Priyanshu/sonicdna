import { NextResponse } from "next/server";
import { getMockDashboardData } from "@/lib/mockData";
import { computeAllAnalytics } from "@/lib/analytics";

export async function GET(request) {
  try {
    // Check for auth cookies
    const accessToken = request.cookies.get("spotify_access_token")?.value;

    if (accessToken) {
      // Try fetching from Spotify
      try {
        const headers = { Authorization: `Bearer ${accessToken}` };
        const base = "https://api.spotify.com/v1";

        const [profile, artistsShort, artistsMedium, artistsLong, tracksShort, tracksMedium, tracksLong, recentlyPlayed] =
          await Promise.all([
            fetch(`${base}/me`, { headers }).then((r) => r.json()),
            fetch(`${base}/me/top/artists?time_range=short_term&limit=20`, { headers }).then((r) => r.json()),
            fetch(`${base}/me/top/artists?time_range=medium_term&limit=20`, { headers }).then((r) => r.json()),
            fetch(`${base}/me/top/artists?time_range=long_term&limit=20`, { headers }).then((r) => r.json()),
            fetch(`${base}/me/top/tracks?time_range=short_term&limit=20`, { headers }).then((r) => r.json()),
            fetch(`${base}/me/top/tracks?time_range=medium_term&limit=20`, { headers }).then((r) => r.json()),
            fetch(`${base}/me/top/tracks?time_range=long_term&limit=20`, { headers }).then((r) => r.json()),
            fetch(`${base}/me/player/recently-played?limit=50`, { headers }).then((r) => r.json()),
          ]);

        // Fetch audio features for medium-term tracks
        const trackIds = (tracksMedium.items || []).map((t) => t.id).join(",");
        let audioFeatures = [];
        if (trackIds) {
          const afRes = await fetch(`${base}/audio-features?ids=${trackIds}`, { headers });
          const afData = await afRes.json();
          audioFeatures = afData.audio_features || [];
        }

        const artists = { short_term: artistsShort, medium_term: artistsMedium, long_term: artistsLong };
        const tracks = { short_term: tracksShort, medium_term: tracksMedium, long_term: tracksLong };
        const analytics = computeAllAnalytics(artistsMedium, tracksMedium, audioFeatures, recentlyPlayed);

        return NextResponse.json({ profile, artists, tracks, audioFeatures, recentlyPlayed, analytics });
      } catch (spotifyError) {
        console.error("Spotify API error, falling back to mock:", spotifyError);
      }
    }

    // Fallback to mock data — use pre-computed analytics for nicer demo
    const mockData = getMockDashboardData();
    return NextResponse.json(mockData);
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(getMockDashboardData());
  }
}
