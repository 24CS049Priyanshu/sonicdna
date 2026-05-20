import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { generatePKCE, getAuthUrl } from "@/lib/spotify";

// Ensure this route is never cached
export const dynamic = "force-dynamic";

const CANONICAL_HOST = "sonicdna.vercel.app";
const BASE_URL = `https://${CANONICAL_HOST}`;

export async function GET(request) {
  // ── Guard: if request comes from a preview URL, bounce to production ──
  const requestHost = request.headers.get("host") || "";
  if (requestHost !== CANONICAL_HOST) {
    console.log(`[LOGIN] Preview host detected (${requestHost}), redirecting to production`);
    return NextResponse.redirect(`${BASE_URL}/api/auth/login`);
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  console.log("[LOGIN] SPOTIFY_CLIENT_ID set:", !!clientId, "| host:", requestHost);

  if (!clientId) {
    console.warn("[LOGIN] No SPOTIFY_CLIENT_ID. Redirecting to dashboard with mock data.");
    return NextResponse.redirect(new URL("/dashboard", BASE_URL));
  }

  try {
    const { codeVerifier, codeChallenge } = await generatePKCE();
    const authUrl = getAuthUrl(codeChallenge);

    console.log("[LOGIN] Setting cookie spotify_code_verifier, length:", codeVerifier.length);

    const cookieStore = await cookies();

    // sameSite: "lax" is REQUIRED — "strict" blocks cookie on Spotify → your-app redirect
    cookieStore.set("spotify_code_verifier", codeVerifier, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 600, // 10 minutes
      path: "/",   // global — never set domain explicitly on Vercel
    });

    return NextResponse.redirect(authUrl);
  } catch (err) {
    console.error("[LOGIN] Login route error:", err);
    return NextResponse.redirect(new URL("/?error=login_failed", BASE_URL));
  }
}
