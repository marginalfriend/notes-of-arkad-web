import { useAuth } from "./use-auth";

export const useAuthFetch = () => {
	const { getAccessToken } = useAuth();

	const authFetch = async (url: string, options: RequestInit = {}) => {
		const token = await getAccessToken();

		if (!token) {
			throw new Error("No access token available");
		}

		const headers = new Headers(options.headers);
		headers.set("Authorization", token);

		const response = await fetch(url, {
			...options,
			headers,
		});

		if (response.status === 401) {
			// Token might have expired during the request
			const newToken = await getAccessToken();
			if (newToken) {
				headers.set("Authorization", newToken);
				return fetch(url, {
					...options,
					headers,
				});
			} else {
				throw new Error("Unable to refresh token");
			}
		}

		return response;
	};

	return authFetch;
};
