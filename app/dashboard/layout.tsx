import React from "react";
import { HomeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    name: 'Home',
    href: '/dashboard',
    icon: <HomeIcon />,
  },
]

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <aside className="left-0 top-0 h-full w-[280px] border-r flex flex-col items-center justify-between">
        <div className="h-[60px] w-full flex items-center justify-center">
          <h1 className="text-2xl font-bold">Arkad</h1>
          <nav>
            <ul>
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link href={item.href}>
                    <Button variant="ghost" className="w-full flex justify-start items-center gap-2">
                      {item.icon}
                      {item.name}
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
      {children}
    </>
  );
};

export default DashboardLayout;
