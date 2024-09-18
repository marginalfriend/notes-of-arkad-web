import { DataTable } from "@/components/ui/data-table";
import React from "react";
import { columns } from "./_components/columns";
import { serverAuthFetch } from "@/lib/server-auth-fetch";
import { HOST } from "@/constants/routes";

const EntriesPage = async () => {
  const res = await serverAuthFetch(`${HOST}/api/entry`);
  const data = await res?.json();
  const { entries } = data;

  return (
    <main className="w-full min-h-full mb-20 p-4">
      <h1 className="text-2xl font-bold text-center">
        Income & Expense Entries
      </h1>
      <hr className="my-4" />
      <DataTable columns={columns} data={entries} />
    </main>
  );
};

export default EntriesPage;
