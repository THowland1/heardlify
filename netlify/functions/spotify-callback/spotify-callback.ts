import { Handler } from '@netlify/functions';
import spotifyAccountApi from '../../utils/spotify-account-api';

export const handler: Handler = async (event) => {
	const url = new URL(event.rawUrl);
	const code = new URL(url).searchParams.get('code') ?? '';
	url.search = '';
	const token = spotifyAccountApi.getAuthorisationCodeToken({
		code,
		redirect_uri: url.toString()
	});

	return {
		statusCode: 200,
		body: JSON.stringify(token, null, 2)
	};
};
