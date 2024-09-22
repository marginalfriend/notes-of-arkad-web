"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { useToast } from "@/hooks/use-toast";
import { useEntry } from "@/hooks/use-entry";
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
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="w-9 p-2" variant={"destructive"}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the entry
            from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={eraseEntry}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteButton;
