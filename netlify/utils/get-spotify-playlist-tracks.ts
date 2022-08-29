import fetch from 'node-fetch';

export async function getSpotifyPlaylistTracks(
	playlistId: string,
	bearerToken: string,
	offset: number,
	limit: number
): Promise<SpotifyApi.PlaylistTrackResponse> {
	const playlist = (await fetch(
		`https://api.spotify.com/v1/playlists/${playlistId}/tracks?offset=${offset}&limit=${limit}`,
		{
			headers: {
				Authorization: `Bearer ${bearerToken}`
			}
		}
	).then((o) => o.json())) as SpotifyApi.PlaylistTrackResponse;
	return playlist as SpotifyApi.PlaylistTrackResponse;
}
