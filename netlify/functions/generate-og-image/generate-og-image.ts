import { Handler } from '@netlify/functions';
import { getSpotifyPlaylist } from '../../utils/get-spotify-playlist';
import { getSpotifyToken } from '../../utils/get-spotify-token';

import chromium from 'chrome-aws-lambda';
const puppeteer = require('puppeteer-core');

async function getPlaylistName(playlistId: string) {
  const authToken = await getSpotifyToken();
  const playlist = await getSpotifyPlaylist(playlistId, authToken.access_token);
  return playlist.name;
}

export const handler: Handler = async (event, context) => {
  const playlistId = event.queryStringParameters['playlistId'];
  let playlistName = '';
  try {
    playlistName = await getPlaylistName(playlistId);
  } catch {}

  const browser = await puppeteer.launch({
    args: [],
    executablePath:
      process.env.CHROME_EXECUTABLE_PATH || (await chromium.executablePath),
    headless: true,
  });

  const page = await browser.newPage();

  await page.setViewport({ width: 1200, height: 630 });
  await page.setContent(html(playlistName));
  const buffer = await page.screenshot({ type: 'png' });

  const response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'image/png',
      'Access-Control-Allow-Origin': '*', // Allow from anywhere
      'Cache-Control':
        'public, immutable, no-transform, s-maxage=31536000, max-age=31536000',
    },
    body: buffer.toString('base64'),
    isBase64Encoded: true,
  };

  await browser.close();

  return response;
};

const html = (content = '') => /* html */ `
<html>
    <head>
        <style>
            body {
                display: flex;
                flex-direction: column;
                background: #000;
                color: white;
                font-family: sans-serif;
                font-size: 120px;
                align-items: center;
                justify-content: space-around;
                height: 100%;
            }
            svg {
                height: 80px;
                width: 80px;
            }
            .title {
                font-weight: 600;
            }
            .subtitle {
                background: #444;
                padding: 20px 30px;
                border-radius:20px ;
                display: flex;
                align-items:center;
                gap: 20px;
                font-size: 80px;
                text-overflow: ellipsis;
                max-width: 800px;
                overflow: hidden;
            }
        </style>
    </head>
<body>
    <span></span>
    <span class="title">HEARDLES</span>
        ${
          content
            ? /* html */ `
    <span class="subtitle">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.7318 7.09254C10.153 5.56115 5.8998 5.42004 3.43794 6.16701C3.34363 6.19526 3.2446 6.20476 3.14657 6.19498C3.04853 6.18519 2.95342 6.15631 2.86671 6.11C2.78001 6.06369 2.70341 6.00087 2.64135 5.92515C2.57929 5.84943 2.53299 5.76231 2.50512 5.66881C2.44693 5.47966 2.46664 5.27542 2.55994 5.10058C2.65325 4.92573 2.8126 4.79443 3.0033 4.73527C5.82882 3.87729 10.5267 4.04313 13.4956 5.80523C13.8512 6.01655 13.968 6.4753 13.7572 6.83039C13.7078 6.91474 13.6419 6.98853 13.5634 7.04747C13.4849 7.10641 13.3953 7.14932 13.2999 7.17372C13.2045 7.19811 13.1052 7.20349 13.0076 7.18955C12.9101 7.17562 12.8163 7.14264 12.7318 7.09254ZM12.6472 9.36086C12.605 9.43048 12.549 9.49109 12.4829 9.53918C12.4167 9.58726 12.3415 9.62186 12.2618 9.64096C12.182 9.66006 12.0991 9.66328 12.0181 9.65044C11.9369 9.6376 11.8592 9.60895 11.7895 9.56616C9.6399 8.24409 6.36148 7.86157 3.81783 8.63395C3.73915 8.65747 3.65654 8.66535 3.57475 8.65715C3.49297 8.64894 3.41364 8.62482 3.34132 8.58616C3.26901 8.54749 3.20514 8.49506 3.15339 8.43188C3.10164 8.3687 3.06303 8.29601 3.0398 8.21801C2.99175 8.06033 3.00844 7.89028 3.08625 7.7447C3.16406 7.59912 3.29674 7.48974 3.45552 7.44027C6.36081 6.55822 9.97315 6.98554 12.4425 8.50355C12.7351 8.68411 12.8278 9.06796 12.6472 9.36086ZM11.6684 11.5389C11.6349 11.5947 11.5904 11.6434 11.5375 11.682C11.4847 11.7207 11.4247 11.7485 11.3609 11.7639C11.2971 11.7794 11.2308 11.7821 11.166 11.7719C11.1011 11.7618 11.0389 11.7389 10.983 11.7048C9.10386 10.5565 6.74003 10.2971 3.95506 10.9337C3.89095 10.9481 3.82461 10.9498 3.75983 10.9387C3.69506 10.9276 3.63316 10.9039 3.57767 10.8691C3.52219 10.8342 3.47423 10.7888 3.43656 10.7355C3.39889 10.6822 3.37225 10.6221 3.35818 10.5586C3.32817 10.4302 3.35079 10.2952 3.42111 10.1833C3.49142 10.0714 3.60369 9.9916 3.73334 9.96138C6.78058 9.26457 9.39453 9.56482 11.5036 10.8535C11.6166 10.9233 11.6973 11.0344 11.7281 11.1627C11.759 11.291 11.7376 11.4262 11.6684 11.5389ZM8.00002 0C3.58125 0 0 3.58171 0 8C0 12.419 3.58125 16 8.00002 16C12.4181 16 16 12.419 16 8C16 3.58171 12.4188 0 8.00002 0Z"
            fill="currentColor"
          />
        </svg>
       <span>${content}</span>
       </span>
       `
            : '<span></span>'
        }

    <span></span>
</body>
</html>
`;
