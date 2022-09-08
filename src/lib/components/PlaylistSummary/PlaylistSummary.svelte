<script lang="ts">
	import {
		addFavourite,
		favourites,
		removeFavourite,
		type IFavourite
	} from '$lib/stores/favourites';
	import StarOutline from './StarOutline.svelte';
	import StarSolid from './StarSolid.svelte';
	import { fade } from 'svelte/transition';
	type IPlaylistSummary = {
		id: string;
		images: { url: string }[];
		name: string;
		description: string;
		owner: {
			display_name: string;
		};
	};

	export let playlist: IPlaylistSummary;

	function setSrcToFallback({ currentTarget }: { currentTarget: HTMLElement }) {
		if (currentTarget instanceof HTMLImageElement) {
			currentTarget.src = '/default-playlist-300x300.png';
		}
	}

	$: isFavourite = $favourites.findIndex((f) => f.id === playlist.id) > -1;
</script>

<div class="wrapper">
	<a
		class="playlist"
		href={`/${encodeURIComponent(playlist.name).replace(/%../g, '+')}-${playlist.id}`}
	>
		<img
			class="image"
			on:error|once={setSrcToFallback}
			src={playlist.images[0]?.url}
			alt={playlist.name}
			height="80px"
			width="80px"
		/>
		<div class="text">
			<div class="name">{playlist.name}</div>
			<div class="description">{playlist.description}</div>
			<div class="owner">By {playlist.owner.display_name}</div>
		</div>
	</a>
	<button
		class="star"
		on:click={() => {
			isFavourite ? removeFavourite(playlist) : addFavourite(playlist);
		}}
	>
		{#if isFavourite}
			<span class="icon" transition:fade={{ duration: 150 }}>
				<StarSolid />
			</span>
		{:else}
			<span class="icon" transition:fade={{ duration: 150 }}>
				<StarOutline />
			</span>
		{/if}
	</button>
</div>

<style lang="scss">
	.wrapper {
		position: relative;
	}
	.playlist {
		display: flex;
		height: 80px;
		background-color: var(--color-mbg);
		border-radius: 8px;
		overflow: hidden;
		margin-bottom: 12px;

		color: inherit;
		padding: 0;
		text-decoration: inherit;
	}
	.playlist:hover {
		background-color: var(--color-mg);
		cursor: pointer;
	}
	.image {
		height: 80px;
		width: 80px;
	}
	.text {
		flex: 1;
		padding: 12px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		overflow: hidden;
	}
	.description {
		text-overflow: ellipsis;
		overflow: hidden;
		color: var(--color-line);
		white-space: nowrap;
	}
	.owner {
		color: var(--color-line);
	}
	.star {
		position: absolute;
		bottom: 0;
		right: 0;
		background-color: transparent;
		border: none;
		color: var(--color-line);
		height: 28px;
		width: 28px;

		.icon {
			position: absolute;
			top: 0;
			bottom: 6px;
			left: 0;
			right: 6px;
		}
	}
</style>
