"use client";

import { Entry } from "@/app/(tabs)/entries/_components/columns";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { useToast } from "@/hooks/use-toast";
import React, { createContext, useContext, useEffect, useState } from "react";

type SummaryData = {
  income: {
    total: number;
    percentage: number | undefined;
  };
  expense: {
    total: number;
    percentage: number | undefined;
  };
  saving: {
    total: number;
    percentage: number | undefined;
  };
};

const defaultSummaryData: SummaryData = {
  income: {
    total: 0, // Default total for income
    percentage: undefined, // Default undefined percentage
  },
  expense: {
    total: 0, // Default total for expense
    percentage: undefined, // Default undefined percentage
  },
  saving: {
    total: 0, // Default total for saving
    percentage: undefined, // Default undefined percentage
  },
};

export type EntryContextProps = {
  summary: SummaryData;
  entries: Entry[];
  addEntry: (entry: Entry) => void;
  updateEntry: (entry: Entry) => void;
  deleteEntry: (id: string) => void;
  isLoading: { summary: boolean; entry: boolean };
};

export const EntryContext = createContext<EntryContextProps | undefined>(
  undefined
);

export const EntryProvider = ({ children }: { children: React.ReactNode }) => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [summary, setSummary] = useState<SummaryData>(defaultSummaryData);
  const [isLoading, setIsLoading] = useState({ entry: true, summary: true });
  const authFetch = useAuthFetch();
  const { toast } = useToast();

  const handleError = (error: any) => {
    console.error(error);
    toast({
      title: "Failed to retrieve entry data",
      description:
        "Something went wrong while retrieving data, try refresh the page.",
    });
  };

  const addEntry = (entry: Entry) => {
    setEntries([entry, ...entries]);
    fetchSummary();
  };

  const deleteEntry = (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    fetchSummary();
  };

  const updateEntry = (entry: Entry) => {
    const updated = entries.filter((e) => e.id !== entry.id);
    updated.push(entry);
    setEntries(updated);
    fetchSummary();
  };

  const fetchEntries = () => {
    try {
      authFetch(`/api/entry`, {
        next: { tags: ["entries"] },
      })
        .then((res) => res.json())
        .then((data) => setEntries(data.entries))
        .then(() => {
          setIsLoading({ summary: isLoading.summary, entry: false });
        });
    } catch (error) {
      handleError(error);
    }
  };

  const fetchSummary = () => {
    try {
      authFetch("/api/summary")
        .then((res: Response) => res.json())
        .then((data: any) => setSummary(data.data))
        .then(() => {
          setIsLoading({ summary: false, entry: isLoading.entry });
        });
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    setIsLoading({ entry: true, summary: true });
    fetchEntries();
    fetchSummary();
  }, []);

  return (
    <EntryContext.Provider
      value={{
        entries,
        addEntry,
        deleteEntry,
        updateEntry,
        isLoading,
        summary,
      }}
    >
      {children}
    </EntryContext.Provider>
  );
};
