import { Handler } from '@netlify/functions';
import { getSpotifyToken } from '$/utils/get-spotify-token';
import spotifyApi from '$/utils/spotify-api';
import mongodbApi from '$/utils/mongodb-api';
import jsonifyError from '$/utils/jsonify-error';

export type IPlaylistSummary = {
	id: string;
	images: { url: string }[];
	name: string;
	description: string;
	owner: {
		display_name: string;
	};
};
export type ISearchPlaylistsResponse = {
	playlists: {
		items: IPlaylistSummary[];
		offset: number;
		total: number;
	};
};

function mapSpotifyObjectToDto(item: SpotifyApi.PlaylistObjectSimplified): IPlaylistSummary {
	return {
		id: item.id,
		description: item.description ?? '',
		images: item.images.map((image) => ({ url: image.url })),
		name: item.name,
		owner: {
			display_name: item.owner.display_name ?? ''
		}
	};
}

function isSpotifyId(value: string) {
	const spotifyIdRegexp = new RegExp(
		'^[0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz]{22}$'
	);
	return spotifyIdRegexp.test(value);
}

export const handler: Handler = async (event, { awsRequestId }) => {
	let userSessionId = '';

	try {
		const q = event.queryStringParameters?.['q'];
		let offset = Number(event.queryStringParameters?.['offset']);
		let limit = Number(event.queryStringParameters?.['limit']);
		userSessionId = event.queryStringParameters?.['sid'] ?? '';
		if (isNaN(offset) || offset < 0) offset = 0;
		if (isNaN(limit) || limit < 1 || limit > 100) limit = 10;

		if (!q) {
			await mongodbApi.logs.logInfo({
				sessionId: awsRequestId,
				eventName: 'search-playlists:400',
				data: {
					event: { ...event },
					userSessionId
				}
			});
			return {
				statusCode: 400,
				body: JSON.stringify({ error: { status: 400, message: 'No search query' } }, null, 2),
				headers: {
					'Access-Control-Allow-Origin': '*' // Allow from anywhere
				}
			};
		}

		const authToken = await getSpotifyToken();

		let results: ISearchPlaylistsResponse;
		if (isSpotifyId(q)) {
			const item = await spotifyApi.playlists.getOne(q, authToken.access_token);
			results = {
				playlists: {
					items: [mapSpotifyObjectToDto(item)],
					offset: 0,
					total: 1
				}
			};
		} else {
			const searchResult = await spotifyApi.search.searchPlaylists(
				authToken.access_token,
				q,
				offset,
				limit
			);
			results = {
				playlists: {
					items: searchResult.playlists.items.map(mapSpotifyObjectToDto),
					offset: searchResult.playlists.offset,
					total: searchResult.playlists.total
				}
			};
		}

		await mongodbApi.logs.logInfo({
			sessionId: awsRequestId,
			eventName: 'search-playlists:200',
			data: {
				event: { ...event },
				userSessionId
			}
		});

		return {
			statusCode: 200,
			body: JSON.stringify(results, null, 2),
			headers: {
				'Access-Control-Allow-Origin': '*' // Allow from anywhere
			}
		};
	} catch (error) {
		await mongodbApi.logs.logError({
			sessionId: awsRequestId,
			eventName: 'search-playlists:500',
			data: {
				event: { ...event },
				userSessionId,
				error: jsonifyError(error)
			}
		});
		throw error;
	}
};
