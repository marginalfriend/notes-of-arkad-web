import { verifyAccessToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Expense, Income } from "@prisma/client";
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

	return entries;
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