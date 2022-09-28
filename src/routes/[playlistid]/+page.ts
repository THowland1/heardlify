import type { PageLoad } from '.svelte-kit/types/src/routes/[playlistid]/$types';
import { getDateFromURL } from '$lib/functions/get-date-from-url';
import { variables } from '$lib/variables';
import HeardlifyApi from '$lib/functions/heardlify-api';

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
	const localdate = queryDate ?? new Date();

	const baseURL = variables.apiBasePath;
	const api = new HeardlifyApi(baseURL, fetch);
	const playlist = await api.getSong(playlistId, localdate);
	return {
		playlistId,
		playlist,
		timeMachine
	};
};
