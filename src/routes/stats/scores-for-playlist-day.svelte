<script lang="ts">
	import HeardlifyApi from '$lib/functions/heardlify-api';
	import { variables } from '$lib/variables';
	import { page } from '$app/stores';

	import { useQuery } from '@sveltestack/svelte-query';
	import { ImmutableDate } from '$lib/utils/immutable-date';

	const baseURL = variables.basePath || $page.url.origin;
	const api = new HeardlifyApi(baseURL);

	let date = new ImmutableDate().setHours(24, 0, 0, 0).date;
	let playlistId = '';

	$: queryResult = useQuery(
		['scores-for-playlist-day', { date, playlistId }] as const,
		async ({ queryKey }) => {
			return api.getScoresForPlaylistDay(queryKey[1]);
		},
		{ enabled: Boolean(playlistId) }
	);

	function getDate(date = new Date()) {
		const timestamp = date.getTime() - date.getTimezoneOffset() * 60000;
		const correctDate = new Date(timestamp);
		return correctDate;
	}
</script>

<svelte:head />

<input type="string" bind:value={playlistId} />
<input
	type="datetime-local"
	value={getDate(date).toISOString().split('Z')[0]}
	on:change={(e) => (date = new Date(e.currentTarget.value))}
/>
<table>
	{#if $queryResult.data}
		{#each $queryResult.data as historyItem}
			<tr>
				<td>{historyItem.numberOfGuesses}</td>
				<td>{historyItem.totalQuantity}</td>
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
