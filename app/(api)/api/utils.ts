import { verifyAccessToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export const handleError = (error: any) => {
	if (error instanceof ZodError) {
		return NextResponse.json({ error: error.issues }, { status: 400 })
	} else {
		return NextResponse.json({ error: "Internal server error" }, { status: 500 })
	}
}

export const getAccount = async (request: NextRequest) => {
	const token = request.headers.get("Authorization") as string;
	console.log("[UTILS | getAccount] token: ", token);

	const payload = await verifyAccessToken(token)
	console.log("[UTILS | getAccount] payload: ", payload);

	if (!payload) return null;

	const id = payload.id;

	const account = await prisma.account.findUnique({
		where: {
			id,
		}
	})
	console.log("[UTILS | getAccount] account: ", account)

	return account
}