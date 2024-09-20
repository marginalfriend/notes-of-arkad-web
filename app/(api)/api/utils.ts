import 'server-only'
import { verifyAccessToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Expense, Income } from "@prisma/client";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export const handleError = (error: any) => {
	if (error instanceof ZodError) {
		console.log("[BACKEND ERROR HANDLER] Invalid input(s): ", error)
		return NextResponse.json({ error: error.issues }, { status: 400, statusText: "Bad Request: Invalid input(s)" })
	} else {
		console.log("[BACKEND ERROR HANDLER] Inernal server error: ", error)
		return NextResponse.json({ error: "Internal server error" }, { status: 500 })
	}
}

export const getAccount = async (token: string | null | undefined) => {
	if (!token) return null

	const payload = await verifyAccessToken(token)

	if (!payload) return null;

	const id = payload.id;

	const account = await prisma.account.findUnique({
		where: {
			id,
		}
	})

	return account
}

export const toEntry = (income: IncomeExtended[], expense: ExpenseExtended[]) => {
	let entries: Entry[] = [];

	income.forEach(i => entries.push({
		id: i.id,
		incomeExpense: "income",
		category: {
			id: i.category.id,
			title: i.category.title,
		},
		amount: i.amount,
		date: i.date,
		description: i.description,
	}))

	expense.forEach(e => entries.push({
		id: e.id,
		incomeExpense: "expense",
		category: {
			id: e.category.id,
			title: e.category.title,
		},
		amount: e.amount,
		date: e.date,
		description: e.description,
	}))

	return entries.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

type Entry = {
	id: string;
	incomeExpense: "income" | "expense";
	category: {
		id: string;
		title: string
	};
	amount: number;
	date: Date;
	description: string | null;
}

type IncomeExtended = Income & {
	category: {
		id: string,
		title: string,
	}
}

type ExpenseExtended = Expense & {
	category: {
		id: string,
		title: string,
	}
}