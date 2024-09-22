import React, { Suspense } from "react";
import Summary, { SummarySkeleton } from "./_components/summary";
import { EntryTable } from "./_components/entry-table";

const EntriesPage = async () => {
  return (
    <main className="w-full min-h-full mb-20 p-4 space-y-4">
      <Suspense fallback={<SummarySkeleton />}>
        <Summary />
      </Suspense>
      <EntryTable />
    </main>
  );
};

export default EntriesPage;