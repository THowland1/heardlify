<script lang="ts">
	import Times from '../icons/Times.svelte';
	import PlaylistSearch from '../PlaylistSearch/PlaylistSearch.svelte';
	import Button from '../shared/Button.svelte';
	export let open = true;
	export let date: Date;

	function close() {
		open = false;
	}
</script>

{#if open}
	<div class="playlist-search-modal">
		<button class="bg" on:click={close} />
		<div class="container">
			<div class="title">
				<h1>Search playlists</h1>
				<Button color="tertiary" on:click={close}><Times /></Button>
			</div>

			<PlaylistSearch {date} />
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

	.title {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
