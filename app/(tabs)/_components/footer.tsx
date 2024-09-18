"use client";

import { Button } from "@/components/ui/button";
import { ENTRIES, REPORTS } from "@/constants/routes";
import { useAuth } from "@/hooks/use-auth";
import { ArrowLeftFromLineIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import NewEntryDialog from "../entries/_components/new-entry-dialog";

export function Footer() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <footer className="w-full grid grid-cols-3 items-center justify-between gap-4 px-4 bottom-0 fixed">
      <div className="col-span-1">
        <Button
          onClick={logout}
          className="gap-2 rounded-b-none"
          variant={"destructive"}
        >
          <ArrowLeftFromLineIcon className="w-4 h-4" /> Logout
        </Button>
      </div>
      <div className="bg-white/30 backdrop-blur-md gap-2 items-center col-span-1">
        <NewEntryDialog />
      </div>
      <div className="col-span-1"></div>
    </footer>
  );
}
