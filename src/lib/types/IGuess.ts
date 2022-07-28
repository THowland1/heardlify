export type IGuess =
  | { type: 'empty' }
  | { type: 'skipped' }
  | {
      type: 'guessed';
      artists: string;
      name: string;
      isCorrectArtist: boolean;
    };
