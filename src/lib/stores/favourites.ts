import { z } from 'zod';
import { writable } from 'svelte/store';
import { browser } from '$app/env';

const IFavouriteSchema = z.object({
	id: z.string(),
	images: z.array(z.object({ url: z.string() })),
	name: z.string(),
	description: z.string(),
	owner: z.object({
		display_name: z.string()
	})
});
export type IFavourite = z.infer<typeof IFavouriteSchema>;
function isFavourite(value: unknown): value is IFavourite {
	return IFavouriteSchema.safeParse(value).success;
}

function getFavouritesFromLocalStorage(): IFavourite[] {
	if (!browser) return [];
	const storedString = localStorage.getItem('favourites') ?? '{}';
	const stored = JSON.parse(storedString);
	if (!Array.isArray(stored)) {
		return [];
	}
	const parsedStored = stored.filter(isFavourite);
	return parsedStored;
}
function setFavouritesInLocalStorage(value: IFavourite[]) {
	if (!browser) return;
	const stringifiedValue = JSON.stringify(value);
	localStorage.setItem('favourites', stringifiedValue);
}

export const favourites = writable(getFavouritesFromLocalStorage());
favourites.subscribe((value) => setFavouritesInLocalStorage(value));

export function addFavourite(value: IFavourite) {
	favourites.update((current) => [...current, value]);
}
export function removeFavourite({ id }: Pick<IFavourite, 'id'>) {
	favourites.update((current) => {
		const index = current.findIndex((v) => v.id === id);
		const before = current.slice(0, index);
		const after = current.slice(index + 1);
		return [...before, ...after];
	});
}
