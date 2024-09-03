import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import prisma from "@/prisma";
import { generateTokens } from "@/lib/auth";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  const existingUser = await prisma.account.findUnique({ where: { username } });
  if (existingUser) {
    return NextResponse.json(
      { error: "Username already exists" },
      { status: 400 }
    );
  }

  const hashedPassword = await hash(password, 10);

  const user = await prisma.account.create({
    data: {
      username,
      password: hashedPassword,
      Profile: {
        create: { name: username },
      },
    },
  });

  const { accessToken, refreshToken } = await generateTokens({ id: user.id, username: user.username });

  const response = NextResponse.json({ accessToken });
  response.cookies.set("token", accessToken);
  response.cookies.set("refreshToken", refreshToken);

  return response;
}
