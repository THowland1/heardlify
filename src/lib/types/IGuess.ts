export type ISkippedGuess = { type: 'skipped' };
export type IEmptyGuess = { type: 'empty' };
export type IGuessedGuess = {
  type: 'guessed';
  artists: string;
  name: string;
  isCorrectArtist: boolean;
  isCorrectSong: boolean;
};

export type IGuess = IEmptyGuess | ISkippedGuess | IGuessedGuess;
