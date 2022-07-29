import type { IGuess } from './IGuess';

export type IStage = {
  duration: number;
  message: string;
  guess: IGuess;
};
