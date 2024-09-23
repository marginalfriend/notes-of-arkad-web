"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";

import { ArrowUpDown } from "lucide-react";
import { formatCurrency, parseCurrency } from "@/lib/utils";
import EntryDialog from "./entry-dialog";
import DeleteButton from "./delete-button";

export type Entry = {
  id: string;
  date: Date;
  amount: number;
  category: { id: string; title: string };
  incomeExpense: "income" | "expense";
  description: string | undefined;
};

export const columns: ColumnDef<Entry>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) =>
      new Date(row.original.date).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => formatCurrency(row.original.amount.toString()),
  },
  {
    accessorKey: "category.title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "incomeExpense",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Income / Expense
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) =>
      row.original.incomeExpense === "income" ? (
        <p className="text-center bg-green-300/50 rounded-sm">Income</p>
      ) : (
        <p className="text-center bg-red-300/50 rounded-sm">Expense</p>
      ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Description
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const entry = {
        id: row.original.id,
        categoryId: row.original.category.id,
        incomeExpense: row.original.incomeExpense,
        amount: parseCurrency(row.original.amount.toString()),
        description: row.original.description,
        date: row.original.date,
      };

      return (
        <div className="flex gap-2 justify-center">
          <EntryDialog
            entry={entry}
            trigger={
              <Button className="w-9 p-2" variant={"outline"}>
                <Pencil className="w-4 h-4" />
              </Button>
            }
          />
          <DeleteButton
            id={row.original.id}
            incomeExpense={row.original.incomeExpense}
          />
        </div>
      );
    },
  },
];
