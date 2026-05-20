import { NextResponse } from "next/server";
import { generatePKCE, getAuthUrl } from "@/lib/spotify";

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;

  if (!clientId) {
    // No Spotify credentials configured — redirect to dashboard with mock data
    return NextResponse.redirect(new URL("/dashboard", process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:3000"));
  }

  const { codeVerifier, codeChallenge } = await generatePKCE();
  const authUrl = getAuthUrl(codeChallenge);

  const response = NextResponse.redirect(authUrl);

  // Store code_verifier in HTTP-only cookie
  response.cookies.set("spotify_code_verifier", codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600, // 10 minutes
    path: "/",
  });

  return response;
}
