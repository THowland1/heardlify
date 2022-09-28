import { IGuessSchema } from './IGuess';

import { z } from 'zod';

export const IStageSchema = z.object({
	duration: z.number(),
	message: z.string(),
	guess: IGuessSchema
});
export const IStagesSchema = z.array(IStageSchema);

export type IStage = z.infer<typeof IStageSchema>;
export type IStages = z.infer<typeof IStagesSchema>;
