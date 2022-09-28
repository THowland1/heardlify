import { evaluateResult, type IResult } from '$lib/functions/result-helper';

import { IStagesSchema } from '$lib/types/IStage';
import { zz } from '$lib/utils/zod-extend';

import { MMath } from '$lib/utils/math-extend';
import { z } from 'zod';

export type DayWithoutResult = {
	epochday: number;
	result: null;
};
export type DayWithResult = {
	epochday: number;
	result: IResult;
};
export type Day = DayWithoutResult | DayWithResult;
function isDayWithResult(value: Day): value is DayWithResult {
	return !!value.result;
}

export type Bar = {
	numberOfGuesses: number | null;
	label: string;
	count: number;
	color: 'positive' | 'negative';
};
export type Summary = {
	total: number;
	totalcorrect: number;
	streak: {
		current: number;
		max: number;
	} | null;
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
			const epochday = getEpochDayFromKey(key);
			return {
				epochday,
				result: evaluateResult(result)
			};
		})
		.sort((a, b) => a.epochday - b.epochday);
}
export function fillInDays(days: DayWithResult[]): Day[] {
	const [min, max] = MMath.minAndMax(...days.map((d) => d.epochday));
	const filledin: Day[] = [];
	for (let i = min; i <= max; i++) {
		const found = days.find((d) => d.epochday === i);
		filledin.push(found ?? { epochday: i, result: null });
	}
	return filledin;
}
export function getBarsFromDaysWithResults(days: DayWithResult[] = []): Bar[] {
	const counts = days.map((o) => o.result.numberOfGuesses);
	const whereNumberOfGuessesIs = (numberOfGuesses: number | null) =>
		counts.filter((o) => o === numberOfGuesses).length;
	return [
		{ numberOfGuesses: 1, label: '1°', count: whereNumberOfGuessesIs(1), color: 'positive' },
		{ numberOfGuesses: 2, label: '2°', count: whereNumberOfGuessesIs(2), color: 'positive' },
		{ numberOfGuesses: 3, label: '3°', count: whereNumberOfGuessesIs(3), color: 'positive' },
		{ numberOfGuesses: 4, label: '4°', count: whereNumberOfGuessesIs(4), color: 'positive' },
		{ numberOfGuesses: 5, label: '5°', count: whereNumberOfGuessesIs(5), color: 'positive' },
		{ numberOfGuesses: 6, label: '6°', count: whereNumberOfGuessesIs(6), color: 'positive' },
		{ numberOfGuesses: null, label: '×', count: whereNumberOfGuessesIs(null), color: 'negative' }
	];
}
export function getBarsFromGlobalDayStats(
	globaldaystats: { numberOfGuesses: number | null; totalQuantity: number }[] = []
): Bar[] {
	const whereNumberOfGuessesIs = (numberOfGuesses: number | null) =>
		globaldaystats.find((o) => o.numberOfGuesses === numberOfGuesses)?.totalQuantity ?? 0;
	return [
		{ numberOfGuesses: 1, label: '1°', count: whereNumberOfGuessesIs(1), color: 'positive' },
		{ numberOfGuesses: 2, label: '2°', count: whereNumberOfGuessesIs(2), color: 'positive' },
		{ numberOfGuesses: 3, label: '3°', count: whereNumberOfGuessesIs(3), color: 'positive' },
		{ numberOfGuesses: 4, label: '4°', count: whereNumberOfGuessesIs(4), color: 'positive' },
		{ numberOfGuesses: 5, label: '5°', count: whereNumberOfGuessesIs(5), color: 'positive' },
		{ numberOfGuesses: 6, label: '6°', count: whereNumberOfGuessesIs(6), color: 'positive' },
		{ numberOfGuesses: null, label: '×', count: whereNumberOfGuessesIs(null), color: 'negative' }
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
		streak: {
			current: currentstreak,
			max: maxstreak
		}
	};
}
export function getSummaryFromGlobalDayStats(
	globaldaystats: { numberOfGuesses: number | null; totalQuantity: number }[] = []
): Summary {
	const total = MMath.sum(...globaldaystats.map((o) => o.totalQuantity));
	const totalcorrect = MMath.sum(
		...globaldaystats.filter((o) => o.numberOfGuesses !== null).map((o) => o.totalQuantity)
	);
	return {
		total,
		totalcorrect,
		streak: null
	};
}

function getEpochDayFromKey(key: string) {
	return Number(key.split(':')[1]);
}
