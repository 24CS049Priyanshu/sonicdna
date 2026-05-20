import { NextResponse } from "next/server";
import { exchangeCode } from "@/lib/spotify";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:3000";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  // ── Spotify denied or user cancelled ──
  if (error) {
    console.error("Spotify auth error:", error);
    return NextResponse.redirect(new URL(`/?error=${encodeURIComponent(error)}`, BASE_URL));
  }

  // ── No authorization code returned ──
  if (!code) {
    console.error("No authorization code in callback URL");
    return NextResponse.redirect(new URL("/?error=no_code", BASE_URL));
  }

  // ── Retrieve the PKCE code_verifier from the cookie ──
  const codeVerifier = request.cookies.get("spotify_code_verifier")?.value;
  if (!codeVerifier) {
    console.error("No code_verifier cookie found — session may have expired");
    return NextResponse.redirect(new URL("/?error=session_expired", BASE_URL));
  }

  try {
    const tokenData = await exchangeCode(code, codeVerifier);

    // Check for Spotify error in the token response body
    if (tokenData.error) {
      console.error("Spotify token error:", tokenData.error, tokenData.error_description);
      return NextResponse.redirect(
        new URL(`/?error=${encodeURIComponent(tokenData.error)}`, BASE_URL)
      );
    }

    // ── Success! Store tokens and redirect to dashboard ──
    const response = NextResponse.redirect(new URL("/dashboard", BASE_URL));

    response.cookies.set("spotify_access_token", tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: tokenData.expires_in || 3600,
      path: "/",
    });

    if (tokenData.refresh_token) {
      response.cookies.set("spotify_refresh_token", tokenData.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });
    }

    // Clear the code verifier — it's single-use
    response.cookies.set("spotify_code_verifier", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Callback token exchange error:", err);
    return NextResponse.redirect(new URL("/?error=token_exchange_failed", BASE_URL));
  }
}
