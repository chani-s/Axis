import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';  // Ensures dynamic rendering

export async function POST(req: NextRequest) {
  // Set the cookie value to null and set the expiration to 0 to clear it
  const response = NextResponse.json({ message: 'Logged out successfully' });

  // Deleting the cookie (authToken) by setting max-age to 0
  response.cookies.set("authToken", "", { maxAge: 0, path: "/" });

  return response;
}