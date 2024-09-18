import { NextRequest, NextResponse } from "next/server";
import { getAccount, handleError, toEntry } from "../utils";
import prisma from "@/lib/prisma";

export const GET = async (request: NextRequest) => {
	try {
		const account = await getAccount(request)

		if (!account) {
			console.log("No account found!");
			return NextResponse.json({ error: "Account not found" }, { status: 401 });
		}

		const income = await prisma.income.findMany({
			where: {
				category: {
					accountId: account.id
				}
			},
			include: {
				category: {
					select: {
						id: true,
						title: true,
					}
				}
			}
		});

		const expense = await prisma.expense.findMany({
			where: {
				category: {
					accountId: account.id
				}
			},
			include: {
				category: {
					select: {
						id: true,
						title: true,
					}
				}
			}
		});

		const entries = toEntry(income, expense)

		return NextResponse.json({ entries }, { status: 200, statusText: "OK" })
	} catch (error) {
		return handleError(error)
	}
}