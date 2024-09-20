"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { ENTRIES } from "@/constants/routes";

const GetStartedButton = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  return (
    <Button disabled={isLoading} onClick={() => router.push(ENTRIES)} className="z-10">
      {isLoading? "Please wait..." : user ? "Go to Entries" : "Get Started"}
    </Button>
  );
};

export default GetStartedButton;
