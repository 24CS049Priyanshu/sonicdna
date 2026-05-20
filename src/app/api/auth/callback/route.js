import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { exchangeCode } from "@/lib/spotify";

// Ensure this route is never cached
export const dynamic = "force-dynamic";

const BASE_URL = "https://sonicdna.vercel.app";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  // Debug log — visible in Vercel function logs
  console.log("[CALLBACK]", {
    code: code?.slice(0, 8) + "...",
    error,
    url: request.url,
  });

  // ── Spotify denied or user cancelled ──
  if (error) {
    console.error("[CALLBACK] Spotify auth error:", error);
    return NextResponse.redirect(new URL(`/?error=${encodeURIComponent(error)}`, BASE_URL));
  }

  // ── No authorization code returned ──
  if (!code) {
    console.error("[CALLBACK] No authorization code in callback URL");
    return NextResponse.redirect(new URL("/?error=no_code", BASE_URL));
  }

  // ── Retrieve the PKCE code_verifier from the cookie ──
  const cookieStore = await cookies();
  const codeVerifier = cookieStore.get("spotify_code_verifier")?.value;

  console.log("[CALLBACK] code_verifier found:", !!codeVerifier, "length:", codeVerifier?.length);

  if (!codeVerifier) {
    console.error("[CALLBACK] No code_verifier cookie found — PKCE session expired or cookie dropped");
    return NextResponse.redirect(new URL("/?error=session_expired", BASE_URL));
  }

  try {
    // exchangeCode uses the same REDIRECT_URI constant as getAuthUrl
    const tokenData = await exchangeCode(code, codeVerifier);

    // Check for Spotify error in the token response body
    if (tokenData.error) {
      console.error("[CALLBACK] Spotify token error:", tokenData.error, tokenData.error_description);
      return NextResponse.redirect(
        new URL(`/?error=${encodeURIComponent(tokenData.error)}`, BASE_URL)
      );
    }

    console.log("[CALLBACK] Token exchange success, setting auth cookies");

    // ── Success! Store tokens ──
    cookieStore.set("spotify_access_token", tokenData.access_token, {
      httpOnly: true,
      secure: true,        // Always secure
      sameSite: "lax",
      maxAge: tokenData.expires_in || 3600,
      path: "/",           // Global path — required for /api/dashboard to read it
    });

    if (tokenData.refresh_token) {
      cookieStore.set("spotify_refresh_token", tokenData.refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });
    }

    // Clear the code verifier — it's single-use
    cookieStore.set("spotify_code_verifier", "", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    return NextResponse.redirect(new URL("/dashboard", BASE_URL));
  } catch (err) {
    console.error("[CALLBACK] Token exchange error:", err.message);
    return NextResponse.redirect(new URL("/?error=token_exchange_failed", BASE_URL));
  }
}
