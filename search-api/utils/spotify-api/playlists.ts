import fetch from 'node-fetch';

async function getOne(
	playlistId: string,
	bearerToken: string
): Promise<SpotifyApi.PlaylistObjectFull> {
	const url = new URL(`https://api.spotify.com/v1/playlists/${playlistId}`);
	const headers: HeadersInit = {
		Authorization: `Bearer ${bearerToken}`
	};
	const response = await fetch(url.toString(), { headers });
	const data = (await response.json()) as SpotifyApi.PlaylistObjectFull;
	return data;
}

export default {
	getOne
};
