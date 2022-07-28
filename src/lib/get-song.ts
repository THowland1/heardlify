export async function getSong() {
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
