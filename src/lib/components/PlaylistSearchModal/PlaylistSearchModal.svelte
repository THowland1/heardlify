<script lang="ts">
	import { onMount } from 'svelte';
	import { searchPlaylists, type IPlaylistSummary } from '../../functions/search-playlists';
	import Search from '../icons/Search.svelte';
	import Times from '../icons/Times.svelte';
	import Button from '../shared/Button.svelte';
	export let open = true;
	let input: HTMLInputElement | null = null;
	let textvalue: string = 'All Out';
	let playlists: IPlaylistSummary[] = [];
	async function load() {
		await searchPlaylists(textvalue).then((data) => {
			playlists = data.playlists.items;
		});
	}
	function close() {
		open = false;
	}
	function clear() {
		textvalue = '';
		input?.focus();
	}

	onMount(() => {
		load();
	});
</script>

{#if open}
	<div class="playlist-search-modal">
		<button class="bg" on:click={close} />
		<div class="container">
			<div class="title">
				<h1>Search playlists</h1>
				<Button color="tertiary" on:click={close}><Times /></Button>
			</div>

			<div class="input-container">
				<Search />
				<input class="input" type="text" bind:this={input} bind:value={textvalue} on:keyup={load} />
				{#if textvalue}
					<Button color="tertiary" nopadding on:click={clear}><Times /></Button>
				{/if}
			</div>
			<div class="playlists">
				{#if !textvalue}
					<div class="noresult-message">
						Start typing to find a Spotify playlist to Heardles-ify
					</div>
				{/if}
				{#if textvalue}
					{#if playlists.length < 1}
						<div class="noresult-message">
							Couldn't find a playlist containing <br /> "{textvalue}"
						</div>
					{/if}
					{#each playlists as playlist}
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
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.bg {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		z-index: -1;
		opacity: 0;
	}
	.playlist-search-modal {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		background-color: var(--color-overlay);
		z-index: 3;
		backdrop-filter: blur(2px);
	}

	.input-container {
		border-radius: 4px;
		border: solid 2px var(--color-mbg);
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left: 8px;
		padding-right: 8px;
		gap: 8px;
	}
	.input {
		width: 100%;
		padding: 12px;
		outline: none;
		border: none;
		background-color: transparent;
		color: var(--color-fg);
	}
	.input-container:focus-within {
		border-color: var(--color-positive);
	}
	.container {
		width: 100%;
		max-width: var(--width-game);
		margin: auto;
		padding: 16px;

		display: flex;
		flex-direction: column;
		gap: 12px;
		height: 100%;
	}
	.playlists {
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

	.title {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.noresult-message {
		color: var(--color-line);
		text-align: center;
		padding: 12px;
	}
</style>
