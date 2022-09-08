<script lang="ts">
	import {
		addFavourite,
		favourites,
		removeFavourite,
		type IFavourite
	} from '$lib/stores/favourites';
	import PlaylistSummary from '../PlaylistSummary/PlaylistSummary.svelte';
	import PlaylistSummarySkeleton from '../PlaylistSummary/PlaylistSummarySkeleton.svelte';
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
		<PlaylistSummary playlist={favourite} />
	{/each}
</div>

<style>
	.container {
		width: 100%;
	}
	.h2 {
		padding-bottom: 16px;
		text-align: center;
	}
</style>
