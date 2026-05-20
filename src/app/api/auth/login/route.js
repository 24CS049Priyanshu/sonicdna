import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { generatePKCE, getAuthUrl } from "@/lib/spotify";

// Ensure this route is never cached
export const dynamic = "force-dynamic";

const BASE_URL = "https://sonicdna.vercel.app";

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;

  console.log("[LOGIN] SPOTIFY_CLIENT_ID set:", !!clientId);

  if (!clientId) {
    console.warn("[LOGIN] No SPOTIFY_CLIENT_ID. Redirecting to dashboard with mock data.");
    return NextResponse.redirect(new URL("/dashboard", BASE_URL));
  }

  try {
    const { codeVerifier, codeChallenge } = await generatePKCE();
    const authUrl = getAuthUrl(codeChallenge);

    console.log("[LOGIN] Setting cookie spotify_code_verifier, length:", codeVerifier.length);

    // Store code_verifier in HTTP-only cookie using next/headers
    const cookieStore = await cookies();
    cookieStore.set("spotify_code_verifier", codeVerifier, {
      httpOnly: true,
      secure: true,          // Always secure in production
      sameSite: "lax",       // MUST be lax — strict breaks cross-site OAuth redirects
      maxAge: 600,           // 10 minutes
      path: "/",             // Must be global path
    });

    return NextResponse.redirect(authUrl);
  } catch (err) {
    console.error("[LOGIN] Login route error:", err);
    return NextResponse.redirect(new URL("/?error=login_failed", BASE_URL));
  }
}
