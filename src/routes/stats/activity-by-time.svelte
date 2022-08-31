<script lang="ts">
	import HeardlifyApi from '$lib/functions/heardlify-api';
	import { variables } from '$lib/variables';
	import { page } from '$app/stores';

	import { useQuery } from '@sveltestack/svelte-query';
	import { ImmutableDate } from '$lib/utils/immutable-date';

	const baseURL = variables.basePath || $page.url.origin;
	const api = new HeardlifyApi(baseURL);

	let from = new ImmutableDate().setHours(0, 0, 0, 0).date;
	let to = new ImmutableDate().setHours(24, 0, 0, 0).date;
	$: range = to.valueOf() - from.valueOf();

	$: queryResult = useQuery(['activity-by-time', { from, to }] as const, async ({ queryKey }) => {
		return api.getActivityByTime(queryKey[1]);
	});

	function getDate(date = new Date()) {
		const timestamp = date.getTime() - date.getTimezoneOffset() * 60000;
		const correctDate = new Date(timestamp);
		return correctDate;
	}

	function getLeft({
		year,
		month,
		day,
		hour
	}: {
		year: number;
		month: number;
		day: number;
		hour: number;
	}) {
		const valueof = new Date(year, month - 1, day, hour).valueOf();
		return (100 * (valueof - from.valueOf())) / (to.valueOf() - from.valueOf()) + '%';
	}
	function getWidth() {
		return '5%';
	}
	function getHeight(totalQuantity: number) {
		const data = $queryResult.data ?? [];
		const biggestHeight = Math.max(...data.map((o) => o.totalQuantity));
		return 100 * (totalQuantity / biggestHeight) + '%';
	}
</script>

<svelte:head />
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
<!-- <div class="chart">
	{#if $queryResult.data}
		{#each $queryResult.data as value}
			<div
				class="bar"
				style:width={getWidth()}
				style:left={getLeft(value._id)}
				style:bottom={0}
				style:height={getHeight(value.totalQuantity)}
			/>
		{/each}
	{/if}
</div> -->
<table>
	{#if $queryResult.data}
		{#each $queryResult.data as playlist}
			<tr>
				<td>{playlist._id.year}</td>
				<td>{playlist._id.month}</td>
				<td>{playlist._id.day}</td>
				<td>{playlist._id.hour}</td>
				<td>{playlist.totalQuantity}</td>
			</tr>
		{/each}
	{:else}
		<tr><td span="2">Loading...</td></tr>
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
	.chart {
		position: relative;
		width: 100%;
		height: 300px;
	}
	.bar {
		position: absolute;
		background-color: aqua;
	}
</style>
