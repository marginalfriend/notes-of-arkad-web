"use client";

import { Line, LineChart, CartesianGrid, XAxis } from "recharts";
import { columns, Entry } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useEntry } from "@/hooks/use-entry";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
  ChartTooltip,
} from "@/components/ui/chart";

export const EntryTable = () => {
  const { entries, entryLoading, entryMonth } = useEntry();
  const [filterValue, setFilterValue] = useState("");
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const chartConfig = {
    income: {
      label: "Income",
      color: "#22c55e",
    },
    expense: {
      label: "Expense",
      color: "#ef4444",
    },
  } satisfies ChartConfig;

  useEffect(() => {
    const getChartData = () => {
      const chartData = [];
      const lastDay = new Date(
        new Date().getFullYear(),
        entryMonth + 1,
        0
      ).getDate();

      for (let i = 1; i <= lastDay; i++) {
        const chartItem = {
          date: i.toString(),
          income: 0,
          expense: 0,
        };

        for (const e of entries) {
          if (new Date(e.date).getDate() === i) {
            switch (e.incomeExpense) {
              case "income":
                chartItem.income += e.amount;
                break;
              case "expense":
                chartItem.expense += e.amount;
            }
          }
        }

        chartData.push(chartItem);
      }

      setChartData(chartData);
    };

    getChartData();
  }, [entries]);

  return !entries[0] && entryLoading ? (
    <TableSkeleton />
  ) : (
    <Tabs defaultValue="table" className="space-y-4">
      <TabsList className="w-full">
        <TabsTrigger value="table" className="w-full">
          Table
        </TabsTrigger>
        <TabsTrigger value="chart" className="w-full">
          Chart
        </TabsTrigger>
      </TabsList>
      <TabsContent value="table" className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <Input
              placeholder="Filter description..."
              value={filterValue ?? ""}
              onChange={(event) => setFilterValue(event.target.value)}
              className="max-w-sm"
            />
            <SelectMonth />
          </div>
          <DataTable
            columns={columns}
            data={entries}
            filterValue={filterValue}
          />
        </div>
      </TabsContent>
      <TabsContent value="chart" className="space-y-4 pb-8">
        <div className="flex items-center justify-between gap-4">
          <div />
          <SelectMonth />
        </div>
        <ChartContainer
          config={chartConfig}
          className="min-h-[200px] max-h-[50vh] w-full"
        >
          <LineChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line dataKey="income" stroke="var(--color-income)" />
            <Line dataKey="expense" stroke="var(--color-expense)" />
          </LineChart>
        </ChartContainer>
      </TabsContent>
    </Tabs>
  );
};

const TableSkeleton = () => {
  return (
    <div className="w-full h-full space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-96" />
      </div>
      <div className="rounded-md h-[80vh]">
        <Skeleton className="w-full h-full rounded-md" />
      </div>
    </div>
  );
};

const SelectMonth = () => {
  const { entryMonth, setEntryMonth } = useEntry();

  return (
    <Select
      value={entryMonth.toString()}
      onValueChange={(value) => setEntryMonth(parseInt(value))}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a month" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {months.map((m) => (
            <SelectItem key={m.value} value={m.value.toString()}>
              {m.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

const months = [
  {
    value: 0,
    label: "January",
  },
  {
    value: 1,
    label: "February",
  },
  {
    value: 2,
    label: "March",
  },
  {
    value: 3,
    label: "April",
  },
  {
    value: 4,
    label: "May",
  },
  {
    value: 5,
    label: "June",
  },
  {
    value: 6,
    label: "July",
  },
  {
    value: 7,
    label: "August",
  },
  {
    value: 8,
    label: "September",
  },
  {
    value: 9,
    label: "October",
  },
  {
    value: 10,
    label: "November",
  },
  {
    value: 11,
    label: "December",
  },
];

type ChartData = {
  date: string;
  income: number;
  expense: number;
};
