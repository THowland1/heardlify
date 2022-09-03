import type { PageLoad } from '.svelte-kit/types/src/routes/[playlistid]/$types';
import { getDateFromURL } from '$lib/functions/get-date-from-url';
import { variables } from '$lib/variables';
import HeardlifyApi from '$lib/functions/heardlify-api';

function getDate(date = new Date()) {
	const timestamp = date.getTime() - date.getTimezoneOffset() * 60000;
	const correctDate = new Date(timestamp);
	return correctDate;
}

function isSpotifyId(value: string) {
	const spotifyIdRegexp = new RegExp(
		'^[0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz]{22}$'
	);
	return spotifyIdRegexp.test(value);
}

export const load: PageLoad = async ({ params, url, fetch }) => {
	const queryDate = getDateFromURL(url);
	const timeMachine = Boolean(url.searchParams.get('time-machine'));
	const slug = params['playlistid'] ?? '';
	const slugSplit = slug.split('-');
	const playlistId = slugSplit[slugSplit.length - 1] || '0erQqpBCFFYj0gDam2pnp1';
	if (!isSpotifyId(playlistId)) {
		throw new Error('The given id is not a playlist id');
	}
	const date = getDate(queryDate ?? new Date());

	const baseURL = variables.basePath || url.origin;
	const api = new HeardlifyApi(baseURL, fetch);
	const playlist = await api.getSong(playlistId, date);
	return {
		playlistId,
		playlist,
		dateValue: date.valueOf(),
		timeMachine
	};
};
