"use client";

import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useEntry } from "@/hooks/use-entry";

export const EntryTable = () => {
  const { entries, isLoading } = useEntry();

  return !entries[0] && isLoading.entry ? (
    <TableSkeleton />
  ) : (
    <DataTable columns={columns} data={entries} />
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
