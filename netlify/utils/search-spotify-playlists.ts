import fetch from 'node-fetch';

export async function searchSpotifyPlaylists(
	bearerToken: string,
	q: string,
	offset = 0,
	limit = 10
): Promise<SpotifyApi.PlaylistSearchResponse> {
	const playlist = (await fetch(
		`https://api.spotify.com/v1/search?q=${q}&type=playlist&offset=${offset}&limit=${limit}`,
		{
			headers: {
				Authorization: `Bearer ${bearerToken}`
			}
		}
	).then((o) => o.json())) as SpotifyApi.PlaylistSearchResponse;
	return playlist as SpotifyApi.PlaylistSearchResponse;
}
