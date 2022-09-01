const clientId = process.env.SPOTIFY_CLIENT_ID ?? '';

import { Handler } from '@netlify/functions';
import { randomUUID } from 'crypto';

export const handler: Handler = async (event) => {
	const requestUrl = new URL(event.rawUrl);
	const redirectURL = new URL(`${requestUrl.origin}/.netlify/functions/spotify--callback`);

	const state = randomUUID();
	const scope = 'user-read-private user-read-email';

	const spotifyURL = new URL('https://accounts.spotify.com/authorize');
	spotifyURL.searchParams.append('response_type', 'code');
	spotifyURL.searchParams.append('client_id', clientId);
	spotifyURL.searchParams.append('scope', scope);
	spotifyURL.searchParams.append('redirect_uri', redirectURL.toString());
	spotifyURL.searchParams.append('state', state);

	return {
		statusCode: 302,
		headers: { Location: spotifyURL.toString() }
	};
};
