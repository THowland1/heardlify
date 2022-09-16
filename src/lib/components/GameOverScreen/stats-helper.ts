import { evaluateResult, type IResult } from '$lib/functions/result-helper';

import { IStagesSchema } from '$lib/types/IStage';
import { zz } from '$lib/utils/zod-extend';

import { MMath } from '$lib/utils/math-extend';
import { z } from 'zod';

export type DayWithoutResult = {
	daysSinceEpoch: number;
	result: null;
};
export type DayWithResult = {
	daysSinceEpoch: number;
	result: IResult;
};
export type Day = DayWithoutResult | DayWithResult;
function isDayWithResult(value: Day): value is DayWithResult {
	return !!value.result;
}

export type Bar = {
	label: string;
	count: number;
	color: 'positive' | 'negative';
};
export type Summary = {
	total: number;
	totalcorrect: number;
	currentstreak: number;
	maxstreak: number;
};

export function getDaysForPlaylistIdFromLocalStorage(
	browser: boolean,
	playlistId: string
): DayWithResult[] {
	if (!browser) {
		return [];
	}
	const allkeys = Object.keys(localStorage);
	const matchingkeys = allkeys.filter((o) => o.startsWith(playlistId) && o.endsWith('guesses'));
	const matchingvalues = matchingkeys.map(
		(key) => [key, JSON.parse(localStorage.getItem(key) ?? '{}')] as [string, unknown]
	);
	const keystagesschema = z.tuple([z.string(), IStagesSchema]);
	const values = matchingvalues.filter(zz.is(keystagesschema));
	return values
		.map(([key, result]) => {
			const daysSinceEpoch = getDaysSinceEpochFromKey(key);
			return {
				daysSinceEpoch,
				result: evaluateResult(result)
			};
		})
		.sort((a, b) => a.daysSinceEpoch - b.daysSinceEpoch);
}
export function fillInDays(days: DayWithResult[]): Day[] {
	const [min, max] = MMath.minAndMax(...days.map((d) => d.daysSinceEpoch));
	const filledin: Day[] = [];
	for (let i = min; i <= max; i++) {
		const found = days.find((d) => d.daysSinceEpoch === i);
		filledin.push(found ?? { daysSinceEpoch: i, result: null });
	}
	return filledin;
}
export function getBarsFromDaysWithResults(days: DayWithResult[] = []): Bar[] {
	const counts = days.map((o) => o.result.numberOfGuesses);
	const whereNumberOfGuessesIs = (numberOfGuesses: number | null) =>
		counts.filter((o) => o === numberOfGuesses).length;
	return [
		{ label: '1°', count: whereNumberOfGuessesIs(1), color: 'positive' },
		{ label: '2°', count: whereNumberOfGuessesIs(2), color: 'positive' },
		{ label: '3°', count: whereNumberOfGuessesIs(3), color: 'positive' },
		{ label: '4°', count: whereNumberOfGuessesIs(4), color: 'positive' },
		{ label: '5°', count: whereNumberOfGuessesIs(5), color: 'positive' },
		{ label: '6°', count: whereNumberOfGuessesIs(6), color: 'positive' },
		{ label: '×', count: whereNumberOfGuessesIs(null), color: 'negative' }
	];
}

export function getSummaryFromDays(days: Day[]): Summary {
	const daysWithResults = days.filter(isDayWithResult);
	let currentstreak = 0;
	let maxstreak = 0;
	days.forEach((day) => {
		if (isDayWithResult(day) && day.result.type === 'success') {
			currentstreak++;
			maxstreak = Math.max(currentstreak, maxstreak);
		} else {
			currentstreak = 0;
		}
	});
	return {
		total: daysWithResults.length,
		totalcorrect: daysWithResults.filter((d) => d.result.type === 'success').length,
		currentstreak,
		maxstreak
	};
}

function getDaysSinceEpochFromKey(key: string) {
	return Number(key.split(':')[1]);
}
