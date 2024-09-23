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
  SelectLabel,
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
