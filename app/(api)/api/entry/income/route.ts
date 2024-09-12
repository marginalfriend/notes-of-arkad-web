import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

const entryRequestSchema = z.object({
	amount: z.number({ message: "Invalid amount type" }).nonnegative({ message: "Number must be positive" }),
	date: z.coerce.date({ message: "Invalid date format" }),
	categoryId: z.string({ message: "Invalid category format" }),
	description: z.nullable(z.string({ message: "Invalid description type" })),
})

// Create Income
export const POST = async (request: NextRequest) => {
	try {
		const entryRequest = request.json()
		console.log("Entry request: ", entryRequest)

		const accountId = request.headers.get("accountId") as string;
		console.log("Account ID: ", accountId);

		const validatedData = entryRequestSchema.parse(entryRequest);
		console.log("Entry request: ", entryRequest);

		const account = await prisma.account.findUnique({
			where: {
				id: accountId
			},
			include: {
				incomeCategories: {
					where: {
						id: validatedData.categoryId,
					}
				},
			}
		});
		console.log("Account: ", account);

		if (!account) {
			console.log("No account found!");
			return NextResponse.json({ error: "Account not found" }, { status: 401 });
		}

		const data = await prisma.income.create({
			data: {
				categoryId: account.incomeCategories[0].id,
				amount: validatedData.amount,
				date: validatedData.date,
				description: validatedData.description,
			}
		});
		console.log("Response: ", data);

		return NextResponse.json({ data }, { status: 201 })

	} catch (error: any) {
		if (error instanceof ZodError) {
			return NextResponse.json({ error: error.issues }, { status: 400 })
		} else {
			return NextResponse.json({ error: "Internal server error" }, { status: 500 })
		}
	}
}