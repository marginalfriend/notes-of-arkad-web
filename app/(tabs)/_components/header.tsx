"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { ArrowLeftFromLineIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Header = () => {
  const authFetch = useAuthFetch();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    authFetch("/api/profile")
      .then((res) => res.json())
      .then((data) => setUsername(data.user.name))
      .then(() => setLoading(false));
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (window.scrollY > 12 && window.scrollY > lastScrollY) {
        setHidden(true); // Hide header when scrolling down
      } else {
        setHidden(false); // Show header when scrolling up
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 h-12 border-b w-screen flex items-center justify-between bg-background px-4 transition-transform duration-300 ${
        hidden ? "-translate-y-12" : "translate-y-0"
      }`}
    >
      <p>{loading ? "Loading..." : username}</p>
      <LogoutButton />
    </header>
  );
};

const LogoutButton = () => {
  const { logout } = useAuth();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="w-8 h-8 p-2" variant={"destructive"}>
          <ArrowLeftFromLineIcon className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to logout? You will have to re-login the next
            time you visit Arkad
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={logout}>Logout</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
