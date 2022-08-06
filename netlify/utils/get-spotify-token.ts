import fetch from 'node-fetch';
type Token = {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
};
type BadToken = {
  error: string;
  error_description: string;
};
export async function getSpotifyToken(): Promise<Token> {
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
