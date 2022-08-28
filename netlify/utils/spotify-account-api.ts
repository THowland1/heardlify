import fetch from 'node-fetch';

const client_id = process.env.SPOTIFY_CLIENT_ID ?? '';
const client_secret = process.env.SPOTIFY_CLIENT_SECRET ?? '';

async function getAuthorisationCodeToken({
	code,
	redirect_uri
}: {
	code: string;
	redirect_uri: string;
}) {
	return await getFreshSpotifyToken<AuthorizationCodeGrantResponse>({
		grant_type: 'authorization_code',
		code,
		redirect_uri
	});
}
async function getClientCredentialsToken() {
	return await getFreshSpotifyToken<ClientCredentialsGrantResponse>({
		grant_type: 'client_credentials'
	});
}
async function getRefreshTokenToken({ refresh_token }: { refresh_token: string }) {
	return await getFreshSpotifyToken<RefreshAccessTokenResponse>({
		grant_type: 'refresh_token',
		refresh_token
	});
}

async function getFreshSpotifyToken<T>(body: Record<string, string>): Promise<T> {
	// Post the payload using Fetch:
	const response = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		body: new URLSearchParams(body),
		headers: {
			Authorization: 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
		}
	});
	const responseBody = await response.json();
	if (!Object.prototype.hasOwnProperty.call(responseBody, 'access_token')) {
		throw new Error('Must have access_token property when getting spotify auth token');
	}
	return responseBody as T;
}
export default {
	getAuthorisationCodeToken,
	getClientCredentialsToken,
	getRefreshTokenToken
};

/**
 * Response returned when using Client Credentials authentication flow
 * https://developer.spotify.com/documentation/general/guides/authorization-guide/#example-4
 */
interface ClientCredentialsGrantResponse {
	access_token: string;
	expires_in: number;
	token_type: string;
}

/**
 * Response returned when requesting for access token
 * https://developer.spotify.com/documentation/general/guides/authorization-guide/#2-have-your-application-request-refresh-and-access-tokens-spotify-returns-access-and-refresh-tokens
 */
interface AuthorizationCodeGrantResponse {
	access_token: string;
	expires_in: number;
	refresh_token: string;
	scope: string;
	token_type: string;
}

/**
 * Response returned when requesting new access token (via refresh token)
 * https://developer.spotify.com/documentation/general/guides/authorization-guide/#4-requesting-a-refreshed-access-token-spotify-returns-a-new-access-token-to-your-app
 * https://developer.spotify.com/documentation/general/guides/authorization-guide/#6-requesting-a-refreshed-access-token
 */
interface RefreshAccessTokenResponse {
	access_token: string;
	expires_in: number;
	refresh_token?: string | undefined;
	scope: string;
	token_type: string;
}
