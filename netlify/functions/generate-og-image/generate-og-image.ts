import { Handler } from '@netlify/functions';
import { getSpotifyPlaylist } from '../../utils/get-spotify-playlist';
import { getSpotifyToken } from '../../utils/get-spotify-token';
import { generateSVGBuffer } from './generate-svg-buffer';

async function getPlaylistName(playlistId) {
	const authToken = await getSpotifyToken();
	console.log(authToken);
	const playlist = await getSpotifyPlaylist(playlistId, authToken.access_token);
	console.log(playlist);
	return playlist.name;
}

export const handler: Handler = async (event, context) => {
	console.log(event.queryStringParameters);
	console.log(event.path);
	if (!event.queryStringParameters) {
		return {
			statusCode: 400,
			body: 'Query string parameters required'
		};
	}

	const queryPlaylistId = event.queryStringParameters['playlist-id']
		? event.queryStringParameters['playlist-id']
		: event.path.split('/')[2];
	const playlistId = queryPlaylistId.split('.')[0];
	let playlistName = '';
	try {
		playlistName = await getPlaylistName(playlistId);
	} catch {}

	console.log(playlistName);

	const buffer = await generateSVGBuffer(playlistName);

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
