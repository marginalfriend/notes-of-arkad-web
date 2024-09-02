"use server";

import prisma from "@/prisma";
import { z } from "zod";
import bcrypt from "bcrypt";

export const register = async (formData: FormData) => {
  try {
    const schema = z.object({
      username: z.string().min(6),
      password: z.string().min(8),
    });

    const { username, password } = schema.parse(formData);

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.account.create({
      data: {
        username,
        password: hashedPassword, // Store the hashed password
      },
    });

    return {
      message: "User created successfully",
      user,
    };
  } catch (error) {
    return {
      message: "User creation failed",
      error,
    };
  }
};
