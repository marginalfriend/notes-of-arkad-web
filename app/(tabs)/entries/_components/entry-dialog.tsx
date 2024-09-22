"use client";

import { z } from "zod";
import { cn, formatCurrency, parseCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import React, { ReactNode, useEffect, useState } from "react";
import { ChevronsUpDown } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useEntry } from "@/hooks/use-entry";

const newEntrySchema = z.object({
  date: z.coerce.date(),
  incomeExpense: z.enum(["income", "expense"]),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((value) => !isNaN(Number(value.replace(/,/g, ""))), {
      message: "Amount must be a valid number",
    }),
  description: z.optional(z.coerce.string()),
  categoryId: z.string(),
});

type EntrySchema = z.infer<typeof newEntrySchema> & { id: string };
const keys = newEntrySchema.keyof();
type EntrySchemaKey = z.infer<typeof keys>;

const EntryDialog = ({
  trigger,
  entry,
}: {
  trigger: ReactNode;
  entry?: EntrySchema;
}) => {
  const [categories, setCategories] = useState<{ id: string; title: string }[]>(
    []
  );
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [input, setInput] = useState("");
  const authFetch = useAuthFetch();
  const { toast } = useToast();
  const { addEntry, updateEntry } = useEntry();

  const form = useForm<z.infer<typeof newEntrySchema>>({
    resolver: zodResolver(newEntrySchema),
    defaultValues: {
      amount: "",
      categoryId: "",
      date: new Date(),
      description: "",
    },
  });

  const incomeExpense = form.getValues().incomeExpense;

  const handleIncomeExpenseChange = (e: string) => {
    setCategoriesLoading(true);
    authFetch(`/api/category?incomeExpense=${e}`)
      .then((res) => res.json())
      .then((data) => setCategories(data[`${e}Category`]));
    form.setValue("categoryId", "");
    setCategoriesLoading(false);
  };

  const handleCreateCategory = () => {
    try {
      authFetch("/api/category", {
        method: "POST",
        body: JSON.stringify({
          title: input,
          incomeExpense,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          const newCategory = {
            id: data[`${incomeExpense}Category`].id,
            title: data[`${incomeExpense}Category`].title,
          };
          setCategories([...categories, newCategory]);
          form.setValue("categoryId", newCategory.id);
          setOpen(false);
        });
    } catch (error) {
      toast({
        title: "Error creating category",
        description:
          "There's an error while creating category, please try again.",
      });
    }
  };

  const handleSubmit = async (values: z.infer<typeof newEntrySchema>) => {
    try {
      setSubmitting(true);
      const res = await authFetch(`/api/${incomeExpense}`, {
        method: entry ? "PUT" : "POST",
        body: JSON.stringify(entry ? { id: entry.id, ...values } : values),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error);
      }

      res.json().then((data) => {
        if (entry) {
          updateEntry(data);
        } else {
          addEntry(data);
        }
      });

      form.reset();
      setDialog(false);
    } catch (error) {
      toast({
        title: "Error creating entry",
        description: "There's an error while creating entry, please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (dialog && entry) {
      form.control._disableForm(true);
      handleIncomeExpenseChange(entry.incomeExpense);
      for (const value in form.getValues()) {
        form.setValue(value as EntrySchemaKey, entry[value as EntrySchemaKey]);
      }
      form.control._disableForm(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry, form, dialog]);

  return (
    <Dialog open={dialog} onOpenChange={setDialog}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="h-[90vh] px-0">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-center">
            {entry ? "Update Entry" : "Add Entry"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col pb-6 px-6 h-full w-full overflow-y-scroll">
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
                                {categoriesLoading ? (
                                  "Loading categories..."
                                ) : input ? (
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
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        value={formatCurrency(field.value)}
                        onChange={(e) => {
                          const rawValue = parseCurrency(e.target.value);
                          field.onChange(rawValue);
                        }}
                        type="text"
                        placeholder="1,000,000"
                      />
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
                      <Input
                        type="text"
                        placeholder="With da bois"
                        {...field}
                      />
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

              <Button type="submit" disabled={submitting} className="w-full">
                {entry ? "Update" : "Add"}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EntryDialog;
