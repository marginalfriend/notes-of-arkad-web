import 'server-only'
import { NextRequest, NextResponse } from "next/server";
import { verifyRefreshToken, generateTokens } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
	const refreshToken = request.cookies.get("refreshToken")?.value;
	console.log('[REFRESH ENDPOINT] Refresh token: ', refreshToken)

	if (!refreshToken) {
		return NextResponse.json({ error: "No refresh token" }, { status: 401 });
	}

	const payload = await verifyRefreshToken(refreshToken);

	if (!payload) {
		return NextResponse.json(
			{ error: "Invalid refresh token" },
			{ status: 401 }
		);
	}

	const user = await prisma.account.findUnique({ where: { id: payload.id } });

	if (!user) {
		const response = NextResponse.json({ error: "User not found" }, { status: 401 });
		response.cookies.delete("refreshToken")
		return response
	}

	const { accessToken, refreshToken: newRefreshToken } = await generateTokens({
		id: user.id,
	});

	const response = NextResponse.json({ accessToken });

	response.cookies.set("refreshToken", newRefreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 7 * 24 * 60 * 60, // 7 days
		path: "/",
	});

	response.cookies.set("accessToken", accessToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 60 * 60, // 1 hour
		path: "/",
	})

	return response;
}
