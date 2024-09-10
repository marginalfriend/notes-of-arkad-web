import { NextRequest, NextResponse } from "next/server";
import { verifyRefreshToken } from "./lib/auth";
import { LOGIN, REGISTER } from "./constants/routes";

// 1. Specify protected and public routes
const protectedRoutes = ["/dashboard"];
const publicRoutes = [LOGIN, REGISTER, "/"];

export default async function middleware(req: NextRequest) {
	// 2. Check if the current route is protected or public
	const path = req.nextUrl.pathname;
	const isProtectedRoute = protectedRoutes.includes(path);
	const isPublicRoute = publicRoutes.includes(path);

	// Check for the refresh token in cookies
	const refreshToken = req.cookies.get("refreshToken")?.value;

	// For protected routes, redirect to login if no refresh token
	if (isProtectedRoute && !refreshToken) {
		return NextResponse.redirect(new URL(LOGIN, req.nextUrl));
	}

	// For public routes, redirect to dashboard if refresh token is valid
	if (isPublicRoute && refreshToken && !path.startsWith("/dashboard")) {
		return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
	}

	return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
	matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
