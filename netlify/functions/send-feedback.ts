import jsonifyError from '$/utils/jsonify-error';
import mongodbApi from '$/utils/mongodb-api';
import { Handler } from '@netlify/functions';
import pushoverApi from '$/utils/pushover-api';

const RESPONSES = {
	_200: {
		statusCode: 200,
		body: '',
		headers: {
			'Access-Control-Allow-Origin': '*'
		}
	},
	_400: {
		statusCode: 400,
		body: 'Failed to parse body',
		headers: {
			'Access-Control-Allow-Origin': '*'
		}
	}
};

export const handler: Handler = async (event, { awsRequestId }) => {
	let userSessionId = '';

	try {
		const body = JSON.parse(event.body ?? '{}');
		body.createdAt = new Date();
		const result = mongodbApi.feedback.FeedbackSchema.safeParse(body);
		if (!result.success) {
			await pushoverApi.trySendNotification(`(null)send-feedback:400:${event.body}`);
			await mongodbApi.logs.logInfo({
				sessionId: awsRequestId,
				eventName: 'send-feedback:400',
				data: {
					event: { ...event },
					userSessionId
				}
			});
			return RESPONSES._400;
		}
		userSessionId = result.data.sid ?? '';

		await pushoverApi.trySendNotification(
			`(${result.data.sid})send-feedback:200:${result.data.content}`
		);
		await mongodbApi.logs.logInfo({
			sessionId: awsRequestId,
			eventName: 'send-feedback:200',
			data: {
				event: { ...event },
				userSessionId
			}
		});
		await mongodbApi.feedback.post(result.data);
		return RESPONSES._200;
	} catch (error) {
		await mongodbApi.logs.logError({
			sessionId: awsRequestId,
			eventName: 'send-feedback:500',
			data: {
				event: { ...event },
				userSessionId,
				error: jsonifyError(error)
			}
		});
		throw error;
	}
};
