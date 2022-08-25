import { Handler } from '@netlify/functions';
import { getSpotifyPlaylist } from '../../utils/get-spotify-playlist';
import { getSpotifyToken } from '../../utils/get-spotify-token';
import { searchSpotifyPlaylists } from '../../utils/search-spotify-playlists';

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

export const handler: Handler = async (event) => {
	const q = event.queryStringParameters?.['q'];

	if (!q) {
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
		const item = await getSpotifyPlaylist(q, authToken.access_token);
		results = {
			playlists: {
				items: [mapSpotifyObjectToDto(item)]
			}
		};
	} else {
		const searchResult = await searchSpotifyPlaylists(authToken.access_token, q);
		results = {
			playlists: {
				items: searchResult.playlists.items.map(mapSpotifyObjectToDto)
			}
		};
	}

	return {
		statusCode: 200,
		body: JSON.stringify(results, null, 2),
		headers: {
			'Access-Control-Allow-Origin': '*' // Allow from anywhere
		}
	};
};
