import { HOST } from '@/constants/routes';

export const serverAuthFetch = async (url: string, cookies: { name: string, value: string }[], options: RequestInit = {}) => {
	const accessToken = await getAccessToken(cookies)

	if (accessToken) {
		const headers = new Headers(options.headers);
		headers.set("Authorization", accessToken);

		const response = await fetch(url, {
			...options,
			headers,
		});

		return response;
	}
}

const getAccessToken = async (cookies: { name: string, value: string }[]) => {
	const accToken = cookies.find(cookie => cookie.name === "accessToken");

	if (accToken) {
		return accToken.value
	}

	const refToken = cookies.find(cookie => cookie.name === "refreshToken");

	if (!refToken) {
		return null;
	}

	const res = await fetch(`${HOST}/api/auth/refresh`, {
		method: "POST",
		headers: {
			'Cookie': `refreshToken=${refToken.value}` // Manually include the refresh token
		},
		credentials: "include",
	})

	if (!res.ok) {
		console.log('[SERVER AUTH FETCH] Refresh token failed', await res.json())
		return null
	}

	const { accessToken } = await res.json();

	return accessToken;
}

const refreshToken = async () => {
	// TODO: Refresh token function which try again several times if failed
}