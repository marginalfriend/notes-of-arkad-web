import 'server-only'
import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import prisma from "@/lib/prisma";
import { generateTokens } from "@/lib/auth";
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
	const { email, username, password } = await request.json();

	const existingUser = await prisma.account.findUnique({ where: { email } });
	if (existingUser) {
		return NextResponse.json(
			{ error: "Username already exists" },
			{ status: 400 }
		);
	}

	const hashedPassword = await hash(password, 10);

	const account = await prisma.account.create({
		data: {
			email,
			username,
			password: hashedPassword,
		},
	});

	const { accessToken, refreshToken } = await generateTokens({
		id: account.id,
	});

	const response = NextResponse.json({ accessToken });

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

	revalidatePath("/register")

	return response;
}
