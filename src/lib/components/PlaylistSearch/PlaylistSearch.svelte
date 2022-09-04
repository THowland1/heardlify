<script lang="ts">
	import { page } from '$app/stores';
	import { useInfiniteQuery } from '@sveltestack/svelte-query';
	import { onMount } from 'svelte';
	import { searchPlaylists, type IPlaylistSummary } from '../../functions/search-playlists';
	import Search from '../icons/Search.svelte';
	import Times from '../icons/Times.svelte';
	import Button from '../shared/Button.svelte';
	import Skeleton from './Skeleton.svelte';
	import debounce from 'lodash.debounce';

	import { variables } from '$lib/variables';
	import { goto } from '$app/navigation';
	import HelpModal from '../HelpModal/HelpModal.svelte';

	let helpmodalOpen = false;

	const baseURL = variables.basePath || $page.url.origin;

	let input: HTMLInputElement | null = null;
	let textvalue: string = 'All Out';
	const limit = 10;
	$: queryResult = useInfiniteQuery(
		['search', { textvalue }] as const,
		async ({ pageParam = 0, queryKey }) => {
			return textvalue
				? await searchPlaylists(baseURL, queryKey[1].textvalue, pageParam, limit)
				: Promise.resolve({ playlists: { items: [], offset: 0, total: 0 } });
		},
		{
			getNextPageParam: (lastGroup) => {
				if (!lastGroup.playlists) return undefined;
				const next = lastGroup.playlists.offset + limit;
				return next < lastGroup.playlists.total ? next : undefined;
			}
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

	let container: HTMLDivElement | null = null;
	$: {
		if (container) {
			const { scrollTop, clientHeight, scrollHeight } = container;
			if (scrollTop >= scrollHeight - clientHeight) {
				if ($queryResult.hasNextPage && !$queryResult.isFetchingNextPage) {
					$queryResult.fetchNextPage();
				}
			}
		}
	}
	$: {
		if (textvalue === '/time') {
			textvalue = '';
			let message = '';
			const currentTimeMachine = $page.url.searchParams.get('time-machine');
			if (currentTimeMachine) {
				$page.url.searchParams.delete('time-machine');
				message = 'Time Machine Disabled';
			} else {
				$page.url.searchParams.set('time-machine', String(true));
				message = 'Time Machine Activated';
			}
			window.location.href = $page.url.toString();
			alert(message);
		} else if (textvalue === '/stats') {
			goto('/stats');
		}
	}
	const handleInput = debounce((newvalue: string) => {
		textvalue = newvalue;
	}, 600);

	function setSrcToFallback({ currentTarget }: { currentTarget: HTMLElement }) {
		if (currentTarget instanceof HTMLImageElement) {
			currentTarget.src = '/default-playlist-300x300.png';
		}
	}
</script>

<HelpModal bind:open={helpmodalOpen} />
<div style="width: 100%">
	<div class="input-container">
		<Search />
		<input
			class="input"
			type="text"
			bind:this={input}
			value={textvalue}
			on:input={(e) => handleInput(e.currentTarget.value)}
			on:keyup={load}
		/>
		{#if textvalue}
			<Button color="tertiary" nopadding on:click={clear}><Times /></Button>
		{/if}
	</div>
	<button class="help-link" on:click={() => (helpmodalOpen = true)}
		>Still can't find your playlist?</button
	>
</div>
<div class="playlists" bind:this={container} on:scroll={() => (container = container)}>
	{#if !textvalue}
		<div class="noresult-message">Start typing to find a Spotify playlist to Heardlify</div>
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
			{/each}
		{/each}

		{#if $queryResult.isLoading || $queryResult.isFetchingNextPage}
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
	.help-link {
		border: none;
		padding-top: 8px;
		background-color: transparent;
		text-decoration: underline;
		color: var(--color-line);
		text-align: end;
		justify-self: end;
		width: 100%;
		cursor: pointer;
	}
</style>
