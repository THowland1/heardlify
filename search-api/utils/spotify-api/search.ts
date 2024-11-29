import pushoverApi from '$/utils/pushover-api';
import fetch from 'node-fetch';

async function searchPlaylists(
	bearerToken: string,
	q: string,
	offset = 0,
	limit = 10
): Promise<SpotifyApi.PlaylistSearchResponse> {
	const url = new URL(`https://api.spotify.com/v1/search`);
	url.searchParams.append('q', q);
	url.searchParams.append('type', 'playlist');
	url.searchParams.append('offset', String(offset));
	url.searchParams.append('limit', String(limit));
	const headers: HeadersInit = {
		Authorization: `Bearer ${bearerToken}`
	};
	const response = await fetch(url.toString(), { headers });

	let data: SpotifyApi.PlaylistSearchResponse;
	try {
		data = (await response.json()) as SpotifyApi.PlaylistSearchResponse;
	} catch (e) {
		const text = await response.text();
		await pushoverApi.trySendNotification(`(${url.toString()}) ${text}`);
		throw e;
	}

	return data as SpotifyApi.PlaylistSearchResponse;
}

export default {
	searchPlaylists
};
