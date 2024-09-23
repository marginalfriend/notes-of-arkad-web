import { headers } from "next/headers";
import "server-only"
import { getAccount, handleError } from "../utils";
import { NextResponse } from "next/server";

export const GET = async () => {
	try {
		const token = headers().get("Authorization");
		const account = await getAccount(token);

		if (!account) {
			return NextResponse.json({ error: "Account not found" }, { status: 401 });
		}

		const user = {
			name: account.username
		}

		return NextResponse.json({ user }, { status: 200 })
	} catch (error) {
		return handleError(error)
	}
}