import { NextRequest, NextResponse } from "next/server";
import { getAccount, handleError, toEntry } from "../utils";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const GET = async (request: NextRequest) => {
	try {
		const token = request.headers.get("Authorization");
		const account = await getAccount(token);

		if (!account) {
			console.error("[ENTRY ENDPOINT] No account found!");
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

		revalidatePath('/entries')

		return NextResponse.json({ entries }, { status: 200, statusText: "OK" })
	} catch (error) {
		return handleError(error)
	}
}