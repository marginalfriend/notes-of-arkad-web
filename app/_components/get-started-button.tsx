"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { ENTRIES } from "@/constants/routes";

const GetStartedButton = () => {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <Button onClick={() => router.push(ENTRIES)}>
      {user ? "Go to Entries" : "Get Started"}
    </Button>
  );
};

export default GetStartedButton;
