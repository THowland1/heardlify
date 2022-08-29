import type { IStage } from '../types/IStage';

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const safeLocalStorage: Storage | null = globalThis.localStorage ?? null;

function getFullDaysSinceEpoch(date: Date) {
	return Math.floor(date.valueOf() / DAY_IN_MS);
}

function generateKey(playlistId: string, fullDaysSinceEpoch: number) {
	return `${playlistId}:${fullDaysSinceEpoch}:guesses`;
}

export function getTodaysGuesses(playlistId: string, date: Date): IStage[] {
	const fromCache = getTodaysGuessesFromCache(playlistId, date);
	if (fromCache) {
		return fromCache;
	}
	const fromDefault = getTodaysGuessesDefault();
	return fromDefault;
}

function getTodaysGuessesFromCache(playlistId: string, date: Date): IStage[] | null {
	const key = generateKey(playlistId, getFullDaysSinceEpoch(date));
	const fromCache = safeLocalStorage?.getItem(key);
	if (fromCache) {
		return JSON.parse(fromCache) as IStage[];
	}
	return null;
}

function getTodaysGuessesDefault(): IStage[] {
	return [
		{
			duration: 1,
			message: 'A VIRTUOSO PERFORMANCE!',
			guess: { type: 'empty' }
		},
		{ duration: 2, message: 'AN ACT OF GENIUS!', guess: { type: 'empty' } },
		{ duration: 4, message: "YOU'RE A STAR!", guess: { type: 'empty' } },
		{ duration: 7, message: 'WHAT A PRO!', guess: { type: 'empty' } },
		{ duration: 11, message: "YOU'RE A WINNER!", guess: { type: 'empty' } },
		{ duration: 16, message: 'GOOD RESULT!', guess: { type: 'empty' } }
	];
}

export function setTodaysGuesses(playlistId: string, date: Date, value: IStage[]) {
	const key = generateKey(playlistId, getFullDaysSinceEpoch(date));
	safeLocalStorage?.setItem(key, JSON.stringify(value));
}
