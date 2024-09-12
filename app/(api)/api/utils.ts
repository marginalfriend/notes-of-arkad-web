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
	const accountId = request.headers.get("accountId") as string;
	console.log("Account ID: ", accountId);

	const account = await prisma.account.findUnique({
		where: {
			id: accountId,
		}
	})
	console.log("Account: ", account)

	return account
}