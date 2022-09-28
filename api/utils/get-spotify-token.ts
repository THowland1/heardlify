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

// import spotifyAccountApi from './spotify-account-api';
// type Token = {
// 	access_token: string;
// 	token_type: 'Bearer';
// 	expires_in: number;
// };
// const tokenCache = {
// 	value: null as { token: Token; expiresAt: number } | null
// };

// class Cache<TValue> {
// 	private cache: { [P in string]: TValue } = {};
// 	get(key: string): TValue | null {
// 		return this.cache[key] ?? null;
// 	}
// 	set(key: string, value: TValue) {
// 		this.cache[key] = value;
// 	}
// 	clear(key: string) {
// 		delete this.cache[key];
// 	}
// }

// class Memo<TKey extends string, TValue> {
// 	constructor(
// 		public getter: (key: TKey) => TValue | Promise<TValue>,
// 		public iscachevalid: (value: TValue) => boolean
// 	) {}
// 	cache = new Cache<TValue>();

// 	async get(key: TKey): Promise<TValue> {
// 		const fromCache = this.cache.get(key);
// 		if (fromCache) {
// 			if (this.iscachevalid(fromCache)) {
// 				return fromCache;
// 			} else {
// 				this.cache.clear(key);
// 			}
// 		}
// 		const fromFresh = await this.getter(key);
// 		this.cache.set(key, fromFresh);
// 		return fromFresh;
// 	}
// }

// const getSpotifyTokenMemo = new Memo(getFreshSpotifyToken, hasTokenExpired)

// const MAX_EXECUTION_TIME_IN_MS = 10 * 1000;

// function hasTokenExpired(token: {expiresAt: number}) {
// 	return new Date().valueOf() > token.expiresAt - MAX_EXECUTION_TIME_IN_MS
// }

// export async function getFreshSpotifyToken() {
// 	const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN ?? '';
// 	const token = await spotifyAccountApi.getRefreshTokenToken({ refresh_token });
// 	return {
// 		token,
// 		expiresAt: new Date().valueOf() + token.expires_in * 1000
// 	}
// }
