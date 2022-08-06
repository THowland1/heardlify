import { Handler } from '@netlify/functions';
import { getSpotifyToken } from '../../utils/get-spotify-token';
import { searchSpotifyPlaylists } from '../../utils/search-spotify-playlists';

export const handler: Handler = async (event, context) => {
  const q = event.queryStringParameters['q'];
  const authToken = await getSpotifyToken();
  const results = await searchSpotifyPlaylists(authToken.access_token, q);

  return {
    statusCode: 200,
    body: JSON.stringify(results, null, 2),
    headers: {
      'Access-Control-Allow-Origin': '*', // Allow from anywhere
    },
  };
};
