import { Handler } from '@netlify/functions';
import { Logger } from '../../utils/logger';
import { generateSVGBuffer } from './generate-svg-buffer';

export const handler: Handler = async (event, { awsRequestId }) => {
	const logger = new Logger();

	try {
		if (!event.queryStringParameters) {
			logger.log({
				...Logger.LOGGER_LEVELS.info,
				sessionId: awsRequestId,
				eventName: 'generate-og-image:400',
				event: { ...event }
			});
			await logger.tryFlush();
			return {
				statusCode: 400,
				body: 'Query string parameters required'
			};
		}

		const querySubtitle = event.queryStringParameters.subtitle || event.path.split('/')[2];
		const subtitle = querySubtitle.split('.')[0];

		const buffer = await generateSVGBuffer(subtitle);

		logger.log({
			...Logger.LOGGER_LEVELS.info,
			sessionId: awsRequestId,
			eventName: 'generate-og-image:200',
			event: { ...event }
		});
		await logger.tryFlush();
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
		logger.log({
			...Logger.LOGGER_LEVELS.error,
			sessionId: awsRequestId,
			eventName: 'generate-og-image:500',
			event: { ...event },
			error
		});
		await logger.tryFlush();
		throw error;
	}
};
