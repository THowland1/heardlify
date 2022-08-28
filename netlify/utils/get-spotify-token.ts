import spotifyAccountApi from './spotify-account-api';
type Token = {
	access_token: string;
	token_type: 'Bearer';
	expires_in: number;
};
const tokenCache = {
	value: null as { token: Token; expiresAt: number } | null
};

const MAX_EXECUTION_TIME_IN_MS = 10 * 1000;

export async function getSpotifyToken(): Promise<Token> {
	const fromCache = getSpotifyTokenFromCache();
	if (fromCache) {
		console.log('Using token from cache');
		return fromCache;
	}
	const fresh = await getFreshSpotifyToken();
	setSpotifyTokenInCache(fresh);
	console.log('Using fresh token');
	return fresh;
}

function setSpotifyTokenInCache(token: Token) {
	return (tokenCache.value = {
		token,
		expiresAt: new Date().valueOf() + token.expires_in * 1000
	});
}
function getSpotifyTokenFromCache() {
	const cachedToken = tokenCache.value;
	if (!cachedToken) {
		return null;
	}
	if (new Date().valueOf() > cachedToken.expiresAt - MAX_EXECUTION_TIME_IN_MS) {
		tokenCache.value = null;
		return null;
	}
	return cachedToken.token;
}

export async function getFreshSpotifyToken(): Promise<Token> {
	const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN ?? '';
	console.log({ refresh_token });
	const token = await spotifyAccountApi.getRefreshTokenToken({ refresh_token });

	return token as Token;
}
