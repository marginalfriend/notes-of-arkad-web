"use client";

import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useEntry } from "@/hooks/use-entry";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const EntryTable = () => {
  const { entries, entryLoading } = useEntry();
  const [filterValue, setFilterValue] = useState("");

  return !entries[0] && entryLoading ? (
    <TableSkeleton />
  ) : (
    <>
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Filter description..."
          value={filterValue ?? ""}
          onChange={(event) => setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <SelectMonth />
      </div>
      <DataTable columns={columns} data={entries} filterValue={filterValue} />
    </>
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
  const months = [
    {
      value: 1,
      label: "January",
    },
    {
      value: 2,
      label: "February",
    },
    {
      value: 3,
      label: "March",
    },
    {
      value: 4,
      label: "April",
    },
    {
      value: 5,
      label: "May",
    },
    {
      value: 6,
      label: "June",
    },
    {
      value: 7,
      label: "July",
    },
    {
      value: 8,
      label: "August",
    },
    {
      value: 9,
      label: "September",
    },
    {
      value: 10,
      label: "October",
    },
    {
      value: 11,
      label: "November",
    },
    {
      value: 12,
      label: "December",
    },
  ];

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
