import { Handler } from '@netlify/functions';
import mongodbApi from '../../utils/mongodb-api';
import { z } from 'zod';

const numberstring = () => z.preprocess(Number, z.number());
const datestring = () => z.preprocess((val) => new Date(val as string), z.date());

export const handler: Handler = async (event) => {
	const { sessionId, limit, offset, from, to } = z
		.object({
			sessionId: z.string(),
			limit: numberstring(),
			offset: numberstring(),
			from: datestring(),
			to: datestring()
		})
		.parse(event.queryStringParameters);

	const result = await mongodbApi.getSessionHistory({
		sessionId,
		limit,
		offset,
		from: new Date(from),
		to: new Date(to)
	});

	return {
		statusCode: 200,
		body: JSON.stringify(result, null, 2),
		headers: {
			'Access-Control-Allow-Origin': '*' // Allow from anywhere
		}
	};
};
