"use client";

import React from "react";
import { ArrowRightStartOnRectangleIcon, HomeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

const navItems = [
  {
    name: "Home",
    href: "/dashboard",
    icon: <HomeIcon className="w-4 h-4" />,
  },
];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { logout } = useAuth();
  
  return (
    <div className="w-screen h-screen">
      <aside className="left-0 top-0 h-full fixed w-[280px] border-r flex flex-col items-center justify-between">
        <div className="h-[60px] w-full flex flex-col items-center justify-center pt-10">
          <h1 className="text-2xl font-bold">Arkad</h1>
          <nav className="w-full">
            <ul className="flex flex-col gap-2">
              {navItems.map((item) => (
                <li key={item.name} className="w-full">
                  <Link href={item.href}>
                    <Button
                      variant="ghost"
                      className="w-full flex justify-start items-center gap-2"
                    >
                      {item.icon}
                      {item.name}
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="h-[60px] w-full flex flex-col items-center justify-center">
          {/* // Logout Button */}
          <Button variant="ghost" className="w-full flex justify-start items-center gap-2" onClick={() => {
            logout();
          }}>
            <ArrowRightStartOnRectangleIcon className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </aside>
      <main className="pl-[280px] w-full h-full">{children}</main>
    </div>
  );
};

export default DashboardLayout;
