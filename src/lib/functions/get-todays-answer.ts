import type { IDetailedOption, IOption } from '../types/IOption';

const safeLocalStorage: Storage | null = globalThis.localStorage ?? null;

export type IResponse = {
	answer: IDetailedOption;
	options: IOption[];
	playlist: {
		name: string;
		imageUrl: string;
	};
};

const DAY_IN_MS = 24 * 60 * 60 * 1000;

function getFullDaysSinceEpoch(date: Date) {
	return Math.floor(date.valueOf() / DAY_IN_MS);
}

function generateKey(playlistId: string, fullDaysSinceEpoch: number) {
	return `${playlistId}:${fullDaysSinceEpoch}`;
}

export async function getTodaysAnswer(playlistId: string, date: Date): Promise<IResponse> {
	const fromCache = getTodaysAnswerFromCache(playlistId, date);
	if (fromCache) {
		return fromCache;
	}
	const fresh = getTodaysAnswerFresh(playlistId, date);
	return fresh;
}

async function getTodaysAnswerFresh(playlistId: string, date: Date): Promise<IResponse> {
	const response = await fetch(
		`https://heardles.netlify.app/api/get-song?playlist-id=${playlistId}&date=${
			date.toISOString().split('T')[0]
		}`
	);
	const body = (await response.json()) as IResponse;

	const key = generateKey(playlistId, getFullDaysSinceEpoch(date));
	safeLocalStorage?.setItem(key, JSON.stringify(body));

	return body;
}

function getTodaysAnswerFromCache(playlistId: string, date: Date): IResponse | null {
	const key = generateKey(playlistId, getFullDaysSinceEpoch(date));
	const fromCache = safeLocalStorage?.getItem(key);
	if (fromCache) {
		return JSON.parse(fromCache) as IResponse;
	}
	return null;
}
