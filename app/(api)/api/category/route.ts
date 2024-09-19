import 'server-only'
import { NextRequest, NextResponse } from "next/server";
import { getAccount, handleError } from "../utils";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

const categorySchema = z.object({
	title: z.string(),
	incomeExpense: z.enum(["income", "expense"]),
})

export const POST = async (request: NextRequest) => {
	try {
		const token = headers().get("Authorization");
		const account = await getAccount(token);

		if (!account) {
			console.log("[CATEGORY ENDPOINT] No account found!");
			return NextResponse.json({ error: "Account not found" }, { status: 401 });
		}

		const validatedData = categorySchema.parse(await request.json());

		if (validatedData.incomeExpense === "income") {
			const incomeCategory = await prisma.incomeCategory.create({
				data: {
					accountId: account.id,
					title: validatedData.title,
				},
				select: {
					id: true,
					title: true,
				}
			})

			return NextResponse.json({ incomeCategory }, { status: 201 })
		}

		if (validatedData.incomeExpense === "expense") {
			const expenseCategory = await prisma.expenseCategory.create({
				data: {
					accountId: account.id,
					title: validatedData.title,
				}
			})

			return NextResponse.json({ expenseCategory: expenseCategory }, { status: 201 })
		}
	} catch (error) {
		return handleError(error)
	}
}

export const GET = async (request: NextRequest) => {
	const incomeExpense = request.nextUrl.searchParams.get("incomeExpense");

	if (!incomeExpense) return NextResponse.json(
		{ error: "Income / Expense must be defined in the search param e.g. api/category?incomeExpense=income" },
		{ status: 400 }
	)

	if (incomeExpense !== "income" && incomeExpense !== "expense") return NextResponse.json(
		{ error: `Invalid incomeExpense: Valid incomeExpense: income | expense: ${incomeExpense} is unrecognizable` },
		{ status: 400 }
	)

	const token = headers().get("Authorization");
	const account = await getAccount(token);

	if (!account) {
		console.log("[CATEGORY ENDPOINT] No account found!");
		return NextResponse.json({ error: "Account not found" }, { status: 401 });
	}

	if (incomeExpense === "income") {
		const incomeCategory = await prisma.incomeCategory.findMany({
			where: {
				accountId: account.id
			}
		})

		return NextResponse.json({ incomeCategory }, { status: 200 })
	}

	if (incomeExpense === "expense") {
		const expenseCategory = await prisma.expenseCategory.findMany({
			where: {
				accountId: account.id
			}
		})

		return NextResponse.json({ expenseCategory }, { status: 200 })
	}
}