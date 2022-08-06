export type IPlaylistSummary = {
  id: string;
  images: { url: string }[];
  name: string;
  description: string;
  owner: {
    display_name: string;
  };
};
export type ISearchPlaylistsResponse = {
  playlists: {
    items: IPlaylistSummary[];
  };
};

export async function searchPlaylists(
  query: string
): Promise<ISearchPlaylistsResponse> {
  const response = await fetch(
    `https://heardles.netlify.app/api/search-playlists?q=${query}`
  );
  const body = await response.json();
  return body;
  // return {
  //   playlists: {
  //     items: [
  //       {
  //         collaborative: false,
  //         description:
  //           "Classics from trailblazing women in hip-hop. Cover: Lil' Kim",
  //         external_urls: {
  //           spotify: 'https://open.spotify.com/playlist/37i9dQZF1DX9iGsUcr0Bpa',
  //         },
  //         href: 'https://api.spotify.com/v1/playlists/37i9dQZF1DX9iGsUcr0Bpa',
  //         id: '37i9dQZF1DX9iGsUcr0Bpa',
  //         images: [
  //           {
  //             height: null,
  //             url: 'https://i.scdn.co/image/ab67706f00000003ebe34d4c1ec8b9869a89e9ee',
  //             width: null,
  //           },
  //         ],
  //         name: 'Door Knockers',
  //         owner: {
  //           display_name: 'Spotify',
  //           external_urls: {
  //             spotify: 'https://open.spotify.com/user/spotify',
  //           },
  //           href: 'https://api.spotify.com/v1/users/spotify',
  //           id: 'spotify',
  //           type: 'user',
  //           uri: 'spotify:user:spotify',
  //         },
  //         primary_color: null,
  //         public: null,
  //         snapshot_id:
  //           'MTYzNjc3ODg1MCwwMDAwMDAwMGEwMDAzYzlkYjNiOGNiOTJhZTRjZWJmMzg5ZDE1NDlj',
  //         tracks: {
  //           href: 'https://api.spotify.com/v1/playlists/37i9dQZF1DX9iGsUcr0Bpa/tracks',
  //           total: 50,
  //         },
  //         type: 'playlist',
  //         uri: 'spotify:playlist:37i9dQZF1DX9iGsUcr0Bpa',
  //       },
  //       {
  //         collaborative: false,
  //         description: "​Boogie along to doo-wop's greatest hits.",
  //         external_urls: {
  //           spotify: 'https://open.spotify.com/playlist/37i9dQZF1DX9GxQjEBVviW',
  //         },
  //         href: 'https://api.spotify.com/v1/playlists/37i9dQZF1DX9GxQjEBVviW',
  //         id: '37i9dQZF1DX9GxQjEBVviW',
  //         images: [
  //           {
  //             height: null,
  //             url: 'https://i.scdn.co/image/ab67706f00000003bfd69ed785a5ee68b4796b07',
  //             width: null,
  //           },
  //         ],
  //         name: 'Doo-Wop Dee Doo',
  //         owner: {
  //           display_name: 'Spotify',
  //           external_urls: {
  //             spotify: 'https://open.spotify.com/user/spotify',
  //           },
  //           href: 'https://api.spotify.com/v1/users/spotify',
  //           id: 'spotify',
  //           type: 'user',
  //           uri: 'spotify:user:spotify',
  //         },
  //         primary_color: null,
  //         public: null,
  //         snapshot_id:
  //           'MTYxMzEyNDQwNywwMDAwMDAwMGUxNmZiMjUxMTI0MWNjMTIzMDcxNjNjYTIzMDk0NmMy',
  //         tracks: {
  //           href: 'https://api.spotify.com/v1/playlists/37i9dQZF1DX9GxQjEBVviW/tracks',
  //           total: 50,
  //         },
  //         type: 'playlist',
  //         uri: 'spotify:playlist:37i9dQZF1DX9GxQjEBVviW',
  //       },
  //       {
  //         collaborative: false,
  //         description: 'Best songs from the video game | Inc Ancient Gods',
  //         external_urls: {
  //           spotify: 'https://open.spotify.com/playlist/4IeI5PQYePhXaezV9HRDIr',
  //         },
  //         href: 'https://api.spotify.com/v1/playlists/4IeI5PQYePhXaezV9HRDIr',
  //         id: '4IeI5PQYePhXaezV9HRDIr',
  //         images: [
  //           {
  //             height: null,
  //             url: 'https://i.scdn.co/image/ab67706c0000bebbc76daa0f68eb46391573f14f',
  //             width: null,
  //           },
  //         ],
  //         name: 'Doom Eternal Soundtrack (2021)',
  //         owner: {
  //           display_name: 'Otaku',
  //           external_urls: {
  //             spotify:
  //               'https://open.spotify.com/user/cl6fjzbk036jzl0wph9sgti3h',
  //           },
  //           href: 'https://api.spotify.com/v1/users/cl6fjzbk036jzl0wph9sgti3h',
  //           id: 'cl6fjzbk036jzl0wph9sgti3h',
  //           type: 'user',
  //           uri: 'spotify:user:cl6fjzbk036jzl0wph9sgti3h',
  //         },
  //         primary_color: null,
  //         public: null,
  //         snapshot_id:
  //           'NTY1OTYsNWE3OTMxYWY5N2UxMjg2ZGUxNDU2YjQzN2I5YTQwYzkyYTFlNzkzYg==',
  //         tracks: {
  //           href: 'https://api.spotify.com/v1/playlists/4IeI5PQYePhXaezV9HRDIr/tracks',
  //           total: 25,
  //         },
  //         type: 'playlist',
  //         uri: 'spotify:playlist:4IeI5PQYePhXaezV9HRDIr',
  //       },
  //       {
  //         collaborative: false,
  //         description: 'una lloradita tranqui',
  //         external_urls: {
  //           spotify: 'https://open.spotify.com/playlist/37i9dQZF1DX4Csi2otB2wp',
  //         },
  //         href: 'https://api.spotify.com/v1/playlists/37i9dQZF1DX4Csi2otB2wp',
  //         id: '37i9dQZF1DX4Csi2otB2wp',
  //         images: [
  //           {
  //             height: null,
  //             url: 'https://i.scdn.co/image/ab67706f000000039587666acf15d4fa8f6202dd',
  //             width: null,
  //           },
  //         ],
  //         name: 'mexican doomer',
  //         owner: {
  //           display_name: 'Spotify',
  //           external_urls: {
  //             spotify: 'https://open.spotify.com/user/spotify',
  //           },
  //           href: 'https://api.spotify.com/v1/users/spotify',
  //           id: 'spotify',
  //           type: 'user',
  //           uri: 'spotify:user:spotify',
  //         },
  //         primary_color: null,
  //         public: null,
  //         snapshot_id:
  //           'MTY1NzI1NjQwMCwwMDAwMDAwMGYyYTcxOTg1YTczMGQ4ZTliZjI4ZGRkY2FlYzY5ZTdj',
  //         tracks: {
  //           href: 'https://api.spotify.com/v1/playlists/37i9dQZF1DX4Csi2otB2wp/tracks',
  //           total: 75,
  //         },
  //         type: 'playlist',
  //         uri: 'spotify:playlist:37i9dQZF1DX4Csi2otB2wp',
  //       },
  //       {
  //         collaborative: false,
  //         description: '',
  //         external_urls: {
  //           spotify: 'https://open.spotify.com/playlist/05jeg6zTEekZ0uVswfb1Bt',
  //         },
  //         href: 'https://api.spotify.com/v1/playlists/05jeg6zTEekZ0uVswfb1Bt',
  //         id: '05jeg6zTEekZ0uVswfb1Bt',
  //         images: [
  //           {
  //             height: 640,
  //             url: 'https://mosaic.scdn.co/640/ab67616d0000b2733e125f0cf92578e02d6aa00eab67616d0000b27371369e9405316fa8b5fe5d46ab67616d0000b273b1edc0f9db649d98341bbcabab67616d0000b273c915b018511be9560190b272',
  //             width: 640,
  //           },
  //           {
  //             height: 300,
  //             url: 'https://mosaic.scdn.co/300/ab67616d0000b2733e125f0cf92578e02d6aa00eab67616d0000b27371369e9405316fa8b5fe5d46ab67616d0000b273b1edc0f9db649d98341bbcabab67616d0000b273c915b018511be9560190b272',
  //             width: 300,
  //           },
  //           {
  //             height: 60,
  //             url: 'https://mosaic.scdn.co/60/ab67616d0000b2733e125f0cf92578e02d6aa00eab67616d0000b27371369e9405316fa8b5fe5d46ab67616d0000b273b1edc0f9db649d98341bbcabab67616d0000b273c915b018511be9560190b272',
  //             width: 60,
  //           },
  //         ],
  //         name: 'Doo Wop Classics',
  //         owner: {
  //           display_name: 'drewbiw1',
  //           external_urls: {
  //             spotify: 'https://open.spotify.com/user/drewbiw1',
  //           },
  //           href: 'https://api.spotify.com/v1/users/drewbiw1',
  //           id: 'drewbiw1',
  //           type: 'user',
  //           uri: 'spotify:user:drewbiw1',
  //         },
  //         primary_color: null,
  //         public: null,
  //         snapshot_id:
  //           'MjgzLDAyY2Y5MDFiZDU0NjkzMWU4Yjg5YjkwYWM1NWMwY2RjNzE0ODc1YzI=',
  //         tracks: {
  //           href: 'https://api.spotify.com/v1/playlists/05jeg6zTEekZ0uVswfb1Bt/tracks',
  //           total: 171,
  //         },
  //         type: 'playlist',
  //         uri: 'spotify:playlist:05jeg6zTEekZ0uVswfb1Bt',
  //       },
  //       {
  //         collaborative: false,
  //         description:
  //           'GOAL HIT 4000 LIKES🔥🔥🔥💥 &amp;#x2F;BEST DOOM MUSIC OF ALL TIME START WITH NUMBER 1!!! ( all Music come from the the newst doom game) Some of the best doom music is not on Spotify :&amp;#x2F;   Daily = ( NEW GOLA 4000 LETS GO 🔥🔥!)',
  //         external_urls: {
  //           spotify: 'https://open.spotify.com/playlist/6asv3pvqWE0ZjSldm225Sd',
  //         },
  //         href: 'https://api.spotify.com/v1/playlists/6asv3pvqWE0ZjSldm225Sd',
  //         id: '6asv3pvqWE0ZjSldm225Sd',
  //         images: [
  //           {
  //             height: 640,
  //             url: 'https://i.scdn.co/image/ab67616d0000b273aad36b64a1a78951b504bc4e',
  //             width: 640,
  //           },
  //         ],
  //         name: 'DOOM MUSIC🔥| all best Music by doom (2022)',
  //         owner: {
  //           display_name: 'DRWGSD',
  //           external_urls: {
  //             spotify:
  //               'https://open.spotify.com/user/ncp2sbzavxjgf9yl0n6b9ftc1',
  //           },
  //           href: 'https://api.spotify.com/v1/users/ncp2sbzavxjgf9yl0n6b9ftc1',
  //           id: 'ncp2sbzavxjgf9yl0n6b9ftc1',
  //           type: 'user',
  //           uri: 'spotify:user:ncp2sbzavxjgf9yl0n6b9ftc1',
  //         },
  //         primary_color: null,
  //         public: null,
  //         snapshot_id:
  //           'MzQsOTNhMDM3N2E2MjBiOGQwMTUwY2FjODFjYzEyNGE3M2U1YWRkMmE2ZA==',
  //         tracks: {
  //           href: 'https://api.spotify.com/v1/playlists/6asv3pvqWE0ZjSldm225Sd/tracks',
  //           total: 16,
  //         },
  //         type: 'playlist',
  //         uri: 'spotify:playlist:6asv3pvqWE0ZjSldm225Sd',
  //       },
  //       {
  //         collaborative: false,
  //         description:
  //           'This is MF DOOM. The essential tracks, all in one playlist.',
  //         external_urls: {
  //           spotify: 'https://open.spotify.com/playlist/37i9dQZF1DZ06evO1nxlXq',
  //         },
  //         href: 'https://api.spotify.com/v1/playlists/37i9dQZF1DZ06evO1nxlXq',
  //         id: '37i9dQZF1DZ06evO1nxlXq',
  //         images: [
  //           {
  //             height: null,
  //             url: 'https://thisis-images.scdn.co/37i9dQZF1DZ06evO1nxlXq-large.jpg',
  //             width: null,
  //           },
  //         ],
  //         name: 'This Is MF DOOM',
  //         owner: {
  //           display_name: 'Spotify',
  //           external_urls: {
  //             spotify: 'https://open.spotify.com/user/spotify',
  //           },
  //           href: 'https://api.spotify.com/v1/users/spotify',
  //           id: 'spotify',
  //           type: 'user',
  //           uri: 'spotify:user:spotify',
  //         },
  //         primary_color: null,
  //         public: null,
  //         snapshot_id:
  //           'Mjc2NjMxOTcsMDAwMDAwMDBiZmRmN2I1N2EzOWFjNGFhOTNiNGNkNjk4Zjk2NDUwZQ==',
  //         tracks: {
  //           href: 'https://api.spotify.com/v1/playlists/37i9dQZF1DZ06evO1nxlXq/tracks',
  //           total: 42,
  //         },
  //         type: 'playlist',
  //         uri: 'spotify:playlist:37i9dQZF1DZ06evO1nxlXq',
  //       },
  //       {
  //         collaborative: false,
  //         description:
  //           '“They are rage…brutal, without mercy. But you…you will be worse. Rip and tear, until it is done.”',
  //         external_urls: {
  //           spotify: 'https://open.spotify.com/playlist/7L2lSCqURdgw0RMglZWpBu',
  //         },
  //         href: 'https://api.spotify.com/v1/playlists/7L2lSCqURdgw0RMglZWpBu',
  //         id: '7L2lSCqURdgw0RMglZWpBu',
  //         images: [
  //           {
  //             height: null,
  //             url: 'https://i.scdn.co/image/ab67706c0000bebb0b336f296dbcb739c626bd0f',
  //             width: null,
  //           },
  //         ],
  //         name: 'DOOM Slayer Workout',
  //         owner: {
  //           display_name: 'th3shur1f',
  //           external_urls: {
  //             spotify: 'https://open.spotify.com/user/th3shur1f',
  //           },
  //           href: 'https://api.spotify.com/v1/users/th3shur1f',
  //           id: 'th3shur1f',
  //           type: 'user',
  //           uri: 'spotify:user:th3shur1f',
  //         },
  //         primary_color: null,
  //         public: null,
  //         snapshot_id:
  //           'MzMxLDdmMjgxODk0MzkxYzI5Yjk0OTc5YTFkNDNhOWQ3YmQxOGNhMjBiN2M=',
  //         tracks: {
  //           href: 'https://api.spotify.com/v1/playlists/7L2lSCqURdgw0RMglZWpBu/tracks',
  //           total: 255,
  //         },
  //         type: 'playlist',
  //         uri: 'spotify:playlist:7L2lSCqURdgw0RMglZWpBu',
  //       },
  //       {
  //         collaborative: false,
  //         description:
  //           'This is The Doors. The essential tracks, all in one playlist.',
  //         external_urls: {
  //           spotify: 'https://open.spotify.com/playlist/37i9dQZF1DZ06evO19UBIk',
  //         },
  //         href: 'https://api.spotify.com/v1/playlists/37i9dQZF1DZ06evO19UBIk',
  //         id: '37i9dQZF1DZ06evO19UBIk',
  //         images: [
  //           {
  //             height: null,
  //             url: 'https://thisis-images.scdn.co/37i9dQZF1DZ06evO19UBIk-large.jpg',
  //             width: null,
  //           },
  //         ],
  //         name: 'This Is The Doors',
  //         owner: {
  //           display_name: 'Spotify',
  //           external_urls: {
  //             spotify: 'https://open.spotify.com/user/spotify',
  //           },
  //           href: 'https://api.spotify.com/v1/users/spotify',
  //           id: 'spotify',
  //           type: 'user',
  //           uri: 'spotify:user:spotify',
  //         },
  //         primary_color: null,
  //         public: null,
  //         snapshot_id:
  //           'Mjc2NjMxOTcsMDAwMDAwMDBmYmEwZDEyYzM1ZmI2NDAxNTZkZjVhMGFiZTczZmJiMQ==',
  //         tracks: {
  //           href: 'https://api.spotify.com/v1/playlists/37i9dQZF1DZ06evO19UBIk/tracks',
  //           total: 44,
  //         },
  //         type: 'playlist',
  //         uri: 'spotify:playlist:37i9dQZF1DZ06evO19UBIk',
  //       },
  //       {
  //         collaborative: false,
  //         description: '',
  //         external_urls: {
  //           spotify: 'https://open.spotify.com/playlist/6rGVLLQVLXVyTl1HtYdSY4',
  //         },
  //         href: 'https://api.spotify.com/v1/playlists/6rGVLLQVLXVyTl1HtYdSY4',
  //         id: '6rGVLLQVLXVyTl1HtYdSY4',
  //         images: [
  //           {
  //             height: 640,
  //             url: 'https://i.scdn.co/image/ab67616d0000b273c6c33db3521f22786d3e1e0e',
  //             width: 640,
  //           },
  //         ],
  //         name: 'Doobie Brothers Greatest Hits',
  //         owner: {
  //           display_name: 'sweiss18',
  //           external_urls: {
  //             spotify: 'https://open.spotify.com/user/sweiss18',
  //           },
  //           href: 'https://api.spotify.com/v1/users/sweiss18',
  //           id: 'sweiss18',
  //           type: 'user',
  //           uri: 'spotify:user:sweiss18',
  //         },
  //         primary_color: null,
  //         public: null,
  //         snapshot_id:
  //           'MjcsZjkxZjA2ODE4ODRmMzI4MzgyMGU0Y2FjOGUzYTM1MWQ0MmJlMDQyZg==',
  //         tracks: {
  //           href: 'https://api.spotify.com/v1/playlists/6rGVLLQVLXVyTl1HtYdSY4/tracks',
  //           total: 11,
  //         },
  //         type: 'playlist',
  //         uri: 'spotify:playlist:6rGVLLQVLXVyTl1HtYdSY4',
  //       },
  //     ],
  //   },
  // };
}
