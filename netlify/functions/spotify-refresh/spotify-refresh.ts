import { Handler } from '@netlify/functions';
import spotifyAccountApi from '../../utils/spotify-account-api';

export const handler: Handler = async (event) => {
	const url = new URL(event.rawUrl);
	const refresh_token = new URL(url).searchParams.get('refresh_token') ?? '';

	const token = await spotifyAccountApi.getRefreshTokenToken({
		refresh_token
	});

	return {
		statusCode: 200,
		body: JSON.stringify(token, null, 2)
	};
};
