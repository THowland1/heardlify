import { Handler } from '@netlify/functions';
import { getSpotifyToken } from '$/utils/get-spotify-token';
import { IDetailedOption } from '$/utils/option';
import pushoverApi from '$/utils/pushover-api';
import { seededShuffle } from '$/utils/seeded-shuffle';
import spotifyApi from '$/utils/spotify-api';
import mongodbApi from '$/utils/mongodb-api';
import jsonifyError from '$/utils/jsonify-error';
interface IResult {
	answer: IDetailedOption;
	options: IDetailedOption[];
	playlist: {
		name: string;
		imageUrl: string;
	};
}

type ICache = {
	[key: string]: IResult;
};

const cache: ICache = {};

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export const handler: Handler = async (event, { awsRequestId }) => {
	let userSessionId = '';
	try {
		const playlistId = event.queryStringParameters?.['playlist-id'] ?? '';
		const dateString = event.queryStringParameters?.['date'] ?? '';
		userSessionId = event.queryStringParameters?.['sid'] ?? '';
		let dateValue = Date.parse(dateString);
		if (isNaN(dateValue)) {
			dateValue = new Date().valueOf();
		}
		const fullDaysSinceEpoch = Math.floor(dateValue / DAY_IN_MS);

		const result = await getResult({ fullDaysSinceEpoch, playlistId });

		await mongodbApi.logs.logInfo({
			sessionId: awsRequestId,
			eventName: 'get-song:200',
			data: {
				event: { ...event },
				userSessionId
			}
		});
		await pushoverApi.trySendNotification(`(${userSessionId})get-song:200:${result.playlist.name}`);
		return {
			statusCode: 200,
			body: JSON.stringify(result, null, 2),
			headers: {
				'Access-Control-Allow-Origin': '*' // Allow from anywhere
			}
		};
	} catch (error) {
		await mongodbApi.logs.logError({
			sessionId: awsRequestId,
			eventName: 'get-song:500',
			data: {
				event: { ...event },
				userSessionId,
				error: jsonifyError(error)
			}
		});
		await pushoverApi.trySendNotification(`(${userSessionId})get-song:500:${event.rawUrl}`);

		throw error;
	}
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
	const allPlaylistTracks = await spotifyApi.playlists.getAllTracksExpensively(
		playlistId,
		authToken.access_token
	);

	const playlist = await spotifyApi.playlists.getOne(playlistId, authToken.access_token);
	const totalCount = allPlaylistTracks.length;

	const index = fullDaysSinceEpoch % totalCount;
	const answer = seededShuffle(allPlaylistTracks, playlistId)[index];

	const result = {
		answer,
		options: allPlaylistTracks,
		playlist: {
			name: playlist.name,
			imageUrl: playlist.images[playlist.images.length - 1].url
		}
	};

	return result;
}
