import { Handler } from '@netlify/functions';
import fetch from 'node-fetch';
export type IOption = {
  artists: {
    list: {
      id: string;
      name: string;
    }[];
    formatted: string;
  };
  formatted: string;
  name: string;
  id: string;
};
export type IDetailedOption = IOption & {
  imgSrc: string;
  year: number;
  previewUrl: string;
};

function trackToOption(track: SpotifyApi.TrackObjectFull): IOption {
  const artists = track.artists.map((a) => ({ id: a.id, name: a.name }));
  const formattedArtists = artists.map((a) => a.name).join(', ');
  return {
    id: track.id,
    name: track.name,
    artists: {
      list: artists,
      formatted: formattedArtists,
    },
    formatted: `${track.name} - ${formattedArtists}`,
  };
}

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
  const authToken = await getSpotifyToken();
  const playlist = await getSpotifyPlaylistTracks(
    '0erQqpBCFFYj0gDam2pnp1',
    authToken.access_token,
    0,
    1
  );
  const totalCount = playlist.total;
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

  const options = await getAllSpotifyPlaylistTracks(
    '0erQqpBCFFYj0gDam2pnp1',
    authToken.access_token
  );

  const result = {
    answer,
    options,
  };

  return {
    statusCode: 200,
    body: JSON.stringify(result, null, 2),
    headers: {
      'Access-Control-Allow-Origin': '*', // Allow from anywhere
    },
  };
};

async function getAllSpotifyPlaylistTracks(
  playlistId: string,
  bearerToken: string
): Promise<IOption[]> {
  let offset = 0;
  const limit = 100;
  const sets: IOption[][] = [];
  const first = await getSpotifyPlaylistTracks(
    playlistId,
    bearerToken,
    offset,
    limit
  );
  sets.push(first.items.map((i) => trackToOption(i.track)));
  const total = first.total;
  offset += limit;
  while (offset < total) {
    const next = await getSpotifyPlaylistTracks(
      playlistId,
      bearerToken,
      offset,
      limit
    );
    sets.push(first.items.map((i) => trackToOption(i.track)));
  }
  return sets.flat();
}

async function getSpotifyPlaylistTracks(
  playlistId: string,
  bearerToken: string,
  offset: number,
  limit: number
): Promise<SpotifyApi.PlaylistTrackResponse> {
  const playlist = (await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks?offset=${offset}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    }
  ).then((o) => o.json())) as SpotifyApi.PlaylistTrackResponse;
  const totalCount = playlist.total;
  return playlist as SpotifyApi.PlaylistTrackResponse;
}

type Token = {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
};
type BadToken = {
  error: string;
  error_description: string;
};
async function getSpotifyToken(): Promise<Token> {
  var client_id = process.env.SPOTIFY_CLIENT_ID;
  var client_secret = process.env.SPOTIFY_CLIENT_SECRET;

  const form = new URLSearchParams();
  form.append('grant_type', 'client_credentials');

  // Post the payload using Fetch:
  const moo = (await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    body: form,
    headers: {
      Authorization:
        'Basic ' +
        Buffer.from(client_id + ':' + client_secret).toString('base64'),
    },
  }).then((res) => res.json())) as Token | BadToken;

  if (!moo.hasOwnProperty('access_token')) {
    throw new Error(
      'Must have access_token property when getting spotify auth token'
    );
  }

  return moo as Token;

  // request.post(authOptions, function (error, response, body) {
  //   if (!error && response.statusCode === 200) {
  //     var token = body.access_token;
  //   }
  // });
}

export async function getSong(): Promise<PlaylistTracks> {
  return {
    items: [
      {
        track: {
          artists: [
            {
              name: 'Ryan Gosling',
            },
            {
              name: 'Emma Stone',
            },
          ],
          album: {
            name: 'City Of Stars (From La La Land Soundtrack)',
            images: [
              {
                height: 640,
                width: 640,
                url: 'https://i.scdn.co/image/ab67616d0000b273996d684d91fc08b6ec715dbb',
              },
              {
                height: 300,
                width: 300,
                url: 'https://i.scdn.co/image/ab67616d00001e02996d684d91fc08b6ec715dbb',
              },
              {
                height: 64,
                width: 64,
                url: 'https://i.scdn.co/image/ab67616d00004851996d684d91fc08b6ec715dbb',
              },
            ],
          },
          name: 'City Of Stars - From "La La Land" Soundtrack',
          preview_url:
            'https://p.scdn.co/mp3-preview/c7a3378b6ea7652f7dffd7ca398ac2cc005c5f57?cid=774b29d4f13844c495f206cafdad9c86',
        },
      },
    ],
  };
}

interface PlaylistTracks {
  items: {
    track: {
      artists: { name: string }[];
      album: {
        images: { height: number; url: string; width: number }[];
        name: string;
      };
      name: string;
      preview_url: string;
    };
  }[];
}

function dump() {
  const playlistId = '3nKqQhLEflrHEOnCyJ1nyu';
  const token =
    'BQBrY8X6lC9e64GrXwH53_4aoQvO3mkqVt2_2cQIDvXDvgGEMexeadX5b-1q0ogp8VUjooMhKmfEyvZ_agrkpoqC94pAhUmsW0KFfTG-NS5ZxB4EsOrkCsV7PBvasFeQAfebA0S84Rm0VvG13un6UiLmlUuK25n43MV8Y8V78bRblw';
  //  'BQDAjbe7f69dQ-Wrs7VCN2NPs1UkVcLGyXvvA-BkdIXQKD9VS4hfRf04JqompZNUMvu3svUuROSH4bzLpLU_LK2M8VESWMFkLW50tRsPMWpU-e3WxMp06t_SmP5nsvdvYTmuZeJQuWxhvGrIteyWEwQZ00pf5FAZhDyEcBKldP4Miw';
  //'BQBrf3IuzVXjqbcO0LlSUqWUk6lk63k6Pyix_ZuE0kIPjtMGxoAIagNkTrvTSsOIT4vOt65kRYNKN-JOqBZxod4efk3FbUgQOb3WL2bP81Hcbxr-sbm46MSPcsn0G9_KCUFV7ZsDr3VE6ekjmzz28M0xeE4t_B0cz6pcO0XJzSnURw';
  //'BQA9u4EzmL17XC7OpQhuAItxY7tJfGn6jp8vCzuBF0H8Rvey9n2D4clwI-pYZjektTfIdQ0R4ipF2VHOdN3fVrA2F4b0LVRXi97tdvF7ZvWAn8jpY4esenybnbrmdHti0caxanG5ajUp1IlkFPjef9qSyJ-3GqjtPkQ0la7CGhgDRg';
  fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks?offset=0&limit=1&locale=en-GB,en-US;q=0.9,en;q=0.8`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  function trimPlaylistTracks(data: PlaylistTracks): PlaylistTracks {
    console.log(data.items[0]);
    return {
      items: data.items.map((item) => ({
        track: {
          artists: item.track.artists.map((artist) => ({
            name: artist.name,
          })),
          album: {
            name: item.track.album.name,
            images: item.track.album.images.map((image) => ({
              height: image.height,
              width: image.width,
              url: image.url,
            })),
          },
          name: item.track.name,
          preview_url: item.track.preview_url,
        },
      })),
    };
  }
}
