import { getSpotifyPlaylistTracks } from './get-spotify-playlist-tracks';
import { IOption } from './option';

function mapTrackToOption(track: SpotifyApi.TrackObjectFull): IOption {
  const artists = track.artists.map((a) => ({ id: a.id, name: a.name }));
  const formattedArtists = artists.map((a) => a.name).join(', ');
  return {
    id: track.id,
    name: track.name,
    artists: {
      list: artists,
      formatted: formattedArtists,
    },
    formatted: `${formattedArtists} - ${track.name}`,
  };
}
const MAX_SPOTIFY_API_PAGING_LIMIT = 100;

export async function getAllSpotifyPlaylistTracksExpensively(
  playlistId: string,
  bearerToken: string
): Promise<IOption[]> {
  const options: IOption[] = [];

  let offset = 0;
  let limit = MAX_SPOTIFY_API_PAGING_LIMIT;
  let total: number;
  do {
    const page = await getSpotifyPlaylistTracks(
      playlistId,
      bearerToken,
      offset,
      limit
    );
    total = page.total;

    const pageAsOptions = page.items.map((i) => mapTrackToOption(i.track));
    options.push(...pageAsOptions);
    offset += limit;
  } while (offset < total);
  return options;
}
