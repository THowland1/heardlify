import { z } from 'zod';
export const ISkippedGuessSchema = z.object({ type: z.literal('skipped') });
export const IEmptyGuessSchema = z.object({ type: z.literal('empty') });
export const IGuessedGuessSchema = z.object({
	type: z.literal('guessed'),
	artists: z.string(),
	name: z.string(),
	isCorrectArtist: z.boolean(),
	isCorrectSong: z.boolean()
});
export const IGuessSchema = z.union([ISkippedGuessSchema, IEmptyGuessSchema, IGuessedGuessSchema]);

export type ISkippedGuess = z.infer<typeof ISkippedGuessSchema>;
export type IEmptyGuess = z.infer<typeof IEmptyGuessSchema>;
export type IGuessedGuess = z.infer<typeof IGuessedGuessSchema>;

export type IGuess = z.infer<typeof IGuessSchema>;
