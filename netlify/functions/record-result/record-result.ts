import { Handler } from '@netlify/functions';
import { Logger } from '../../utils/logger';
import mongodbApi, { ResultSchema } from '../../utils/mongodb-api';
import pushoverApi from '../../utils/pushover-api';

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
	const body = JSON.parse(event.body ?? '{}');
	const result = ResultSchema.safeParse(body);
	if (!result.success) {
		await pushoverApi.trySendNotification(`record-result:400:${event.body}`);
		await Logger.tryLogInfo({
			sessionId: awsRequestId,
			eventName: 'record-result:400',
			event
		});
		return RESPONSES._400;
	}

	await pushoverApi.trySendNotification(
		`record-result:200:${result.data.playlistName}:${
			result.data.numberOfGuesses
		}:${result.data.date.getDate()}`
	);
	await Logger.tryLogInfo({
		sessionId: awsRequestId,
		eventName: 'record-result:200',
		event
	});
	await mongodbApi.tryRecordStat(result.data);
	return RESPONSES._200;
};
