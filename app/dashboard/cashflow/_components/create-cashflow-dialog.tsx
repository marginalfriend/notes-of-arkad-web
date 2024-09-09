"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

enum BudgetType {
  RECURRING,
  ONE_TIME,
}

const expensesSchema = z.object({
  name: z.coerce.string(),
  amount: z.coerce.number(),
  budgetReference: z
    .object({
      type: z.nativeEnum(BudgetType),
      id: z.string().cuid(),
    })
    .optional(),
  description: z.string(),
});

const CreateCashflowDialog = () => {
  const expensesForm = useForm<z.infer<typeof expensesSchema>>({
    resolver: zodResolver(expensesSchema),
    defaultValues: {
      name: "",
      amount: 0,
      description: "",
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Cashflow</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Cashflow</DialogTitle>
          <DialogDescription>Log your income or expenses</DialogDescription>
        </DialogHeader>

        <Form {...expensesForm}>
          <form className="space-y-8">

            <FormField
              control={expensesForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expense Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Croissant" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter a descriptive name for yout expense
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

						<Button type="submit" className="w-full">Create Expense</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCashflowDialog;
