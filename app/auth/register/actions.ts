"use server";

import prisma from "@/prisma";
import { z } from "zod";
import bcrypt from "bcrypt";

export const register = async (formData: FormData) => {
  try {
    const schema = z.object({
      username: z.string().min(6).max(30),
      password: z.string().min(8).max(100),
    });

    const { username, password } = schema.parse(Object.fromEntries(formData));

    // Check if username already exists
    const existingUser = await prisma.account.findUnique({ where: { username } });
    if (existingUser) {
      return { message: "Username already exists", error: "USERNAME_EXISTS" };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.account.create({
      data: {
        username,
        password: hashedPassword,
        Profile: {
          create: { name: username } // Create a default profile
        }
      },
    });

    return {
      message: "User created successfully",
      user: { id: user.id, username: user.username },
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      message: "User creation failed",
      error: error instanceof z.ZodError ? error.errors : "UNKNOWN_ERROR",
    };
  }
};
