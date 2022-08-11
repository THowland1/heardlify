import { Handler } from '@netlify/functions';
import { getAllSpotifyPlaylistTracksExpensively } from '../../utils/get-all-spotify-playlist-tracks-expensively';
import { getSpotifyPlaylist } from '../../utils/get-spotify-playlist';
import { getSpotifyToken } from '../../utils/get-spotify-token';
import { seededShuffle } from '../../utils/seeded-shuffle';

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export const handler: Handler = async (event, context) => {
  const playlistId = event.queryStringParameters['playlist-id'];
  const dateString = event.queryStringParameters['date'];
  let dateValue = Date.parse(dateString);
  if (isNaN(dateValue)) {
    dateValue = new Date().valueOf();
  }
  const fullDaysSinceEpoch = Math.floor(dateValue / DAY_IN_MS);
  const authToken = await getSpotifyToken();
  const allPlaylistTracks = await getAllSpotifyPlaylistTracksExpensively(
    playlistId,
    authToken.access_token
  );

  const playlist = await getSpotifyPlaylist(playlistId, authToken.access_token);
  const totalCount = allPlaylistTracks.length;

  const index = fullDaysSinceEpoch % totalCount;
  const answer = seededShuffle(allPlaylistTracks, playlistId)[index];

  const result = {
    answer,
    options: allPlaylistTracks,
    playlist: { name: playlist.name, imageUrl: playlist.images.at(-1).url },
  };

  return {
    statusCode: 200,
    body: JSON.stringify(result, null, 2),
    headers: {
      'Access-Control-Allow-Origin': '*', // Allow from anywhere
    },
  };
};
