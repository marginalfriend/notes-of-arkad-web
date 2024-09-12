"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Plus } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const newEntrySchema = z.object({
  date: z.coerce.date(),
  title: z.string(),
  incomeExpense: z.enum(["income", "expense"]),
  amount: z.number().nonnegative(),
  description: z.nullable(z.string()),
	categoryId: z.string(),
});

const NewEntryDialog = () => {
  const form = useForm<z.infer<typeof newEntrySchema>>({
    resolver: zodResolver(newEntrySchema),
    defaultValues: {
      date: new Date(),
      title: "",
      incomeExpense: "expense",
      amount: 0,
      description: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof newEntrySchema>) => {
    // TO DO
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2 items-center justify-center">
          <Plus className="w-4 h-4" />
          New Entry
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Entry</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
					

						<Button type="submit">
							Create
						</Button>
					</form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewEntryDialog;
