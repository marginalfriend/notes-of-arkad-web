import 'server-only'
import { NextRequest, NextResponse } from "next/server";
import { getAccount, handleError, toEntry } from "../utils";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export const GET = async (request: NextRequest) => {
	try {
		const token = headers().get("Authorization");
		const account = await getAccount(token);

		if (!account) {
			console.error("[ENTRY ENDPOINT] No account found!");
			return NextResponse.json({ error: "Account not found" }, { status: 401 });
		}

		const reqParam = request.nextUrl.searchParams.get("month")
		console.log("[ENTRY ENDPOINT] Month: ", reqParam)

		const currentDate = new Date()
		const month = reqParam ? parseInt(reqParam) : currentDate.getMonth()

		const firstDay = new Date(currentDate.getFullYear(), month)
		const lastDay = new Date(currentDate.getFullYear(), month + 1, 0)
		console.log("[ENTRY ENDPOINT] First day: ", firstDay)
		console.log("[ENTRY ENDPOINT] Last day: ", lastDay)


		const income = await prisma.income.findMany({
			where: {
				AND: {
					category: {
						accountId: account.id
					},
					date: {
						gte: firstDay,
						lte: lastDay
					}
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
		console.log("[ENTRY ENDPOINT] Income: ", income)

		const expense = await prisma.expense.findMany({
			where: {
				AND: {
					category: {
						accountId: account.id
					},
					date: {
						gte: firstDay,
						lte: lastDay
					}
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
		console.log("[ENTRY ENDPOINT] Expense: ", expense)

		const entries = toEntry(income, expense)

		return NextResponse.json({ entries }, { status: 200, statusText: "OK" })
	} catch (error) {
		return handleError(error)
	}
}