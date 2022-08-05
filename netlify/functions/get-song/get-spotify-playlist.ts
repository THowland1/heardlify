import fetch from 'node-fetch';

export async function getSpotifyPlaylist(
  playlistId: string,
  bearerToken: string
): Promise<SpotifyApi.PlaylistObjectFull> {
  const playlist = (await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}`,
    {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    }
  ).then((o) => o.json())) as SpotifyApi.PlaylistObjectFull;
  return playlist as SpotifyApi.PlaylistObjectFull;
}
