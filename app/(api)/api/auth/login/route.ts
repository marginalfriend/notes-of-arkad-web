import 'server-only'
import { NextResponse } from "next/server";
import { compare } from "bcrypt";
import prisma from "@/lib/prisma";
import { generateTokens } from "@/lib/auth";
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
	const { email, password } = await request.json();

	const user = await prisma.account.findUnique({ where: { email } });

	if (!user || !(await compare(password, user.password))) {
		return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
	}

	const { accessToken, refreshToken } = await generateTokens({
		id: user.id,
		username: user.username,
	});

	const response = NextResponse.json({
		accessToken,
		user: { id: user.id, username: user.username },
	});

	response.cookies.set("refreshToken", refreshToken, {
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

	revalidatePath("/login", "page")

	return response;
}
