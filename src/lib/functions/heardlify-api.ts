type TopPlaylist = {
	_id: {
		playlistId: string;
		playlistName: string;
	};
	totalQuantity: number;
};
type Result = {
	playlistId: string;
	playlistName: string;
	date: Date;
	numberOfGuesses: number | null;
	sid: string;
};
type MostActiveSession = {
	_id: string;
	totalQuantity: number;
};
type ActivityByTime = {
	_id: {
		year: number;
		month: number;
		day: number;
		hour: number;
	};
	totalQuantity: number;
};
type ScoreForPlaylistDay = {
	_id: number | null;
	totalQuantity: number;
};
type Log = {
	sessionId: string;
	eventName: string;
	level: number;
	severity: number;
} & Record<string, unknown>;

export default class HeardlifyApi {
	constructor(private baseURL: string) {}
	async getLogs({
		query,
		limit,
		offset,
		from,
		to
	}: {
		query: string;
		limit: number;
		offset: number;
		from: Date;
		to: Date;
	}) {
		const url = new URL(this.baseURL + '/.netlify/functions/stats--get-logs');
		url.searchParams.append('query', query);
		url.searchParams.append('offset', String(offset));
		url.searchParams.append('limit', String(limit));
		url.searchParams.append('from', from.toISOString());
		url.searchParams.append('to', to.toISOString());

		const response = await fetch(url);
		const body = (await response.json()) as Log[];

		return body;
	}
	async getTopPlaylists({
		limit,
		offset,
		from,
		to
	}: {
		limit: number;
		offset: number;
		from: Date;
		to: Date;
	}) {
		const url = new URL(this.baseURL + '/.netlify/functions/stats--get-top-playlists');
		url.searchParams.append('offset', String(offset));
		url.searchParams.append('limit', String(limit));
		url.searchParams.append('from', from.toISOString());
		url.searchParams.append('to', to.toISOString());

		const response = await fetch(url);
		const body = (await response.json()) as TopPlaylist[];

		return body;
	}
	async getMostActiveSessions({
		limit,
		offset,
		from,
		to
	}: {
		limit: number;
		offset: number;
		from: Date;
		to: Date;
	}) {
		const url = new URL(this.baseURL + '/.netlify/functions/stats--get-most-active-sessions');
		url.searchParams.append('offset', String(offset));
		url.searchParams.append('limit', String(limit));
		url.searchParams.append('from', from.toISOString().split('Z')[0]);
		url.searchParams.append('to', to.toISOString().split('Z')[0]);

		const response = await fetch(url);
		const body = (await response.json()) as MostActiveSession[];

		return body;
	}
	async getActivityByTime({ from, to }: { from: Date; to: Date }) {
		const url = new URL(this.baseURL + '/.netlify/functions/stats--get-activity-by-time');
		url.searchParams.append('from', from.toISOString());
		url.searchParams.append('to', to.toISOString());

		const response = await fetch(url);
		const body = (await response.json()) as ActivityByTime[];

		return body;
	}
	async getSessionHistory({
		sessionId,
		limit,
		offset,
		from,
		to
	}: {
		sessionId: string;
		limit: number;
		offset: number;
		from: Date;
		to: Date;
	}) {
		const url = new URL(this.baseURL + '/.netlify/functions/stats--get-session-history');
		url.searchParams.append('sessionId', sessionId);
		url.searchParams.append('offset', String(offset));
		url.searchParams.append('limit', String(limit));
		url.searchParams.append('from', from.toISOString());
		url.searchParams.append('to', to.toISOString());

		const response = await fetch(url);
		const body = (await response.json()) as Result[];

		return body;
	}
	async getScoresForPlaylistDay({ playlistId, date }: { playlistId: string; date: Date }) {
		const url = new URL(this.baseURL + '/.netlify/functions/stats--get-scores-for-playlist-day');
		url.searchParams.append('playlistId', playlistId);
		url.searchParams.append('date', date.toISOString());

		const response = await fetch(url);
		const body = (await response.json()) as ScoreForPlaylistDay[];

		function getQuantity(numberOfGuesses: number | null) {
			return body
				.filter((o) => o._id === numberOfGuesses)
				.map((o) => o.totalQuantity)
				.reduce((partialSum, a) => partialSum + a, 0);
		}

		const reshaped = [
			{ numberOfGuesses: 1, totalQuantity: getQuantity(1) },
			{ numberOfGuesses: 2, totalQuantity: getQuantity(2) },
			{ numberOfGuesses: 3, totalQuantity: getQuantity(3) },
			{ numberOfGuesses: 4, totalQuantity: getQuantity(4) },
			{ numberOfGuesses: 5, totalQuantity: getQuantity(5) },
			{ numberOfGuesses: 6, totalQuantity: getQuantity(6) },
			{ numberOfGuesses: null, totalQuantity: getQuantity(null) }
		];

		return reshaped;
	}
	async sendFeedback(feedback: { content: string; sid: string }) {
		const url = new URL(this.baseURL + '/.netlify/functions/send-feedback');

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				// 'Content-Type': 'application/json'
			},
			body: JSON.stringify(feedback)
		});
		const success = response.status >= 200 && response.status < 300;
		if (!success) {
			throw new Error('Sending feedback failed');
		}
	}
}
