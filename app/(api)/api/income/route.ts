import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAccount, handleError } from "../utils";

const entryRequestSchema = z.object({
	amount: z.number({ message: "Invalid amount type" }).nonnegative({ message: "Number must be positive" }),
	date: z.coerce.date({ message: "Invalid date format" }),
	categoryId: z.string({ message: "Invalid category format" }),
	description: z.optional(z.string({ message: "Invalid description type" })),
})

export const POST = async (request: NextRequest) => {
	try {
		const entryRequest = await request.json()
		console.log("Entry request: ", entryRequest)

		const validatedData = entryRequestSchema.parse(entryRequest);
		console.log("Entry request: ", entryRequest);

		const account = await getAccount(request)
		console.log("Account: ", account);

		if (!account) {
			console.log("No account found!");
			return NextResponse.json({ error: "Account not found" }, { status: 401 });
		}

		const data = await prisma.income.create({
			data: {
				categoryId: validatedData.categoryId,
				amount: validatedData.amount,
				date: validatedData.date,
				description: validatedData.description,
			}
		});
		console.log("Response: ", data);

		return NextResponse.json({ data }, { status: 201 })

	} catch (error: any) {
		return handleError(error)
	}
}