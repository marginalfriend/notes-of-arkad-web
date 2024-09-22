"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useEntry } from "@/hooks/use-entry";
import { formatCurrency } from "@/lib/utils";
import React, { useEffect, useState } from "react";

type SummaryData = {
  income: {
    total: string;
    percentage: string;
    status: string;
  };
  expense: {
    total: string;
    percentage: string;
    status: string;
  };
  saving: {
    total: string;
    percentage: string;
    status: string;
  };
};

const Summary = () => {
  const { summary, isLoading } = useEntry();
  const [summaryData, setSummaryData] = useState<SummaryData>();
  const { income, expense, saving } = summary;

  useEffect(() => {
    if (summary && !isLoading.summary) {
      const data = {
        income: {
          total: formatCurrency(income.total.toString()),
          percentage: income.percentage
            ? `${decimalFormat(income.percentage)}% compared to last month`
            : "",
          status: income.percentage
            ? income.percentage > 0
              ? "increased"
              : "decreased"
            : "",
        },
        expense: {
          total: formatCurrency(expense.total.toString()),
          percentage: expense.percentage
            ? `${decimalFormat(expense.percentage)}% compared to last month`
            : "",
          status: expense.percentage
            ? expense.percentage > 0
              ? "increased"
              : "decreased"
            : "",
        },
        saving: {
          total: formatCurrency(saving.total.toString()),
          percentage: saving.percentage
            ? `${decimalFormat(saving.percentage)}% compared to last month`
            : "",
          status: saving.percentage
            ? saving.percentage > 0
              ? "increased"
              : "decreased"
            : "",
        },
      };
      setSummaryData(data);
    }
  }, [summary, isLoading]);

  return summaryData && !isLoading.summary ? (
    <section className="w-full grid gap-4 grid-cols-1 md:grid-cols-3">
      <div className="space-y-1 p-4 grid-cols-1 border rounded-md">
        <h1 className="text-sm font-semibold">Income (MTD)</h1>
        <p className="text-2xl font-extrabold">{summaryData.income.total}</p>
        {income.percentage && (
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
        )}
      </div>
      <div className="space-y-1 p-4 grid-cols-1 border rounded-md">
        <h1 className="text-sm font-semibold">Expense (MTD)</h1>
        <p className="text-2xl font-extrabold">{summaryData.expense.total}</p>
        {expense.percentage && (
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
        )}
      </div>
      <div className="space-y-1 p-4 grid-cols-1 border rounded-md">
        <h1 className="text-sm font-semibold">Saving (MTD)</h1>
        <p className="text-2xl font-extrabold">{summaryData.saving.total}</p>
        {saving.percentage && (
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
        )}
      </div>
    </section>
  ) : (
    <SummarySkeleton />
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

const decimalFormat = (e: number) => {
  return Number.parseFloat(e.toString()).toFixed(2);
};
