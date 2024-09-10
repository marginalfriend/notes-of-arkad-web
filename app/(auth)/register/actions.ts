"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcrypt";

export const register = async (formData: FormData) => {
	try {
		const schema = z.object({
			email: z.string().email(),
			username: z.string().min(6).max(30),
			password: z.string().min(8).max(100),
		});

		const { email, username, password } = schema.parse(Object.fromEntries(formData));

		// Check if username already exists
		const existingUser = await prisma.account.findUnique({
			where: { email },
		});
		if (existingUser) {
			return { message: `Account under the email ${email} already exists`, error: "EMAIL_EXISTS" };
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		const account = await prisma.account.create({
			data: {
				email,
				username,
				password: hashedPassword,
			},
		});

		return {
			message: "User created successfully",
			user: { id: account.id, email: account.email, username: account.username },
		};
	} catch (error) {
		console.error("Registration error:", error);
		return {
			message: "User creation failed",
			error: error instanceof z.ZodError ? error.errors : "UNKNOWN_ERROR",
		};
	}
};
