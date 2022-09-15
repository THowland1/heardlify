import type { IStage } from '$lib/types/IStage';

type IResult =
	| {
			type: 'failure';
			numberOfGuesses: null;
	  }
	| {
			type: 'success';
			numberOfGuesses: number;
			message: string;
			time: number;
	  };
export function evaluateResult(stages: IStage[]): IResult {
	const correctStage = stages.find((s) => s.guess.type === 'guessed' && s.guess.isCorrectSong);
	if (!correctStage) {
		return { type: 'failure', numberOfGuesses: null };
	}
	const numberOfGuesses = stages.filter((s) => s.guess.type !== 'empty').length;
	return {
		type: 'success',
		numberOfGuesses,
		message: correctStage.message,
		time: correctStage.duration
	};
}
