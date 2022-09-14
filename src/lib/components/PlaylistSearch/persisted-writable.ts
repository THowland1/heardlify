import { writable, type Writable } from 'svelte/store';

export function persistedWritable(
	key: string,
	value: string
): Writable<string> & { useLocalStorage: () => void } {
	const { set, subscribe, update } = writable(value);

	return {
		set,
		subscribe,
		update,
		useLocalStorage: () => {
			const fromStorage = localStorage.getItem(key);
			if (typeof fromStorage === 'string') {
				set(fromStorage);
			}
			subscribe((newvalue) => localStorage.setItem(key, newvalue));
		}
	};
}
