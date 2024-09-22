"use client";

import { Entry } from "@/app/(tabs)/entries/_components/columns";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { useToast } from "@/hooks/use-toast";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRefetch } from "./refetch-context";

export const EntryContext = createContext({
  entries: [] as Entry[],
  addEntry: (entry: Entry) => {},
  updateEntry: (entry: Entry) => {},
  deleteEntry: (id: string) => {},
  isLoading: false,
});

export const EntryProvider = ({ children }: { children: React.ReactNode }) => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const authFetch = useAuthFetch();
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const addEntry = (entry: Entry) => {
    setEntries([entry, ...entries]);
  };

  const deleteEntry = (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
  };

  const updateEntry = (entry: Entry) => {
    const updated = entries.filter((e) => e.id !== entry.id);
    updated.push(entry);
    setEntries(updated);
  };

  const fetchEntries = async () => {
    try {
      authFetch(`/api/entry`, {
        next: { tags: ["entries"] },
      })
        .then((res) => res.json())
        .then((unwrapped) => setEntries(unwrapped.entries))
        .then(() => setIsLoading(false));
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to retrieve entry data",
        description:
          "Something went wrong when retrieving entries data, try refresh the page.",
      });
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchEntries().then(() => setIsLoading(false));
  }, []);

  return (
    <EntryContext.Provider
      value={{ entries, addEntry, deleteEntry, updateEntry, isLoading }}
    >
      {children}
    </EntryContext.Provider>
  );
};
