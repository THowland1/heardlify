<script lang="ts">
	import {
		addFavourite,
		favourites,
		removeFavourite,
		type IFavourite
	} from '$lib/stores/favourites';
	import PlaylistSummary from '../PlaylistSummary/PlaylistSummary.svelte';
	import PlaylistSummarySkeleton from '../PlaylistSummary/PlaylistSummarySkeleton.svelte';

	export let date: Date;
</script>

<div class="container">
	{#if $favourites.length}
		<h2 class="h2">Your favourites</h2>
	{:else}
		<h2 class="h2">Your favourites will go here</h2>
		{#each [1, 0.5, 0.25, 0.1] as opacity}
			<PlaylistSummarySkeleton style="opacity: {opacity}" shimmer={false} />
		{/each}
	{/if}

	{#each $favourites as favourite}
		<PlaylistSummary playlist={favourite} {date} />
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
