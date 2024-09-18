"use client";

import { Button } from "@/components/ui/button";
import { ENTRIES, REPORTS } from "@/constants/routes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export function Footer() {
  const pathname = usePathname();

  return (
    <footer className="w-full flex items-center justify-center bottom-0 fixed">
      <div className="w-[95vw] md:w-[75vw] lg:w-[50vw] bg-white/30 backdrop-blur-md grid grid-cols-2 gap-2 items-center">
        <Link href={ENTRIES} className="w-full">
          <Button
            variant={pathname === ENTRIES ? "default" : "outline"}
            className="w-full rounded-b-none"
          >
            Entries
          </Button>
        </Link>
        <Link href={REPORTS} className="w-full">
          <Button
            disabled
            variant={pathname === REPORTS ? "default" : "outline"}
            className="w-full rounded-b-none"
          >
            Reports
          </Button>
        </Link>
      </div>
    </footer>
  );
}
