"use client";

import { z } from "zod";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthFetch } from "@/hooks/use-auth-fetch";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
  FormControl,
  FormDescription,
} from "@/components/ui/form";

import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { CalendarIcon, CheckIcon } from "@radix-ui/react-icons";

const newEntrySchema = z.object({
  date: z.coerce.date(),
  title: z.string(),
  incomeExpense: z.enum(["income", "expense"]),
  amount: z.coerce.number().nonnegative(),
  description: z.optional(z.coerce.string()),
  categoryId: z.string(),
});

const NewEntryDialog = () => {
  const [categories, setCategories] = useState<{ id: string; title: string }[]>(
    []
  );
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [input, setInput] = useState("");
  const authFetch = useAuthFetch();

  const form = useForm<z.infer<typeof newEntrySchema>>({
    resolver: zodResolver(newEntrySchema),
    defaultValues: {
      date: new Date(),
      title: "",
      categoryId: "",
    },
  });
  const incomeExpense = form.getValues().incomeExpense;

  const handleIncomeExpenseChange = (e: string) => {
    authFetch(`/api/category?incomeExpense=${e}`)
      .then((res) => res.json())
      .then((data) => setCategories(data[`${e}Category`]));
    form.setValue("categoryId", "");
  };

  const handleCreateCategory = () => {
    authFetch("/api/category", {
      method: "POST",
      body: JSON.stringify({
        title: input,
        incomeExpense,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setCategories([...categories, data]);
        form.setValue("categoryId", data.id);
        setOpen(false);
      });
  };

  const handleSubmit = (values: z.infer<typeof newEntrySchema>) => {
    try {
      authFetch(`/api/${incomeExpense}`, {
        method: "POST",
        body: JSON.stringify(values),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        });

      form.reset();
      setOpenDialog(false);
    } catch (error) {
			
		}
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button className="gap-2 items-center justify-center">
          <Plus className="w-4 h-4" />
          New Entry
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Create New Entry</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="incomeExpense"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Income / Expense</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(e) => {
                        field.onChange(e);
                        handleIncomeExpenseChange(e);
                      }}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Income / Expense" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>Money in or money out?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          disabled={incomeExpense === undefined}
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="w-full justify-between font-normal"
                        >
                          {field.value
                            ? categories.find(
                                (category) => category.id === field.value
                              )?.title
                            : incomeExpense === undefined
                            ? "Select income / expense first"
                            : "Select category..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[464px] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search or create category..."
                            onValueChange={setInput}
                          />
                          <CommandList>
                            <CommandEmpty>
                              {input ? (
                                <Button
                                  variant={"ghost"}
                                  className="w-full"
                                  onClick={handleCreateCategory}
                                >
                                  {`Create "${input}"`}
                                </Button>
                              ) : (
                                "No categories found"
                              )}
                            </CommandEmpty>
                            <CommandGroup>
                              {categories.map((category) => (
                                <CommandItem
                                  value={category.id}
                                  key={category.id}
                                  onSelect={() => {
                                    form.setValue("categoryId", category.id);
                                    setOpen(false);
                                  }}
                                >
                                  {category.title}
                                  <CheckIcon
                                    className={cn(
                                      "ml-auto h-4 w-4",
                                      category.id === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormDescription>
                    Select your income / expense category
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Eat out" {...field} />
                  </FormControl>
                  <FormDescription>Type a descriptive title</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="100000000" {...field} />
                  </FormControl>
                  <FormDescription>How much was it?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Description{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="With da bois" {...field} />
                  </FormControl>
                  <FormDescription>Give it a clue</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>When was this happening?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Create</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewEntryDialog;
