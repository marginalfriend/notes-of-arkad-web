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
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FormProvider } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ENTRIES, LOGIN } from "@/constants/routes";

type RegisterFormData = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
};

const Register = () => {
  const { toast } = useToast();
  const { login } = useAuth();
  const form = useForm<RegisterFormData>();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          username: data.username,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Registration successful",
        });
        login(result.token);
        router.push(ENTRIES);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
                name="email"
                control={form.control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value:
                      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: "Invalid email format",
                  },
                }}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
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
                {isLoading ? (
                  <>
                    <span className="mr-2">Loading</span>
                    <span className="animate-spin">⚪</span>
                  </>
                ) : (
                  "Register"
                )}
              </Button>
            </form>
          </FormProvider>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <Link href={LOGIN}>
              <span className="text-blue-400 hover:underline">Login here</span>
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
};

export default Register;
