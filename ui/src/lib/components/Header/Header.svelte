<script lang="ts">
	import AnimatedEllipsis from './AnimatedEllipsis.svelte';
	import ChevronDown from './ChevronDown.svelte';
	import SpotifyLogo from './SpotifyLogo.svelte';

	export let playlistName: string | null;
	export let showChip = true;

	let online = true;
</script>

<svelte:window bind:online />

<div class="nav-container">
	<nav class="nav">
		<h1><a href="/">HEARDLIFY</a></h1>
		{#if !online}
			<div class="offline-chip">offline</div>
		{/if}
		<div class="chip-container">
			{#if showChip}
				<button class="current-playlist" on:click>
					<SpotifyLogo />

					<span class="playlist-name">
						{#if playlistName}
							{playlistName}
						{:else if online}
							<AnimatedEllipsis />
						{:else}
							<span class="offline-text">offline</span>
						{/if}
					</span>
					<ChevronDown />
				</button>
			{/if}
		</div>
	</nav>
</div>

<style>
	a {
		color: inherit;
		text-decoration: inherit;
	}
	.nav-container {
		height: 57px;
		border-bottom: solid 1px var(--color-line);
	}
	.nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		max-width: var(--width-game);
		margin: auto;
		height: 100%;
		padding-left: 12px;
		padding-right: 12px;
	}
	.chip-container {
		overflow: hidden;
		padding-left: 8px;
		display: flex;
	}
	.current-playlist {
		background-color: var(--color-mg);
		padding: 8px;
		border-radius: 6px;

		display: flex;
		gap: 6px;

		border: none;
		color: inherit;

		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
	.playlist-name {
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		flex: 1;
	}

	.offline-chip {
		background-color: var(--color-mg);
		border-radius: 100vh;
		padding: 4px 8px;
		text-transform: uppercase;
		letter-spacing: 1px;
		font-size: 0.8em;
	}

	.offline-text {
		font-style: italic;
	}
</style>
