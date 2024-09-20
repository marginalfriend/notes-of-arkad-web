"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { ArrowLeftFromLineIcon, Plus } from "lucide-react";
import React from "react";
import EntryDialog from "../entries/_components/entry-dialog";

export function Footer() {
  const { logout } = useAuth();

  return (
    <footer className="w-full grid grid-cols-3 items-center justify-between gap-4 px-4 bottom-0 fixed">
      <div className="col-span-1">
        <Button
          onClick={logout}
          className="gap-2 rounded-b-none"
          variant={"destructive"}
        >
          <ArrowLeftFromLineIcon className="w-4 h-4" />
        </Button>
      </div>
      <div className="bg-white/30 backdrop-blur-md gap-2 items-center col-span-1">
        <EntryDialog
          trigger={
            <Button className="w-full rounded-b-none gap-2 items-center justify-center">
              <Plus className="w-6 h-6" />
            </Button>
          }
        />
      </div>
      <div className="col-span-1"></div>
    </footer>
  );
}
