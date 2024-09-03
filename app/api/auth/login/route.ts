import { NextResponse } from "next/server";
import { compare } from "bcrypt";
import prisma from "@/prisma";
import { generateToken } from "@/lib/auth";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  const user = await prisma.account.findUnique({ where: { username } });

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const isPasswordValid = await compare(password, user.password);

  if (!isPasswordValid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await generateToken({ id: user.id, username: user.username });

  const response = NextResponse.json({ token });
  response.cookies.set('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

  return response;
}
