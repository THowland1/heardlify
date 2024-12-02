import jsonifyError from '$/utils/jsonify-error';
import logs from '$/utils/mongodb-api/logs';
import NetlifyFunctionHelpers from '$/utils/netlify-function-helpers';
import spotifyAccountApi from '$/utils/spotify-account-api';
import spotifyApi from '$/utils/spotify-api';
import { Handler } from '@netlify/functions';

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
function isSpotifyPlaylistUrl(value: string) {
	// e.g. 'https://open.spotify.com/playlist/1p3I3zrVPmJXbmYUcA7kJz?si=iNcr5LgOSG-JMLU6D-o84A'
	const isUrl = value.includes('https://open.spotify.com/playlist/');
	return isUrl;
}
function getPlaylistIdFromPlaylistUrl(value: string) {
	// e.g. 'https://open.spotify.com/playlist/1p3I3zrVPmJXbmYUcA7kJz?si=iNcr5LgOSG-JMLU6D-o84A'
	const path = new URL(value).pathname.split('/');
	const entityId = path[path.length - 1];
	return entityId;
}

export const handler: Handler = async (event, { awsRequestId }) => {
	const userSessionId = NetlifyFunctionHelpers.getCookie(event, 'sid');
	try {
		const q = event.queryStringParameters?.['q'];
		let offset = Number(event.queryStringParameters?.['offset']);
		let limit = Number(event.queryStringParameters?.['limit']);
		if (isNaN(offset) || offset < 0) offset = 0;
		if (isNaN(limit) || limit < 1 || limit > 100) limit = 10;

		if (!q) {
			await logs.logInfo({
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
					...NetlifyFunctionHelpers.getCorsHeaders(event)
				}
			};
		}

		const authToken = await spotifyAccountApi.getClientCredentialsToken();

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
		} else if (isSpotifyPlaylistUrl(q)) {
			const playlistId = getPlaylistIdFromPlaylistUrl(q);
			const item = await spotifyApi.playlists.getOne(playlistId, authToken.access_token);
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
					items: searchResult.playlists.items.filter(Boolean).map(mapSpotifyObjectToDto),
					offset: searchResult.playlists.offset,
					total: searchResult.playlists.total
				}
			};
		}

		await logs.logInfo({
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
				...NetlifyFunctionHelpers.getCacheControlHeader({ public: true, maxAge: { days: 1 } }),
				...NetlifyFunctionHelpers.getCorsHeaders(event)
			}
		};
	} catch (error) {
		await logs.logError({
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
