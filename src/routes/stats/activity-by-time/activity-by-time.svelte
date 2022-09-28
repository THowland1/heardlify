<script lang="ts">
	import HeardlifyApi from '$lib/functions/heardlify-api';
	import { variables } from '$lib/variables';
	import { LayerCake, Svg } from 'layercake';

	import { ImmutableDate } from '$lib/utils/immutable-date';
	import { useQuery } from '@sveltestack/svelte-query';
	import Area from './Area.svelte';
	import AxisX from './AxisX.svelte';
	import AxisY from './AxisY.svelte';
	import Line from './Line.svelte';

	const baseURL = variables.apiBasePath;
	const api = new HeardlifyApi(baseURL);

	let from = new ImmutableDate().setHours(0, 0, 0, 0).date;
	let to = new ImmutableDate().setHours(24, 0, 0, 0).date;

	$: queryResult = useQuery(['activity-by-time', { from, to }] as const, async ({ queryKey }) => {
		return api.getActivityByTime(queryKey[1]);
	});

	function getDate(date = new Date()) {
		const timestamp = date.getTime() - date.getTimezoneOffset() * 60000;
		const correctDate = new Date(timestamp);
		return correctDate;
	}

	const xKey = 'myX';
	const yKey = 'myY';
	$: data = $queryResult?.data?.map((datum) => ({
		[xKey]: new Date(datum._id.year, datum._id.month, datum._id.day, datum._id.hour).valueOf(),
		[yKey]: datum.totalQuantity
	})) ?? [{ [xKey]: 1, [yKey]: 1 }];

	const nullAsNumber = null as unknown as number;
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
<div class="chart-container">
	<LayerCake
		padding={{ right: 10, bottom: 20, left: 25 }}
		x={xKey}
		y={yKey}
		yDomain={[0, nullAsNumber]}
		{data}
	>
		<Svg>
			<AxisX
				formatTick={(d) => {
					const asDate = new Date(d);
					return asDate.getHours();
				}}
			/>
			<AxisY ticks={4} />
			<Line />
			<Area />
		</Svg>
	</LayerCake>
</div>
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
	.chart-container {
		width: 100%;
		height: 500px;
	}
</style>
