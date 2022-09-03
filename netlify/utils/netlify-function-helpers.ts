import * as cookie from 'cookie';

function getCookie(event: { headers: { cookie?: string } }, cookieKey: string) {
	const cookieHeader = event.headers.cookie ?? '';
	const cookies = cookie.parse(cookieHeader);
	return cookies[cookieKey];
}

function getCorsHeaders(event: { headers: { origin?: string } }): Record<string, string> {
	const ALLOWED_ORIGINS = [
		'http://localhost:5173',
		'http://localhost:4173',
		'https://heardlify.app'
	];
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
function getCacheControlHeader(params: {
	public?: boolean;
	maxAge?: { days?: number; hours?: number; minutes?: number; seconds?: number };
}): Record<'Cache-Control', string> {
	const pieces: string[] = [];
	if (params.public === true) {
		pieces.push('public');
	}
	if (params.maxAge) {
		const { days, hours, minutes, seconds } = params.maxAge;
		let maxAge = 0;
		maxAge += (days ?? 0) * 24 * 60 * 60;
		maxAge += (hours ?? 0) * 60 * 60;
		maxAge += (minutes ?? 0) * 60;
		maxAge += seconds ?? 0;
		pieces.push(`max-age=${maxAge}`);
	}
	return {
		'Cache-Control': pieces.join(', ')
	};
}

export default {
	getCookie,
	getCorsHeaders,
	getCacheControlHeader
};
