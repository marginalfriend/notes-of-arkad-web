import { NextResponse } from "next/server";
import { authenticateUser, generateToken } from "@/lib/auth";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  const user = await authenticateUser(username, password);

  if (user) {
    const token = generateToken(user);
    return NextResponse.json({ token });
  } else {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
}
