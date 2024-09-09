"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { useProfile } from "@/contexts/profile-context";
import { TrashIcon } from "@heroicons/react/24/outline";

interface BudgetFormProps {
  onSuccess?: () => void;
}

const 	recurringBudgetSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  amount: z.coerce.number().positive("Amount must be positive"),
  recurringPeriod: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"], {
    required_error: "You need to select a recurring period",
  }),
});

const oneTimeBudgetItemSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  amount: z.coerce.number().positive("Amount must be positive"),
});

const oneTimeBudgetSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  oneTimeBudgetItems: z
    .array(oneTimeBudgetItemSchema)
    .min(1, "At least one budget item is required"),
});

export const BudgetForm: React.FC<BudgetFormProps> = ({ onSuccess }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const authFetch = useAuthFetch();
  const { currentProfile } = useProfile();

  const recurringForm = useForm<z.infer<typeof recurringBudgetSchema>>({
    resolver: zodResolver(recurringBudgetSchema),
    defaultValues: {
      name: "",
      amount: 0,
      recurringPeriod: "MONTHLY",
    },
  });

  const oneTimeForm = useForm<z.infer<typeof oneTimeBudgetSchema>>({
    resolver: zodResolver(oneTimeBudgetSchema),
    defaultValues: {
      name: "",
      oneTimeBudgetItems: [{ name: "", amount: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: oneTimeForm.control,
    name: "oneTimeBudgetItems",
  });

  const onSubmitRecurring = async (
    data: z.infer<typeof recurringBudgetSchema>
  ) => {
    if (!currentProfile) {
      toast({
        title: "Error",
        description: "No profile selected. Please select a profile first.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await authFetch("/api/budget/recurring", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          profileId: currentProfile.id,
          recurringAmount: data.amount,
        }),
      });

      if (!response.ok) throw new Error("Failed to create recurring budget");

      recurringForm.reset();
      toast({
        title: "Recurring budget created",
        description: "Your recurring budget has been created successfully",
      });
      onSuccess?.(); // Call onSuccess callback
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create recurring budget. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmitOneTime = async (data: z.infer<typeof oneTimeBudgetSchema>) => {
    if (!currentProfile) {
      toast({
        title: "Error",
        description: "No profile selected. Please select a profile first.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await authFetch("/api/budget/one-time", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          profileId: currentProfile.id,
          oneTimeBudgetItemRequest: data.oneTimeBudgetItems,
        }),
      });

      if (!response.ok) {
        console.log(response);
        throw new Error("Failed to create one-time budget");
      }

      oneTimeForm.reset();
      toast({
        title: "One-time budget created",
        description: "Your one-time budget has been created successfully",
      });
      onSuccess?.(); // Call onSuccess callback
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create one-time budget. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tabs defaultValue="recurring" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="recurring">Recurring Budget</TabsTrigger>
        <TabsTrigger value="one-time">One Time Budget</TabsTrigger>
      </TabsList>
      <TabsContent value="recurring">
        <Form {...recurringForm}>
          <form
            onSubmit={recurringForm.handleSubmit(onSubmitRecurring)}
            className="space-y-8"
          >
            <FormField
              control={recurringForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter budget name" {...field} />
                  </FormControl>
                  <FormDescription>
                    Give your recurring budget a descriptive name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={recurringForm.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the recurring budget amount in your currency.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={recurringForm.control}
              name="recurringPeriod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recurring Period</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a recurring period" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["DAILY", "WEEKLY", "MONTHLY", "YEARLY"].map((period) => (
                        <SelectItem key={period} value={period}>
                          {period.charAt(0) + period.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose how often this budget should recur.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Recurring Budget"}
            </Button>
          </form>
        </Form>
      </TabsContent>
      <TabsContent value="one-time">
        <Form {...oneTimeForm}>
          <form
            onSubmit={oneTimeForm.handleSubmit(onSubmitOneTime)}
            className="space-y-8"
          >
            <FormField
              control={oneTimeForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter budget name" {...field} />
                  </FormControl>
                  <FormDescription>
                    Give your one-time budget a descriptive name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {fields.map((field, index) => (
              <div key={field.id} className="flex items-end space-x-2">
                <FormField
                  control={oneTimeForm.control}
                  name={`oneTimeBudgetItems.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormLabel>Item Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter item name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={oneTimeForm.control}
                  name={`oneTimeBudgetItems.${index}.amount`}
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter amount"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="destructive"
									className="w-9 h-9 p-0"
                  onClick={() => remove(index)}
                >
                  <TrashIcon className="w-4 h-4"/>
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => append({ name: "", amount: 0 })}
            >
              Add Budget Item
            </Button>

            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create One-Time Budget"}
            </Button>
          </form>
        </Form>
      </TabsContent>
    </Tabs>
  );
};
