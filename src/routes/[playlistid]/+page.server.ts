import type { PageServerLoad } from '../../../.svelte-kit/types/src/routes/[playlistid]/$types';
import { getTodaysAnswer } from '$lib/functions/get-todays-answer';
import { getDateFromURL } from '$lib/functions/get-date-from-url';
import { variables } from '$lib/variables';

function getDate(date = new Date()) {
	const timestamp = date.getTime() - date.getTimezoneOffset() * 60000;
	const correctDate = new Date(timestamp);
	return correctDate;
}

export const load: PageServerLoad = async ({ params, url, locals }) => {
	const queryDate = getDateFromURL(url);
	const timeMachine = Boolean(url.searchParams.get('time-machine'));
	const slug = params['playlistid'] ?? '';
	const slugSplit = slug.split('-');
	const playlistId = slugSplit[slugSplit.length - 1] || '0erQqpBCFFYj0gDam2pnp1';
	const date = getDate(queryDate ?? new Date());

	const baseURL = variables.basePath || url.origin;
	const playlist = await getTodaysAnswer(baseURL, playlistId, date, locals.sessionid);
	return {
		playlistId,
		playlist,
		dateValue: date.valueOf(),
		timeMachine,
		sessionId: locals.sessionid
	};
};
