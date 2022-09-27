import { generateSVGBuffer } from '$/utils/generate-svg-buffer';
import jsonifyError from '$/utils/jsonify-error';
import mongodbApi from '$/utils/mongodb-api';
import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, { awsRequestId }) => {
	try {
		if (!event.queryStringParameters) {
			await mongodbApi.logs.logInfo({
				sessionId: awsRequestId,
				eventName: 'generate-og-image:400',
				data: {
					event: { ...event }
				}
			});
			return {
				statusCode: 400,
				body: 'Query string parameters required'
			};
		}

		const querySubtitle = event.queryStringParameters.subtitle || event.path.split('/')[2];
		const subtitle = querySubtitle.split('.')[0];

		const buffer = await generateSVGBuffer(subtitle);
		await mongodbApi.logs.logInfo({
			sessionId: awsRequestId,
			eventName: 'generate-og-image:200',
			data: {
				event: { ...event }
			}
		});
		const response = {
			statusCode: 200,
			headers: {
				'Content-Type': 'image/png',
				'Access-Control-Allow-Origin': '*' // Allow from anywhere
			},
			body: buffer.toString('base64'),
			isBase64Encoded: true
		};
		return response;
	} catch (error) {
		await mongodbApi.logs.logError({
			sessionId: awsRequestId,
			eventName: 'generate-og-image:500',
			data: {
				event: { ...event },
				error: jsonifyError(error)
			}
		});
		throw error;
	}
};
