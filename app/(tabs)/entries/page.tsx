import { DataTable } from "@/components/ui/data-table";
import React from "react";
import { columns } from "./_components/columns";
import { serverAuthFetch } from "@/lib/server-auth-fetch";
import { HOST } from "@/constants/routes";
import { cookies } from "next/headers";

const EntriesPage = async () => {
  const cookiesStore = cookies().getAll();
  const res = await serverAuthFetch(`${HOST}/api/entry`, {}, cookiesStore);
  const data = await res?.json();
  const { entries } = data;

  return (
    <main className="w-full min-h-full mb-20 p-4">
      <DataTable columns={columns} data={entries} />
    </main>
  );
};

export default EntriesPage;
