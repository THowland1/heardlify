import jsonifyError from '$/utils/jsonify-error';
import mongodbApi from '$/utils/mongodb-api';
import { Handler } from '@netlify/functions';
import pushoverApi from '$/utils/pushover-api';
import NetlifyFunctionHelpers from '$/utils/netlify-function-helpers';

export const handler: Handler = async (event, { awsRequestId }) => {
	const userSessionId = NetlifyFunctionHelpers.getCookie(event, 'sid');

	try {
		const body = JSON.parse(event.body ?? '{}');
		const result = mongodbApi.results.ResultSchema.omit({ sid: true }).safeParse(body);
		if (!result.success) {
			await pushoverApi.trySendNotification(`(${userSessionId})record-result:400:${event.body}`);
			await mongodbApi.logs.logInfo({
				sessionId: awsRequestId,
				eventName: 'record-result:400',
				data: {
					event: { ...event },
					userSessionId
				}
			});
			return {
				statusCode: 400,
				body: 'Failed to parse body',
				headers: {
					...NetlifyFunctionHelpers.getCorsHeaders(event)
				}
			};
		}

		await pushoverApi.trySendNotification(
			`(${userSessionId})record-result:200:${result.data.playlistName}:${
				result.data.numberOfGuesses
			}:${result.data.date.getDate()}`
		);
		await mongodbApi.logs.logInfo({
			sessionId: awsRequestId,
			eventName: 'record-result:200',
			data: {
				event: { ...event },
				userSessionId
			}
		});
		await mongodbApi.results.tryRecordStat({ ...result.data, sid: userSessionId });
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
			eventName: `search-playlists:500`,
			data: {
				event: { ...event },
				userSessionId,
				error: jsonifyError(error)
			}
		});
		throw error;
	}
};
