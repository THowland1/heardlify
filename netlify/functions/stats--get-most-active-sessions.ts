import mongodbApi from '$/utils/mongodb-api';
import { Handler } from '@netlify/functions';
import { z } from 'zod';
import NetlifyFunctionHelpers from '$/utils/netlify-function-helpers';

const numberstring = () => z.preprocess(Number, z.number());
const datestring = () => z.preprocess((val) => new Date(val as string), z.date());

export const handler: Handler = async (event) => {
	const { limit, offset, from, to } = z
		.object({
			limit: numberstring(),
			offset: numberstring(),
			from: datestring(),
			to: datestring()
		})
		.parse(event.queryStringParameters);

	const result = await mongodbApi.results.getMostActiveSessions({
		limit,
		offset,
		from: new Date(from),
		to: new Date(to)
	});

	return {
		statusCode: 200,
		body: JSON.stringify(result, null, 2),
		headers: {
			...NetlifyFunctionHelpers.getCorsHeaders(event)
		}
	};
};
