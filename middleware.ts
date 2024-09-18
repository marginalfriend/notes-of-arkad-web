import { NextRequest, NextResponse } from "next/server";
import { ENTRIES, LOGIN, REGISTER } from "./constants/routes";

// 1. Specify protected and public routes
const protectedRoutes = ["/entries", "/reports"];
const authRoutes = [LOGIN, REGISTER];

export default async function middleware(req: NextRequest) {
	// 2. Check if the current route is protected or public
	const path = req.nextUrl.pathname;
	const isProtectedRoute = protectedRoutes.includes(path);
	const isAuthRoutes = authRoutes.includes(path);

	// Check for the refresh token in cookies
	const refreshToken = req.cookies.get("refreshToken")?.value;
	console.log("[MIDDLEWARE] Refresh token: ", !refreshToken)

	// For protected routes, redirect to login if no refresh token
	if (isProtectedRoute && !refreshToken) {
		return NextResponse.redirect(new URL(LOGIN, req.nextUrl));
	}

	// For public routes, redirect to dashboard if refresh token is valid
	if (isAuthRoutes && refreshToken) {
		return NextResponse.redirect(new URL("/entries", req.nextUrl));
	}

	return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
	matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
