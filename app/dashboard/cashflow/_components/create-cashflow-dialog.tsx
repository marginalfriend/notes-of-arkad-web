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
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
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
  const [recurringBudgets, setRecurringBudgets] = useState([]);
  const [oneTimeBudgets, setOneTimeBudgets] = useState([]);
  const authFetch = useAuthFetch();

  const expensesForm = useForm<z.infer<typeof expensesSchema>>({
    resolver: zodResolver(expensesSchema),
    defaultValues: {
      name: "",
      amount: 0,
      description: "",
    },
  });

  useEffect(() => {
    authFetch("/api/budget/recurring")
  }, []);

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

            <FormField
              control={expensesForm.control}
              name="budgetReference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Reference</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value?.id}
                      onValueChange={(value) => {
                        // Select Budget
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </Select>
                  </FormControl>
                  <FormDescription>Refer to a budget if any</FormDescription>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Create Expense
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCashflowDialog;
