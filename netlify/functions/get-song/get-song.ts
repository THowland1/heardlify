import { Handler } from '@netlify/functions';
import { getAllSpotifyPlaylistTracksExpensively } from './get-all-spotify-playlist-tracks-expensively';
import { getSpotifyPlaylistTracks } from './get-spotify-playlist-tracks';
import { getSpotifyToken } from './get-spotify-token';
import { IDetailedOption, IOption } from './option';

function createDateAsUTC(date: Date) {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    )
  );
}

const DAY_0_UTC = createDateAsUTC(new Date(2022, 6, 29, 0, 0, 0));
const nowUTC = createDateAsUTC(new Date());
const DAY_IN_MS = 24 * 60 * 60 * 1000;
export const handler: Handler = async (event, context) => {
  const playlistId = '0erQqpBCFFYj0gDam2pnp1';
  const authToken = await getSpotifyToken();
  const allPlaylistTracks = await getAllSpotifyPlaylistTracksExpensively(
    playlistId,
    authToken.access_token
  );
  const totalCount = allPlaylistTracks.length;
  const fullDaysSinceStart = Math.floor(
    (nowUTC.valueOf() - DAY_0_UTC.valueOf()) / DAY_IN_MS
  );
  const index = fullDaysSinceStart % totalCount;
  const theSong = await getSpotifyPlaylistTracks(
    '0erQqpBCFFYj0gDam2pnp1',
    authToken.access_token,
    index,
    1
  );
  const song = theSong.items[0].track;
  const answer: IDetailedOption = {
    artists: {
      list: song.artists.map((a) => ({
        id: a.id,
        name: a.name,
      })),
      formatted: song.artists.map((a) => a.name).join(', '),
    },
    formatted: `${song.artists.map((a) => a.name).join(', ')} - ${song.name}`,
    id: song.id,
    imgSrc: song.album.images.at(-1).url,
    name: song.name,
    year: Number(song.album.release_date.split('-')[0]),
    previewUrl: song.preview_url,
  };

  const result = {
    answer,
    options: allPlaylistTracks,
  };

  return {
    statusCode: 200,
    body: JSON.stringify(result, null, 2),
    headers: {
      'Access-Control-Allow-Origin': '*', // Allow from anywhere
    },
  };
};
