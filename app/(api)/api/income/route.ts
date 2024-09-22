import 'server-only'
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAccount, handleError } from "../utils";
import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";

const createIncomeSchema = z.object({
	amount: z.coerce.number({ message: "Invalid amount type" }).nonnegative({ message: "Number must be positive" }),
	date: z.coerce.date({ message: "Invalid date format" }),
	categoryId: z.string({ message: "Invalid category format" }),
	description: z.optional(z.string({ message: "Invalid description type" })),
})

const updateIncomeSchema = createIncomeSchema.extend({
	id: z.string()
})

export const POST = async (request: NextRequest) => {
	try {
		const entryRequest = await request.json()

		const validatedData = createIncomeSchema.parse(entryRequest);

		const token = headers().get("Authorization");
		const account = await getAccount(token);

		if (!account) {
			return NextResponse.json({ error: "Account not found" }, { status: 401 });
		}

		const data = await prisma.income.create({
			data: {
				categoryId: validatedData.categoryId,
				amount: validatedData.amount,
				date: validatedData.date,
				description: validatedData.description,
			},
			include: {
				category: {
					select: {
						id: true,
						title: true
					}
				}
			}
		});

		const { id, date, amount, category, description } = data

		const entry = {
			id,
			date,
			amount,
			category,
			description,
			incomeExpense: "income",
		}

		const response = NextResponse.json({ entry }, { status: 201 })

		revalidateTag("entries")

		return response

	} catch (error: any) {
		return handleError(error)
	}
}

export const PUT = async (request: NextRequest) => {
	try {
		const entryRequest = await request.json()

		const validatedData = updateIncomeSchema.parse(entryRequest);

		const token = headers().get("Authorization");
		const account = await getAccount(token);

		if (!account) {
			return NextResponse.json({ error: "Account not found" }, { status: 401 });
		}

		const data = await prisma.income.update({
			where: {
				id: validatedData.id,
			},
			data: {
				categoryId: validatedData.categoryId,
				amount: validatedData.amount,
				date: validatedData.date,
				description: validatedData.description,
			},
			include: {
				category: {
					select: {
						id: true,
						title: true
					}
				}
			}
		});

		const { id, date, amount, category, description } = data

		const entry = {
			id,
			date,
			amount,
			category,
			description,
			incomeExpense: "income",
		}

		const response = NextResponse.json({ entry }, { status: 200 })

		revalidateTag("entries")

		return response
	} catch (error) {
		return handleError(error)
	}
}

export const DELETE = async (request: NextRequest) => {
	try {
		const token = headers().get("Authorization");
		const account = await getAccount(token);

		if (!account) {
			return NextResponse.json({ error: "Account not found" }, { status: 401 });
		}

		const req: { id: string } = await request.json()

		const id = req.id

		await prisma.income.delete({
			where: {
				id
			}
		})

		const response = NextResponse.json({}, { status: 200 })

		revalidatePath("/entries")

		return response

	} catch (error) {
		handleError(error)
	}
}