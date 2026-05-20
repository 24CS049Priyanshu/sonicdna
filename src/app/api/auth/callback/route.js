import { NextResponse } from "next/server";
import { exchangeCode } from "@/lib/spotify";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:3000";

  if (error) {
    return NextResponse.redirect(new URL(`/?error=${error}`, baseUrl));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/?error=no_code", baseUrl));
  }

  const codeVerifier = request.cookies.get("spotify_code_verifier")?.value;
  if (!codeVerifier) {
    return NextResponse.redirect(new URL("/?error=no_verifier", baseUrl));
  }

  try {
    const tokenData = await exchangeCode(code, codeVerifier);

    if (tokenData.error) {
      console.error("Token exchange error:", tokenData);
      return NextResponse.redirect(new URL(`/?error=${tokenData.error}`, baseUrl));
    }

    const response = NextResponse.redirect(new URL("/dashboard", baseUrl));

    // Store tokens in HTTP-only cookies
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

    // Clear the code verifier cookie
    response.cookies.delete("spotify_code_verifier");

    return response;
  } catch (err) {
    console.error("Callback error:", err);
    return NextResponse.redirect(new URL("/?error=callback_failed", baseUrl));
  }
}
