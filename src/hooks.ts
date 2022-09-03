import type { Handle } from '@sveltejs/kit';
import * as cookie from 'cookie';

export const handle: Handle = async ({ event, resolve }) => {
	const cookies = cookie.parse(event.request.headers.get('cookie') || '');

	event.locals.sessionid =
		cookies['sid'] ?? cookies['sessionid'] ?? crypto.randomUUID().slice(0, 4);

	const response = await resolve(event);

	if (!cookies['sid']) {
		// if this is the first time the user has visited this app,
		// set a cookie so that we recognise them when they return
		response.headers.set(
			'set-cookie',
			cookie.serialize('sid', event.locals.sessionid, {
				path: '/',
				httpOnly: true
			})
		);
	}

	return response;
};
