import fetch, { Response } from 'node-fetch';
import pushoverApi from '$/utils/pushover-api';

async function parseResponse<TBody>(res: Response): Promise<TBody> {
	try {
		const json = await res.json();
		return json as TBody;
	} catch (e) {
		if (e instanceof SyntaxError) {
			const text = await res.text();
			await pushoverApi.trySendNotification(text);
			const ee = new Error(text);
			throw ee;
		}
		throw e;
	}
}

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
	return await parseResponse<SpotifyApi.PlaylistSearchResponse>(response);
}

export default {
	searchPlaylists
};
