import jsonifyError from '$/utils/jsonify-error';
import mongodbApi from '$/utils/mongodb-api';
import NetlifyFunctionHelpers from '$/utils/netlify-function-helpers';
import pushoverApi from '$/utils/pushover-api';
import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, { awsRequestId }) => {
	const userSessionId = NetlifyFunctionHelpers.getCookie(event, 'sid');

	try {
		const body = JSON.parse(event.body ?? '{}');
		body.createdAt = new Date();
		const result = mongodbApi.feedback.FeedbackSchema.omit({ sid: true }).safeParse(body);
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
			return {
				statusCode: 400,
				body: '',
				headers: {
					...NetlifyFunctionHelpers.getCorsHeaders(event)
				}
			};
		}

		await pushoverApi.trySendNotification(
			`(${userSessionId})send-feedback:200:${result.data.content}`
		);
		await mongodbApi.logs.logInfo({
			sessionId: awsRequestId,
			eventName: 'send-feedback:200',
			data: {
				event: { ...event },
				userSessionId
			}
		});
		await mongodbApi.feedback.post({ ...result.data, sid: userSessionId });
		return {
			statusCode: 200,
			body: '',
			headers: {
				...NetlifyFunctionHelpers.getCorsHeaders(event)
			}
		};
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
