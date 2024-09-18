import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAccount, handleError } from "../utils";
import { revalidatePath } from "next/cache";

const entryRequestSchema = z.object({
	amount: z.coerce.number({ message: "Invalid amount type" }).nonnegative({ message: "Number must be positive" }),
	date: z.coerce.date({ message: "Invalid date format" }),
	categoryId: z.string({ message: "Invalid category format" }),
	description: z.optional(z.string({ message: "Invalid description type" })),
})

export const POST = async (request: NextRequest) => {
	try {
		const entryRequest = await request.json()

		const validatedData = entryRequestSchema.parse(entryRequest);

		const account = await getAccount(request)

		if (!account) {
			console.log("No account found!");
			return NextResponse.json({ error: "Account not found" }, { status: 401 });
		}

		const data = await prisma.expense.create({
			data: {
				categoryId: validatedData.categoryId,
				amount: validatedData.amount,
				date: validatedData.date,
				description: validatedData.description,
			}
		});

		revalidatePath("/(tabs)/entries", "page")

		return NextResponse.json({ data }, { status: 201 })

	} catch (error: any) {
		console.log("[EXPENSE ENDPOINT] Error: ", error)
		return handleError(error)
	}
}