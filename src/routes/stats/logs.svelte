<script lang="ts">
	import HeardlifyApi from '$lib/functions/heardlify-api';
	import { variables } from '$lib/variables';
	import { page } from '$app/stores';

	import { useQuery } from '@sveltestack/svelte-query';
	import { ImmutableDate } from '$lib/utils/immutable-date';

	const baseURL = variables.basePath || $page.url.origin;
	const api = new HeardlifyApi(baseURL);

	let query = '';
	let limit = 1;
	let offset = 0;
	let from = new ImmutableDate().setHours(0, 0, 0, 0).date;
	let to = new ImmutableDate().setHours(24, 0, 0, 0).date;

	$: queryResult = useQuery(
		['logs', { query, limit, offset, from, to }] as const,
		async ({ queryKey }) => {
			return api.getLogs(queryKey[1]);
		}
	);

	function getDate(date = new Date()) {
		const timestamp = date.getTime() - date.getTimezoneOffset() * 60000;
		const correctDate = new Date(timestamp);
		return correctDate;
	}
</script>

<svelte:head />

<input bind:value={query} />
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
		{#each $queryResult.data as playlist}
			<tr>
				<td>
					<label>
						<input type="checkbox" class="checkbox" />
						<pre class="log">{JSON.stringify(playlist, null, 2)}</pre>
					</label>
				</td>
			</tr>
		{/each}
	{:else}
		<tr><td>Loading...</td></tr>
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
		max-width: 600px;
		text-overflow: ellipsis;
		overflow-x: auto;
		overflow-y: hidden;
	}
	.checkbox {
		position: absolute;
		opacity: 0;
	}
	.log {
		max-height: 100px;
	}
	:checked + .log {
		max-height: inherit;
	}
</style>
