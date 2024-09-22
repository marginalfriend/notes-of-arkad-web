import "server-only"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getAccount, handleError } from "../utils"
import { headers } from "next/headers"
import { revalidateTag } from "next/cache"

export const GET = async () => {
	try {
		const token = headers().get("Authorization");
		const account = await getAccount(token);

		if (!account) {
			return NextResponse.json({ error: "Account not found" }, { status: 401 });
		}

		const currentDate = new Date()
		const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth())
		const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

		const firstDayLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
		const lastDayLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0)

		const currentIncome = await prisma.income.aggregate({
			_sum: {
				amount: true
			},
			where: {
				AND: {
					category: {
						accountId: account.id
					},
					date: {
						gte: firstDay,
						lte: lastDay,
					}
				}
			}
		})

		const lastMonthIncome = await prisma.income.aggregate({
			_sum: {
				amount: true
			},
			where: {
				AND: {
					category: {
						accountId: account.id
					},
					date: {
						gte: firstDayLastMonth,
						lte: lastDayLastMonth,
					}
				}
			}
		})

		const currentExpense = await prisma.expense.aggregate({
			_sum: {
				amount: true
			},
			where: {
				AND: {
					category: {
						accountId: account.id
					},
					date: {
						gte: firstDay,
						lte: lastDay,
					}
				}
			}
		})

		const lastMonthExpense = await prisma.expense.aggregate({
			_sum: {
				amount: true
			},
			where: {
				AND: {
					category: {
						accountId: account.id
					},
					date: {
						gte: firstDayLastMonth,
						lte: lastDayLastMonth,
					}
				}
			}
		})

		const currentIncomeValue = currentIncome._sum.amount || 0
		const currentExpenseValue = currentExpense._sum.amount || 0
		const currentSaving = currentIncomeValue - currentExpenseValue

		const lastMonthIncomeValue = lastMonthIncome._sum.amount || 0
		const lastMonthExpenseValue = lastMonthExpense._sum.amount || 0
		const lastMonthSaving = lastMonthIncomeValue - lastMonthExpenseValue

		const incomePercentage = ((currentIncomeValue - lastMonthIncomeValue) / currentIncomeValue) * 100
		const expensePercentage = ((currentExpenseValue - lastMonthExpenseValue) / currentExpenseValue) * 100
		const savingPercentage = ((currentSaving - lastMonthSaving) / currentSaving) * 100

		const data = {
			income: {
				total: currentIncomeValue,
				percentage: lastMonthIncome && incomePercentage
			},
			expense: {
				total: currentExpenseValue,
				percentage: lastMonthExpense && expensePercentage
			},
			saving: {
				total: currentSaving,
				percentage: lastMonthSaving && savingPercentage,
			}
		}

		const response = NextResponse.json({ data }, { status: 200 })

		revalidateTag("summary")

		return response

	} catch (error) {
		return handleError(error)
	}
}