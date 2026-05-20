import { NextResponse } from "next/server";
import { generatePKCE, getAuthUrl } from "@/lib/spotify";

// Ensure this route is never cached
export const dynamic = "force-dynamic";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:3000";

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;

  if (!clientId) {
    // No Spotify credentials — send user to dashboard (will show mock data)
    console.warn("SPOTIFY_CLIENT_ID not set. Redirecting to dashboard with mock data.");
    return NextResponse.redirect(new URL("/dashboard", BASE_URL));
  }

  try {
    const { codeVerifier, codeChallenge } = await generatePKCE();
    const authUrl = getAuthUrl(codeChallenge);

    const response = NextResponse.redirect(authUrl);

    // Store code_verifier in HTTP-only cookie so callback can use it
    response.cookies.set("spotify_code_verifier", codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600, // 10 minutes
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Login route error:", err);
    return NextResponse.redirect(new URL("/?error=login_failed", BASE_URL));
  }
}
