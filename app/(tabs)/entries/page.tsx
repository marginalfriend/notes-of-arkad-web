import { DataTable } from "@/components/ui/data-table";
import React, { Suspense } from "react";
import { columns } from "./_components/columns";
import { serverAuthFetch } from "@/lib/server-auth-fetch";
import { HOST } from "@/constants/routes";
import { cookies } from "next/headers";
import { Skeleton } from "@/components/ui/skeleton";

const EntriesPage = async () => {
  return (
    <main className="w-full min-h-full mb-20 p-4">
      <Suspense fallback={<TableSkeleton />}>
        <TableSection />
      </Suspense>
    </main>
  );
};

export default EntriesPage;

const TableSection = async () => {
  const cookiesStore = cookies().getAll();
  const res = await serverAuthFetch(`${HOST}/api/entry`, cookiesStore);
  const data = await res?.json();
  const { entries } = data;

  return <DataTable columns={columns} data={entries} />;
};

const TableSkeleton = async () => {
  return (
    <div className="w-full h-full">
      <div className="flex items-center py-4 justify-between">
        <Skeleton className="h-8 w-72" />
      </div>
      <div className="rounded-md h-[80vh]">
        <Skeleton className="w-full h-full rounded-md" />
      </div>
    </div>
  );
};
