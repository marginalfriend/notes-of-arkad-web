"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React from "react";
import EntryDialog from "../entries/_components/entry-dialog";

export function Footer() {
  return (
    <footer className="w-screen flex items-center justify-center gap-4 px-4 bottom-0 fixed">
      <EntryDialog
        trigger={
          <Button className="w-[420px] rounded-b-none gap-2 items-center justify-center">
            <Plus className="w-6 h-6" />
          </Button>
        }
      />
    </footer>
  );
}
