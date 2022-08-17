import { Handler } from '@netlify/functions';
import { getAllSpotifyPlaylistTracksExpensively } from '../../utils/get-all-spotify-playlist-tracks-expensively';
import { getSpotifyPlaylist } from '../../utils/get-spotify-playlist';
import { getSpotifyToken } from '../../utils/get-spotify-token';
import { IDetailedOption } from '../../utils/option';
import { seededShuffle } from '../../utils/seeded-shuffle';
interface IResult {
  answer: IDetailedOption;
  options: IDetailedOption[];
  playlist: {
    name: string;
    imageUrl: any;
  };
}

type ICache = {
  [key: string]: IResult;
};

const cache: ICache = {};

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export const handler: Handler = async (event, context) => {
  const playlistId = event.queryStringParameters['playlist-id'];
  const dateString = event.queryStringParameters['date'];
  let dateValue = Date.parse(dateString);
  if (isNaN(dateValue)) {
    dateValue = new Date().valueOf();
  }
  const fullDaysSinceEpoch = Math.floor(dateValue / DAY_IN_MS);

  const result = await getResult({ fullDaysSinceEpoch, playlistId });

  return {
    statusCode: 200,
    body: JSON.stringify(result, null, 2),
    headers: {
      'Access-Control-Allow-Origin': '*', // Allow from anywhere
    },
  };
};

interface ICacheKeys {
  fullDaysSinceEpoch: number;
  playlistId: string;
}
async function getResult(keys: ICacheKeys) {
  const fromCache = getResultFromCache(keys);
  if (fromCache) {
    console.log('Getting result from cache');
    return fromCache;
  }
  console.log('Getting result fresh');
  const fresh = await getResultFresh(keys);
  setResultInCache(keys, fresh);
  return fresh;
}

function generateKey(keys: ICacheKeys): string {
  return `${keys.playlistId}:${keys.fullDaysSinceEpoch}`;
}
function getResultFromCache(keys: ICacheKeys): IResult | null {
  const key = generateKey(keys);
  const value = cache[key] || null;
  return value;
}
function setResultInCache(keys: ICacheKeys, value: IResult) {
  const key = generateKey(keys);
  cache[key] = value;
}

async function getResultFresh(keys: ICacheKeys): Promise<IResult> {
  const { fullDaysSinceEpoch, playlistId } = keys;
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
    playlist: {
      name: playlist.name,
      imageUrl: playlist.images[playlist.images.length - 1].url,
    },
  };

  return result;
}
