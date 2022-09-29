<script context="module" lang="ts">
	import type { SvelteComponent, SvelteComponentTyped } from 'svelte';
	import { getContext, setContext } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import Alert from '$lib/components/Alert/Alert.svelte';

	const key = Symbol();

	type ComponentAndProps<ComponentType extends SvelteComponent> =
		ComponentType extends SvelteComponentTyped<infer Props>
			? { component: typeof SvelteComponent; props: Props }
			: never;

	type PortalComponents = ComponentAndProps<SvelteComponent>[];

	export function setPortalContext(initial: PortalComponents) {
		const content = writable(initial);
		return setContext<Writable<PortalComponents>>(key, content);
	}
	export function getPortalContext() {
		const content = getContext<Writable<PortalComponents>>(key);
		async function addAlert(text: string) {
			let onclose = () => {
				return;
			};
			const promise = new Promise<void>((resolve) => (onclose = resolve));
			const alert: ComponentAndProps<Alert> = {
				component: Alert,
				props: {
					alert: text,
					onclose
				}
			};
			content.update((current) => [...current, alert]);
			await promise;
			content.update((current_1) => current_1.filter((o) => o !== alert));
		}
		return { content, addAlert };
	}
</script>

<script lang="ts">
	const components = setPortalContext([]);
</script>

<slot />
{#each $components as component}
	<svelte:component this={component.component} {...component.props}
		>{component.props.slot}</svelte:component
	>
{/each}
