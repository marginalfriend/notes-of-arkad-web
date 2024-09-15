import { DataTable } from "@/components/ui/data-table";
import React from "react";
import { columns } from "./_components/columns";
import { cookies } from "next/headers";

const EntriesPage = async () => {
  const accessToken = cookies().get("accessToken")?.value as string;
  const res = await fetch("http://localhost:3000/api/entry", {
    headers: {
      Authorization: accessToken,
    },
  });
  const data = await res.json();
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
