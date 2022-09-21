import { z } from 'zod';
import { writable } from 'svelte/store';
import { browser } from '$app/env';

const IRecentSchema = z.object({
	id: z.string(),
	images: z.array(z.object({ url: z.string() })),
	name: z.string(),
	description: z.string(),
	owner: z.object({
		display_name: z.string()
	}),
	epochday: z.number()
});
export type IRecent = z.infer<typeof IRecentSchema>;
function isRecent(value: unknown): value is IRecent {
	return IRecentSchema.safeParse(value).success;
}

function getRecentsFromLocalStorage(): IRecent[] {
	if (!browser) return [];
	const storedString = localStorage.getItem('recents') ?? '{}';
	const stored = JSON.parse(storedString);
	if (!Array.isArray(stored)) {
		return [];
	}
	const parsedStored = stored.filter(isRecent);
	return parsedStored;
}
function setRecentsInLocalStorage(value: IRecent[]) {
	if (!browser) return;
	const stringifiedValue = JSON.stringify(value);
	localStorage.setItem('recents', stringifiedValue);
}

export const recents = writable(getRecentsFromLocalStorage());
recents.subscribe((value) => setRecentsInLocalStorage(value));

export function addRecent(value: IRecent) {
	recents.update((current) => [...current, value]);
}
export function removeRecent({ id }: Pick<IRecent, 'id'>) {
	recents.update((current) => {
		const index = current.findIndex((v) => v.id === id);
		const before = current.slice(0, index);
		const after = current.slice(index + 1);
		return [...before, ...after];
	});
}
