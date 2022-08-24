import type { PageServerLoad } from '../../../.svelte-kit/types/src/routes/todos/$types';
import { getTodaysAnswer } from '$lib/functions/get-todays-answer';

function getDate(date = new Date()) {
	const timestamp = date.getTime() - date.getTimezoneOffset() * 60000;
	const correctDate = new Date(timestamp);
	return correctDate;
}

export const load: PageServerLoad = async ({ params }) => {
	const slug = params['playlistid'] ?? '';
	const slugSplit = slug.split('-');
	const playlistId = slugSplit[slugSplit.length - 1] || '0erQqpBCFFYj0gDam2pnp1';
	const date = getDate();
	const playlist = await getTodaysAnswer(playlistId, date);
	return { playlistId, playlist };
};
