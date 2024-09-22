"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { useToast } from "@/hooks/use-toast";
import { useEntry } from "@/hooks/use-entry";

const DeleteButton = ({
  id,
  incomeExpense,
}: {
  id: string;
  incomeExpense: string;
}) => {
  const authFetch = useAuthFetch();
  const { toast } = useToast();
  const { deleteEntry } = useEntry();

  const eraseEntry = () => {
    authFetch(`/api/${incomeExpense}`, {
      method: "DELETE",
      body: JSON.stringify({ id }),
    }).then((res) => {
      if (!res.ok) {
        toast({
          title: "Error deleting entry",
          description:
            "There's something wrong while deleting entry. Please try again.",
          variant: "destructive",
        });
      } else {
        deleteEntry(id);
        toast({
          title: "Entry deleted successfully",
          description: "Your entry has been deleted.",
        });
      }
    });
  };

  return (
    <Button className="w-9 p-2" variant={"destructive"} onClick={eraseEntry}>
      <Trash2 className="w-4 h-4" />
    </Button>
  );
};

export default DeleteButton;
