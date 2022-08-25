import { Handler } from '@netlify/functions';
import { getSpotifyPlaylist } from '../../utils/get-spotify-playlist';
import { getSpotifyToken } from '../../utils/get-spotify-token';
import { generateSVGBuffer } from './generate-svg-buffer';

export const handler: Handler = async (event, context) => {
	console.log(event.queryStringParameters);
	console.log(event.path);
	if (!event.queryStringParameters) {
		return {
			statusCode: 400,
			body: 'Query string parameters required'
		};
	}

	const querySubtitle = event.queryStringParameters.subtitle || event.path.split('/')[2];
	const subtitle = querySubtitle.split('.')[0];

	console.log(subtitle);

	const buffer = await generateSVGBuffer(subtitle);

	const response = {
		statusCode: 200,
		headers: {
			'Content-Type': 'image/png',
			'Access-Control-Allow-Origin': '*' // Allow from anywhere
		},
		body: buffer.toString('base64'),
		isBase64Encoded: true
	};
	return response;
};
