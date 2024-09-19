import 'server-only'
import { NextRequest, NextResponse } from "next/server";
import { verifyRefreshToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("refreshToken")?.value;

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const user = await verifyRefreshToken(token);

  if (!user) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  return NextResponse.json({ user });
}
