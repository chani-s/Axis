import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

const SECRET_KEY = "m10r07w24";

function isTokenValid(token: string): boolean {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp !== undefined && decoded.exp > now;
  } catch {
    return false;
  }
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const path = url.pathname;

  const authToken = req.cookies.get("authToken");
  const refreshToken = req.cookies.get("refreshToken");

  if (path === "/api/signup" || path === "/api/login") {
    return NextResponse.next();
  }

  if (!authToken || !isTokenValid(authToken.toString())) {
    if (refreshToken && isTokenValid(refreshToken.toString())) {
      const decoded = jwt.decode(refreshToken.toString()) as { userId: string };
      const newAuthToken = jwt.sign(
        { userId: decoded.userId },
        SECRET_KEY,
        { expiresIn: "1h" }
      );

      const res = NextResponse.next();
      res.cookies.set("authToken", newAuthToken, {
        httpOnly: true,
        path: "/",
      });

      return res;
    }

    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
