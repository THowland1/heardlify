<script lang="ts">
	import Modal from '$lib/components/Modal/Modal.svelte';

	export let open: boolean;
</script>

<Modal title="Support the app" bind:open>
	<div class="body">
		<p>Hi! 👋</p>
		<p>Thank you for wanting to support the app!</p>
		<p>
			After pouring heart and soul into this project, it means a lot that people like yourself are
			enjoying Heardlify!
		</p>
		<p>
			If you want to support the continued success of Heardlify, I would love if you could tell your
			friends, family, and fellow fans of your favourite music or maybe tweet out <b>#Heardlify</b>.
		</p>
		<p>
			If you wish to donate, you can <a href="https://www.buymeacoffee.com/tomhowland">
				☕️&nbsp;buy me a coffee</a
			>.
		</p>
		<p>
			If you wish to make the app better, please give some feedback and let me know how I can
			improve the experience. Either with the feedback button or in <a
				href="https://www.reddit.com/r/Heardle/comments/x1bxoo/heardlify_turns_any_spotify_playlist_into_a/"
				>this Reddit post</a
			>
		</p>
		<p>Thank you!</p>
		<p class="name">Tom</p>
	</div>
</Modal>

<style lang="scss">
	.body {
		flex: 1;
		padding: 24px;
		padding-top: 0;
		p {
			margin-top: 0;
			line-height: 1.25;
		}
		.name {
			font-family: cursive;
			font-style: italic;
			font-size: 1.5em;
		}
	}
</style>
