import type { PageServerLoad } from '../../../.svelte-kit/types/src/routes/todos/$types';
import { getTodaysAnswer } from '$lib/functions/get-todays-answer';
import { getDateFromURL } from '$lib/functions/get-date-from-url';

function getDate(date = new Date()) {
	const timestamp = date.getTime() - date.getTimezoneOffset() * 60000;
	const correctDate = new Date(timestamp);
	return correctDate;
}

export const load: PageServerLoad = async ({ params, url }) => {
	const queryDate = getDateFromURL(url);
	const timeMachine = Boolean(url.searchParams.get('time-machine'));
	const slug = params['playlistid'] ?? '';
	const slugSplit = slug.split('-');
	const playlistId = slugSplit[slugSplit.length - 1] || '0erQqpBCFFYj0gDam2pnp1';
	const date = getDate(queryDate ?? new Date());
	const playlist = await getTodaysAnswer(playlistId, date);
	return { playlistId, playlist, dateValue: date.valueOf(), timeMachine };
};
