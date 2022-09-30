<script lang="ts">
	import HeardlifyApi from '$lib/functions/heardlify-api';
	import { variables } from '$lib/variables';

	import { ImmutableDate } from '$lib/utils/immutable-date';
	import { useQuery } from '@sveltestack/svelte-query';

	import Line from '../Line/Line.svelte';

	const baseURL = variables.apiBasePath;
	const api = new HeardlifyApi(baseURL);

	let from = new ImmutableDate().setHours(-240, 0, 0, 0).date;
	let to = new ImmutableDate().setHours(24, 0, 0, 0).date;

	$: queryResult = useQuery(['uniqueusers-by-day', { from, to }] as const, async ({ queryKey }) => {
		return api.getUniqueUsersByDay(queryKey[1]);
	});

	function getDate(date = new Date()) {
		const timestamp = date.getTime() - date.getTimezoneOffset() * 60000;
		const correctDate = new Date(timestamp);
		return correctDate;
	}

	function splitDataIntoAxes(
		datapoints: {
			_id: string;
			totalPlays: number;
			totalUniqueUsers: number;
		}[]
	) {
		const dataa = datapoints;
		const xData: string[] = [];
		const yData1: number[] = [];
		const yData2: number[] = [];
		for (const datum of dataa) {
			xData.push(new Date(datum._id).toLocaleDateString(undefined, { day: '2-digit' }));
			yData1.push(datum.totalPlays);
			yData2.push(datum.totalUniqueUsers);
		}
		return { xData, yDatas: [yData1, yData2] };
	}
	$: axes = splitDataIntoAxes($queryResult?.data ?? []);
</script>

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
<div class="chart-container">
	<Line xData={axes.xData} yDatas={axes.yDatas} />
</div>

<table>
	{#if $queryResult.data}
		{#each $queryResult.data as playlist}
			<tr>
				<td>{playlist._id}</td>
				<td>{playlist.totalUniqueUsers}</td>
				<td>{playlist.totalPlays}</td>
			</tr>
		{/each}
	{:else}
		<tr><td span="3">Loading...</td></tr>
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
	.chart-container {
		width: 100%;
		height: 500px;
	}
</style>
