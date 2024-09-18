import { cookies } from 'next/headers'

export const serverAuthFetch = async (url: string, options: RequestInit = {}) => {
	const accessToken = await getAccessToken()

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

const getAccessToken = async () => {
	const cookie = cookies();
	const accToken = cookie.get('accessToken');
	console.log('[SERVER AUTH FETCH] Access token: ', accToken)

	if (accToken) {
		return accToken.value
	}

	const refToken = cookie.get('refreshToken');
	console.log('[SERVER AUTH FETCH] Refresh token: ', refToken?.value)

	if (!refToken) {
		console.log('[SERVER AUTH FETCH] No refresh token')
		return null;
	}

	const res = await fetch('http://localhost:3000/api/auth/refresh', {
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