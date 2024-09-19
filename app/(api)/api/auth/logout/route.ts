import 'server-only'
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST() {
	const response = NextResponse.json({ message: "Logged out successfully" });
	response.cookies.set('accessToken', '', { maxAge: 0 });
	response.cookies.set('refreshToken', '', { maxAge: 0 });
	revalidatePath("/", "layout")
	return response;
}
