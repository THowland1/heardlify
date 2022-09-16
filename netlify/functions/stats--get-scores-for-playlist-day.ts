import { Handler } from '@netlify/functions';
import mongodbApi from '$/utils/mongodb-api';
import { z } from 'zod';
import NetlifyFunctionHelpers from '$/utils/netlify-function-helpers';

const datestring = () => z.preprocess((val) => new Date(val as string), z.date());

export const handler: Handler = async (event) => {
	const { playlistId, date } = z
		.object({
			playlistId: z.string(),
			date: datestring()
		})
		.parse(event.queryStringParameters);

	const result = await mongodbApi.results.getScoresForPlaylistDay({
		playlistId,
		date
	});

	return {
		statusCode: 200,
		body: JSON.stringify(result, null, 2),
		headers: {
			...NetlifyFunctionHelpers.getCorsHeaders(event)
		}
	};
};
