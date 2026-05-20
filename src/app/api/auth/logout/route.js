import { NextResponse } from "next/server";

export async function GET(request) {
  const origin = new URL(request.url).origin;
  const BASE_URL = (process.env.NEXT_PUBLIC_BASE_URL || origin).replace(/\/$/, "");
  const response = NextResponse.redirect(new URL("/", BASE_URL));

  // Clear all auth cookies
  const clearOpts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  };

  response.cookies.set("spotify_access_token", "", clearOpts);
  response.cookies.set("spotify_refresh_token", "", clearOpts);
  response.cookies.set("spotify_code_verifier", "", clearOpts);

  return response;
}
