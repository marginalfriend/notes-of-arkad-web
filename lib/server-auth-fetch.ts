import { cookies } from 'next/headers'

export const serverAuthFetch = async (url: string, options: RequestInit = {}) => {
	const cookie = cookies()
	const accessToken = cookie.get('accessToken')?.value

	if (accessToken) {
		const headers = new Headers(options.headers);
		headers.set("Authorization", accessToken);

		const response = await fetch(url, {
			...options,
			headers,
		});
	}
}

const getAccessToken = async () => {
	const cookie = cookies();
	const accToken = cookie.get('accessToken');

	if (accToken) {
		return accToken.value
	}

	const refToken = cookie.get('refreshToken');

	if (!refToken) {
		return null;
	}

	const res = await fetch('/api/auth/refresh', {
		method: "POST",
		credentials: "include",
	})
}

const refreshToken = async () => {

}