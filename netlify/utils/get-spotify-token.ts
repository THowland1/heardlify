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
const tokenCache = {
  value: null as { token: Token; expiresAt: number } | null,
};

const MAX_EXECUTION_TIME_IN_MS = 10 * 1000;

export async function getSpotifyToken(): Promise<Token> {
  const fromCache = getSpotifyTokenFromCache();
  if (fromCache) {
    console.log('Using token from cache');
    return fromCache;
  }
  const fresh = await getFreshSpotifyToken();
  setSpotifyTokenInCache(fresh);
  console.log('Using fresh token');
  return fresh;
}

function setSpotifyTokenInCache(token: Token) {
  return (tokenCache.value = {
    token,
    expiresAt: new Date().valueOf() + token.expires_in * 1000,
  });
}
function getSpotifyTokenFromCache() {
  const cachedToken = tokenCache.value;
  if (!cachedToken) {
    return null;
  }
  if (new Date().valueOf() > cachedToken.expiresAt - MAX_EXECUTION_TIME_IN_MS) {
    tokenCache.value = null;
    return null;
  }
  return cachedToken.token;
}

export async function getFreshSpotifyToken(): Promise<Token> {
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
