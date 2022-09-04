<script lang="ts">
	import Button from '../shared/Button.svelte';
	import AnimatedEllipsis from '../Header/AnimatedEllipsis.svelte';

	export let open = true;

	function close() {
		open = false;
	}
</script>

{#if open}
	<div class="feedback-modal">
		<button class="bg" on:click={close} />

		<div class="container">
			<div class="title">
				<h1>Find specific playlist</h1>
			</div>
			<p>
				If you know which Spotify playlist you wish to Heardlify, but don't see it on search, fear
				not!
			</p>
			<ol>
				<li>Find your playlist in the Spotify app</li>
				<li>Click the ellipsis (...)</li>
				<li>Click "Share"</li>
				<li>
					Click "Copy link" (e.g.
					https://open.spotify.com/playlist/1p3I3zrVPmJXbmYUcA7kJz?si=iNcr5LgOSG-JMLU6D-o84A)
				</li>

				<li>Paste the link into the Heardlify search bar</li>
				<li>Et voilà! Your playlist should appear in the search results!</li>
			</ol>

			<Button on:click={close}>Close</Button>
		</div>
	</div>
{/if}

<style>
	p {
		margin-bottom: 0;
	}
	.bg {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		z-index: -1;
		opacity: 0;
	}
	.feedback-modal {
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
		justify-content: center;
	}

	.title {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
