import * as cookie from 'cookie';

function getCookie(event: { headers: { cookie?: string } }, cookieKey: string) {
	const cookieHeader = event.headers.cookie ?? '';
	const cookies = cookie.parse(cookieHeader);
	return cookies[cookieKey];
}

function getCorsHeaders(event: { headers: { origin?: string } }): Record<string, string> {
	const ALLOWED_ORIGINS = ['http://localhost:5173', 'https://heardlify.app'];
	const origin = event.headers.origin ?? '';
	if (ALLOWED_ORIGINS.includes(origin)) {
		return {
			'Access-Control-Allow-Credentials': 'true',
			'Access-Control-Allow-Origin': origin
		};
	} else {
		return {};
	}
}

export default {
	getCookie,
	getCorsHeaders
};
