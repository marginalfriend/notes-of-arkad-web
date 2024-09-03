"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  FormField,
  FormLabel,
  FormControl,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { register } from "./actions";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FormProvider } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Register = () => {
  const { toast } = useToast();
  const form = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit = (data: any) => {
    setIsLoading(true);
    register(data).then((result) => {
      if (result.error) {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: result.message,
        });
      }
    });
    setIsLoading(false);

    router.push("/auth/login");
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <Card className="w-96">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Register
          </CardTitle>
          <CardDescription className="text-sm text-gray-500 text-center">
            Register to Notes of Arkad
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                name="username"
                control={form.control}
                rules={{
                  required: "Username is required",
                  minLength: {
                    value: 6,
                    message: "Username must be at least 6 characters long",
                  },
                  pattern: {
                    value: /^[A-Za-z]+$/,
                    message: "Username must not contain numbers",
                  },
                }}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="username" />
                    </FormControl>
                    {fieldState.error && (
                      <p className="text-red-500">{fieldState.error.message}</p>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters long",
                  },
                  pattern: {
                    value: /^[A-Za-z0-9]+$/,
                    message: "Password must be alphanumeric",
                  },
                }}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        placeholder="********"
                      />
                    </FormControl>
                    {fieldState.error && (
                      <p className="text-red-500">{fieldState.error.message}</p>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                name="confirmPassword"
                control={form.control}
                rules={{
                  required: "Confirm Password is required",
                  validate: (value) =>
                    value === form.getValues("password") ||
                    "Passwords do not match",
                }}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        placeholder="********"
                      />
                    </FormControl>
                    {fieldState.error && (
                      <p className="text-red-500">{fieldState.error.message}</p>
                    )}
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Loading..." : "Register"}
              </Button>
            </form>
          </FormProvider>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/auth/login">
              <span className="text-blue-400 hover:underline">Login here</span>
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
};

export default Register;
