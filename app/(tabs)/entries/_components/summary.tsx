import { Skeleton } from "@/components/ui/skeleton";
import { HOST } from "@/constants/routes";
import { serverAuthFetch } from "@/lib/server-auth-fetch";
import { formatCurrency } from "@/lib/utils";
import { cookies } from "next/headers";
import React from "react";

const Summary = async () => {
  const cookiesStore = cookies().getAll();
  const res = await serverAuthFetch(`${HOST}/api/summary`, cookiesStore, {
    next: { tags: ["summary", "entries"] },
  });
  const result = await res?.json();
  const { data } = result;
  const { income, expense, saving } = data;

  const summaryData = {
    income: {
      total: formatCurrency(income.total.toString()),
      percentage: `${Number.parseFloat(income.percentage).toFixed(
        2
      )}% compared to last month`,
      status: income.percentage > 0 ? "increased" : "decreased",
    },
    expense: {
      total: formatCurrency(expense.total.toString()),
      percentage: `${Number.parseFloat(expense.percentage).toFixed(
        2
      )}% compared to last month`,
      status: expense.percentage > 0 ? "increased" : "decreased",
    },
    saving: {
      total: formatCurrency(saving.total.toString()),
      percentage: `${Number.parseFloat(saving.percentage).toFixed(
        2
      )}% compared to last month`,
      status: saving.percentage > 0 ? "increased" : "decreased",
    },
  };

  return (
    <section className="w-full grid gap-4 grid-cols-1 md:grid-cols-3">
      <div className="space-y-1 p-4 grid-cols-1 border rounded-md">
        <h1 className="text-sm font-semibold">Income (MTD)</h1>
        <p className="text-2xl font-extrabold">{summaryData.income.total}</p>
        <p
          className={`text-sm ${
            summaryData.income.status === "increased"
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {income.percentage > 0
            ? "+" + summaryData.income.percentage
            : summaryData.income.percentage}
        </p>
      </div>
      <div className="space-y-1 p-4 grid-cols-1 border rounded-md">
        <h1 className="text-sm font-semibold">Expense (MTD)</h1>
        <p className="text-2xl font-extrabold">{summaryData.expense.total}</p>
        <p
          className={`text-sm ${
            summaryData.expense.status === "decreased"
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {expense.percentage > 0
            ? "+" + summaryData.expense.percentage
            : summaryData.expense.percentage}
        </p>
      </div>
      <div className="space-y-1 p-4 grid-cols-1 border rounded-md">
        <h1 className="text-sm font-semibold">Saving (MTD)</h1>
        <p className="text-2xl font-extrabold">{summaryData.saving.total}</p>
        <p
          className={`text-sm ${
            summaryData.saving.status === "increased"
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {saving.percentage > 0
            ? "+" + summaryData.saving.percentage
            : summaryData.saving.percentage}
        </p>
      </div>
    </section>
  );
};

export default Summary;

export const SummarySkeleton = () => {
  return (
    <section className="w-full grid gap-4 grid-cols-1 md:grid-cols-3">
      <div className="space-y-1 grid-cols-1 rounded-md">
        <Skeleton className="h-36 w-full" />
      </div>
      <div className="space-y-1 grid-cols-1 rounded-md">
        <Skeleton className="h-36 w-full" />
      </div>
      <div className="space-y-1 grid-cols-1 rounded-md">
        <Skeleton className="h-36 w-full" />
      </div>
    </section>
  );
};
