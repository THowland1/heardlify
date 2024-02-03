<script lang="ts">
	import Modal from '$lib/components/Modal/Modal.svelte';

	export let open: boolean;
</script>

<Modal title="Sunsetting Heardlify" bind:open>
	<div class="body">
		<p>Hi! 👋</p>
		<p>
			After pouring heart and soul into this project, it means a lot that people like yourself have enjoyed Heardlify!
		</p>
		<p>
			I made this app over a year ago now and have never stopped checking in to see all the ways people have enjoyed the app. And have loved to read all the feedback.
		</p>
		<p>
			Which is why it is with a heavy heart that I am saying goodbye.
		</p>
		<p>
			Supporting the app has been quite fairweather so far, but I am now starting to see the cracks show: the database is slowing down, the server I am hosting on is slowing down, and sometimes Spotify's servers just don't seem to play ball.
		</p>
		<p>
			I am not shutting down the app - as long as the underlying tech is alive, Heardlify will live on.
		</p>
		<p>
			But with a full time job and a baby on the way, I won't have the time to fix any new bugs, big or small.
		</p>
		<p>
			This may not be goodbye forever - but I just have to let it be known that I cannot make any promises.
		</p>
		<p>
			If you wish to see Heardlify survive forever, feel free to copy and improve the source code from <a
				href="https://github.com/THowland1/heardlify">the GitHub repo</a
			> and host it yourself (or recreate it from scratch). If anyone does wish to takeup the mantle, I would be happy to redirect traffic to their version
		</p>
		<p>
			Thanks again to everyone who bought me a coffee and reached out to let me know you were enjoying the app! See you down the road!
		</p>
		<p>All the best,</p>
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
