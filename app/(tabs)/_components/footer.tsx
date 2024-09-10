"use client";

import { Button } from "@/components/ui/button";
import { ENTRIES, REPORTS } from "@/constants/routes";
import Link from "next/link";
import React from "react";

export function Footer() {
  return (
    <footer className="w-full flex items-center justify-center bottom-0 fixed">
      <div className="w-[95vw] md:w-[75vw] lg:w-[50vw] bg-white/30 backdrop-blur-md grid grid-cols-2 space-x-2 items-center">
        <Link href={ENTRIES} className="w-full">
          <Button variant={"outline"} className="w-full rounded-b-none">
            Entries
          </Button>
        </Link>
        <Link href={REPORTS} className="w-full">
          <Button variant={"outline"} className="w-full rounded-b-none">
            Reports
          </Button>
        </Link>
      </div>
    </footer>
  );
}
