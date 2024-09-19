import 'server-only'
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAccount, handleError } from "../utils";
import { revalidatePath } from "next/cache";
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
			}
		});

		revalidatePath("/(tabs)/entries", "page")

		return NextResponse.json({ data }, { status: 201 })

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
			}
		});

		revalidatePath("/(tabs)/entries", "page")

		return NextResponse.json({ data }, { status: 200 })

	} catch (error) {
		return handleError(error)
	}
}