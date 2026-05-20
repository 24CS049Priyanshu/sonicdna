import { NextResponse } from "next/server";

const rawBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:3000";
const BASE_URL = rawBaseUrl.replace(/\/$/, "");

export async function GET() {
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
