<script lang="ts">
	import Modal from '$lib/components/Modal/Modal.svelte';

	export let open = true;
</script>

<Modal title="Find specific playlist" bind:open>
	<div class="body">
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
	</div>
</Modal>

<style>
	.body {
		padding: 24px;
		padding-top: 0;
	}
	p {
		margin-top: 0;
		margin-bottom: 0;
	}
	li {
		word-break: break-all;
	}
</style>
