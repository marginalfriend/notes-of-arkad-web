import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth";

// 1. Specify protected and public routes
const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/auth/login", "/auth/register", "/"];

export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // 3. Get the token from the Authorization header
  const token = req.cookies.get("refreshToken")?.value;

  // 4. Verify the token
  const user = token ? await verifyAccessToken(token) : null;

  // 5. Redirect to /auth/login if the user is not authenticated
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL("/auth/login", req.nextUrl));
  }

  // 6. Redirect to /dashboard if the user is authenticated
  if (isPublicRoute && user && !req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
