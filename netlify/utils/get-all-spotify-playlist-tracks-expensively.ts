import { getSpotifyPlaylistTracks } from './get-spotify-playlist-tracks';
import { IDetailedOption, IOption } from './option';

function mapTrackToDetailedOption(
  track: SpotifyApi.TrackObjectFull
): IDetailedOption {
  const artists = track.artists.map((a) => ({ id: a.id, name: a.name }));
  const formattedArtists = artists.map((a) => a.name).join(', ');

  return {
    artists: {
      list: artists,
      formatted: formattedArtists,
    },
    formatted: `${formattedArtists} - ${track.name}`,
    id: track.id,
    imgSrc: track.album.images.at(-1).url,
    name: track.name,
    year: Number(track.album.release_date.split('-')[0]),
    previewUrl: track.preview_url,
  };
}
const MAX_SPOTIFY_API_PAGING_LIMIT = 100;

export async function getAllSpotifyPlaylistTracksExpensively(
  playlistId: string,
  bearerToken: string
): Promise<IDetailedOption[]> {
  const options: IDetailedOption[] = [];

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

    const pageAsOptions = page.items.map((i) =>
      mapTrackToDetailedOption(i.track)
    );
    options.push(
      ...pageAsOptions.filter((o) => typeof o.previewUrl === 'string')
    );
    offset += limit;
  } while (offset < total);
  return options;
}
