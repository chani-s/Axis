import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET_KEY = "m10r07w24";

function isTokenValid(token: string): boolean {
  const decoded = decodeToken(token);
  if (decoded) {
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp !== undefined && decoded.exp > now;
  }
  return false;
}

function decodeToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.decode(token);
    console.log("Decoded Token:", decoded);  // Log the decoded token
    if (typeof decoded === "object" && decoded !== null) {
      return decoded as JwtPayload;
    }
    return null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const path = url.pathname;

  const authToken = req.cookies.get("authToken");

  // Skip auth check for login and signup
  if (path === "/api/login" || path === "/api/signup") {
    return NextResponse.next();
  }

  if (!authToken || !isTokenValid(authToken.toString())) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Decode the authToken to extract userId
  const decodedToken = decodeToken(authToken.toString());
  if (decodedToken?.userId) {
    // Clone the request and add the userId header
   req.headers.set("X-User-Id", decodedToken.userId);

    // Pass the cloned request to the server with the new header
    const res = NextResponse.next();
    return res;
  }
  return NextResponse.redirect(new URL("/login", req.url)); // If no userId, redirect
}

export const config = {
  matcher: ["/:path*"],
};
