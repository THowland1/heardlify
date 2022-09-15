import { setContext, getContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const key = Symbol();

export function setDateContext(date: Date) {
	const content = writable(date);
	return setContext<Writable<Date>>(key, content);
}
export function getDateContext() {
	return getContext<Writable<Date>>(key);
}
