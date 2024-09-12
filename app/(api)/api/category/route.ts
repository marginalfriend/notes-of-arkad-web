import { NextRequest, NextResponse } from "next/server";
import { getAccount, handleError } from "../utils";
import { z } from "zod";
import prisma from "@/lib/prisma";

const categorySchema = z.object({
	name: z.string(),
	incomeExpense: z.enum(["income", "expense"]),
})

export const POST = async (request: NextRequest) => {
	try {
		const account = await getAccount(request);

		if (!account) {
			console.log("No account found!");
			return NextResponse.json({ error: "Account not found" }, { status: 401 });
		}

		const validatedData = categorySchema.parse(await request.json());
		console.log("Validated request: ", validatedData);

		if (validatedData.incomeExpense === "income") {
			const incomeCategory = prisma.incomeCategory.create({
				data: {
					accountId: account.id,
					title: validatedData.name,
				}
			})

			console.log("Income category: ", incomeCategory)
			return NextResponse.json({ incomeCategory }, { status: 201 })
		}

		if (validatedData.incomeExpense === "expense") {
			const expenseCategory = prisma.expenseCategory.create({
				data: {
					accountId: account.id,
					title: validatedData.name,
				}
			})

			console.log("Income category: ", expenseCategory)
			return NextResponse.json({ incomeCategory: expenseCategory }, { status: 201 })
		}
	} catch (error) {
		return handleError(error)
	}
}

export const GET = async (request: NextRequest) => {
	const incomeExpense = request.nextUrl.searchParams.get("incomeExpense");
	console.log("Income/Expense: ", incomeExpense)

	if (!incomeExpense) return NextResponse.json(
		{ error: "Income / Expense must be defined in the search param e.g. api/category?incomeExpense=income" },
		{ status: 400 }
	)

	if (incomeExpense !== "income" && incomeExpense !== "expense") return NextResponse.json(
		{ error: `Invalid incomeExpense: Valid incomeExpense: income | expense: ${incomeExpense} is unrecognizable` },
		{ status: 400 }
	)

	const account = await getAccount(request)

	if (!account) {
		console.log("No account found!");
		return NextResponse.json({ error: "Account not found" }, { status: 401 });
	}

	if (incomeExpense === "income") {
		const incomeCategory = prisma.incomeCategory.findMany({
			where: {
				accountId: account.id
			}
		})

		console.log("Income category: ", incomeCategory)
		return NextResponse.json({ incomeCategory }, { status: 201 })
	}

	if (incomeExpense === "expense") {
		const expenseCategory = prisma.expenseCategory.findMany({
			where: {
				accountId: account.id
			}
		})

		console.log("Expense category: ", expenseCategory)
		return NextResponse.json({ expenseCategory }, { status: 201 })
	}
}