"use client";

import React, { useState } from "react";
import {
  ArrowRightStartOnRectangleIcon,
  BanknotesIcon,
  ClipboardDocumentListIcon,
  PresentationChartLineIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/contexts/profile-context";
import { MoonLoader } from "react-spinners";
import { CreateProfileDialog } from "./_components/create-profile-dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <PresentationChartLineIcon className="w-4 h-4" />,
  },
  {
    name: "Cashflow",
    href: "/dashboard/cashflow",
    icon: <BanknotesIcon className="w-4 h-4" />,
  },
  {
    name: "Budget",
    href: "/dashboard/budget",
    icon: <ClipboardDocumentListIcon className="w-4 h-4" />,
  },
];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { logout } = useAuth();
  const { currentProfile, profiles, loading, setCurrentProfile } = useProfile();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const pathname = usePathname();

  if (loading) {
    return (
      <main className="w-screen h-screen flex items-center justify-center">
        <MoonLoader color="#1a1a1d" loading speedMultiplier={0.5} />
      </main>
    );
  }

  return (
    <div className="w-screen h-screen">
      <CreateProfileDialog setIsOpen={setIsDialogOpen} isOpen={isDialogOpen} />
      <aside className="left-0 top-0 h-full fixed w-[280px] border-r flex flex-col items-center justify-between p-4">
        <div className="w-full flex flex-col items-center justify-start">
          <h1 className="text-2xl text-center font-bold mb-6">Arkad</h1>
          <Select
            value={currentProfile?.id}
            onValueChange={(value) => {
              if (value === "create-new-profile") {
                setIsDialogOpen(true);
              } else {
                const profile = profiles.find(
                  (profile) => profile.id === value
                );
                if (profile) {
                  setCurrentProfile(profile);
                }
              }
            }}
          >
            <SelectTrigger className="w-full mb-4">
              <SelectValue placeholder="Select a profile" />
            </SelectTrigger>
            <SelectContent>
              {profiles.map((profile) => (
                <SelectItem key={profile.id} value={profile.id}>
                  {profile.name}
                </SelectItem>
              ))}
              <SelectItem
                value="create-new-profile"
                className="flex items-center justify-center"
              >
                Create Profile
              </SelectItem>
            </SelectContent>
          </Select>
          <nav className="flex flex-col w-full py-4 gap-4">
            <ul className="flex flex-col gap-2">
              {navItems.map((item) => (
                <li key={item.name} className="w-full">
                  <Link href={item.href}>
                    <Button
                      variant={pathname === item.href ? "secondary" : "ghost"}
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
        <div className="w-full flex flex-col items-center justify-center space-y-4">
          <Button
            variant="ghost"
            className="w-full flex justify-start items-center gap-2"
            onClick={() => {
              logout();
            }}
          >
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
