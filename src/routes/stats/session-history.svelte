<script lang="ts">
	import HeardlifyApi from '$lib/functions/heardlify-api';
	import { variables } from '$lib/variables';

	import { ImmutableDate } from '$lib/utils/immutable-date';
	import { useQuery } from '@sveltestack/svelte-query';

	const baseURL = variables.apiBasePath;
	const api = new HeardlifyApi(baseURL);

	let limit = 10;
	let offset = 0;
	let from = new ImmutableDate().setHours(0, 0, 0, 0).date;
	let to = new ImmutableDate().setHours(24, 0, 0, 0).date;
	let sessionId = '';

	$: queryResult = useQuery(
		['session-history', { sessionId, limit, offset, from, to }] as const,
		async ({ queryKey }) => {
			return api.getSessionHistory(queryKey[1]);
		},
		{ enabled: Boolean(sessionId) }
	);

	function getDate(date = new Date()) {
		const timestamp = date.getTime() - date.getTimezoneOffset() * 60000;
		const correctDate = new Date(timestamp);
		return correctDate;
	}
</script>

<svelte:head />

<input type="string" bind:value={sessionId} />
<input type="number" bind:value={offset} />
<input type="number" bind:value={limit} />
<input
	type="datetime-local"
	value={getDate(from).toISOString().split('Z')[0]}
	on:change={(e) => (from = new Date(e.currentTarget.value))}
/>
<input
	type="datetime-local"
	value={getDate(to).toISOString().split('Z')[0]}
	on:change={(e) => (to = new Date(e.currentTarget.value))}
/>
<table>
	{#if $queryResult.data}
		{#each $queryResult.data as historyItem}
			<tr>
				<td>{historyItem.sid}</td>
				<td>{historyItem.playlistName}</td>
				<td>{historyItem.numberOfGuesses}</td>
				<td>{historyItem.date}</td>
			</tr>
		{/each}
	{:else}
		<tr><td span="4">Loading...</td></tr>
	{/if}
</table>

<style>
	:root {
		--padding: 32px 8px;
	}
	@media only screen and (min-width: 600px) {
		:root {
			--padding: 32px 16px;
		}
	}
	table {
		width: 100%;
		border-collapse: collapse;
	}
	tr:first-child td {
		border-top: solid 1px var(--color-line);
	}
	tr td {
		border-bottom: solid 1px var(--color-line);
	}
</style>
