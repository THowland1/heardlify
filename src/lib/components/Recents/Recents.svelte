<script lang="ts">
	import { recents, type IRecent } from '$lib/stores/recents';
	import { EpochDay } from '$lib/utils/epoch-day';
	import PlaylistSummary from '../PlaylistSummary/PlaylistSummary.svelte';
	import PlaylistSummarySkeleton from '../PlaylistSummary/PlaylistSummarySkeleton.svelte';
	import { AArray } from '$lib/utils/array-extend';
	export let date: Date;
	$: epochDay = EpochDay.fromDate(date);

	function groupRecents(recents: IRecent[], thisEpochDay: number) {
		type Group = { name: string; recents: IRecent[] };
		const playlistIds: string[] = [];
		const futures: IRecent[] = [];
		const todays: IRecent[] = [];
		const last7days: IRecent[] = [];
		const last30days: IRecent[] = [];
		const morethan30days: IRecent[] = [];

		const recentsSortedByDateDescending = recents.sort((a, b) => b.epochday - a.epochday);
		for (const recent of recentsSortedByDateDescending) {
			if (playlistIds.includes(recent.id)) {
				continue;
			}
			const daysago = thisEpochDay - recent.epochday;
			if (daysago < 0) {
				futures.push(recent);
				playlistIds.push(recent.id);
			} else if (daysago === 0) {
				todays.push(recent);
				playlistIds.push(recent.id);
			} else if (daysago < 7) {
				last7days.push(recent);
				playlistIds.push(recent.id);
			} else if (daysago < 30) {
				last30days.push(recent);
				playlistIds.push(recent.id);
			} else if (daysago >= 30) {
				morethan30days.push(recent);
				playlistIds.push(recent.id);
			}
		}
		let groups: Group[] = [];
		if (futures.length) {
			groups.push({ name: 'Future', recents: futures });
		}
		if (todays.length) {
			groups.push({ name: 'Today', recents: todays });
		}
		if (last7days.length) {
			groups.push({ name: 'Last 7 days', recents: last7days });
		}
		if (last30days.length) {
			groups.push({ name: 'Last 30 days', recents: last30days });
		}
		if (morethan30days.length) {
			groups.push({ name: 'More than 30 days ago', recents: morethan30days });
		}
		return groups;
	}
	$: groups = groupRecents($recents, epochDay);
</script>

<div class="container">
	{#if !groups.length}
		<h2 class="h2">Your recents will go here</h2>
		{#each [1, 0.5, 0.25, 0.1] as opacity}
			<PlaylistSummarySkeleton style="opacity: {opacity}" shimmer={false} />
		{/each}
	{/if}

	{#each groups as group}
		<h2 class="h2">{group.name}</h2>
		{#each group.recents as recent}
			<PlaylistSummary playlist={recent} {date} />
		{/each}
	{/each}
</div>

<style>
	.container {
		width: 100%;
	}
	.h2 {
		color: var(--color-fg);
		font-size: 1rem;
		font-weight: 600;
		letter-spacing: 0.25px;
		text-align: center;
		display: block;
		margin-top: 8px;
		margin-bottom: 8px;
		padding-top: 2px;
		padding-bottom: 2px;
		position: sticky;
		top: 0;
		background-color: var(--color-mbg);
		z-index: 1;
	}
</style>
