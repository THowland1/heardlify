<script lang="ts">
	import { useInfiniteQuery } from '@sveltestack/svelte-query';
	import { onMount } from 'svelte';
	import { searchPlaylists, type IPlaylistSummary } from '../../functions/search-playlists';
	import Search from '../icons/Search.svelte';
	import Times from '../icons/Times.svelte';
	import Button from '../shared/Button.svelte';
	import Skeleton from './Skeleton.svelte';
	export let size: 'regular' | 'large' = 'large';

	let input: HTMLInputElement | null = null;
	let textvalue: string = 'All Out';
	let playlists: IPlaylistSummary[] = [];

	$: queryResult = useInfiniteQuery(
		['search', { textvalue }] as const,
		async ({ pageParam = 0, queryKey }) => {
			return await searchPlaylists(queryKey[1].textvalue);
		},
		{
			getNextPageParam: (lastGroup) => lastGroup.playlists.items.length || undefined
		}
	);
	$: pages = $queryResult.data?.pages ?? [];
	async function load() {}
	function clear() {
		textvalue = '';
		input?.focus();
	}

	onMount(() => {
		load();
	});
</script>

<div class="input-container" class:large={size === 'large'}>
	<Search />
	<input class="input" type="text" bind:this={input} bind:value={textvalue} on:keyup={load} />
	{#if textvalue}
		<Button color="tertiary" nopadding on:click={clear}><Times /></Button>
	{/if}
</div>
<div class="playlists">
	{#if !textvalue}
		<div class="noresult-message">Start typing to find a Spotify playlist to Heardles-ify</div>
	{/if}
	{#if textvalue}
		{#if pages[0]?.playlists.items.length < 1}
			<div class="noresult-message">
				Couldn't find a playlist containing <br /> "{textvalue}"
			</div>
		{/if}

		{#each pages as page}
			{#each page.playlists.items as playlist}
				<a
					class="playlist"
					href={`/${encodeURIComponent(playlist.name).replace(/%../g, '+')}-${playlist.id}`}
				>
					<img
						class="image"
						src={playlist.images[0].url}
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
			{/each}
		{/each}
		{#if $queryResult.isLoading}
			{#each [1, 0.5, 0.25, 0.1] as opacity}
				<div class="playlist" style:opacity>
					<div class="image" height="80px" width="80px">
						<Skeleton style="height: 100%; width:100%" />
					</div>
					<div class="text">
						<Skeleton style="width: 25%" />
						<Skeleton style="width: 50%" />
						<Skeleton style="width: 25%" />
					</div>
				</div>
			{/each}
		{/if}
	{/if}
</div>

<style>
	.input-container {
		border-radius: 4px;
		border: solid 2px var(--color-mbg);
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left: 8px;
		padding-right: 8px;
		gap: 8px;
		width: 100%;
	}
	.input {
		width: 100%;
		padding: 12px;
		outline: none;
		border: none;
		background-color: transparent;
		color: var(--color-fg);
		font-size: inherit;
	}
	.input-container:focus-within {
		border-color: var(--color-positive);
	}
	.input-container.large {
		font-size: 1.5rem;
	}
	.playlists {
		width: 100%;

		overflow-y: auto;
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

	.noresult-message {
		color: var(--color-line);
		text-align: center;
		padding: 12px;
	}
</style>
