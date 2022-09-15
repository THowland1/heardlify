<script lang="ts">
	import Times from '$lib/components/icons/Times.svelte';

	export let open: boolean;
</script>

<div class="whole-thing" class:hidden={!open}>
	<div class="overlay" on:click={() => (open = false)} />
	<div class="card">
		<div class="heading">
			<div class="spacer" />
			<div class="heading-text">Support the app</div>

			<button class="close-button" on:click={() => (open = false)}><Times /></button>
		</div>
		<div class="body">
			<p>Hi! 👋</p>
			<p>Thank you for wanting to support the app!</p>
			<p>
				After pouring heart and soul into this project, it means a lot that people like yourself are
				enjoying Heardlify!
			</p>
			<p>
				If you want to support the continued success of Heardlify, I would love if you could tell
				your friends, family, and fellow fans of your favourite music or maybe tweet out <b
					>#Heardlify</b
				>.
			</p>
			<p>
				If you wish to donate, you can <a href="https://www.buymeacoffee.com/tomhowland">
					☕️&nbsp;buy me a coffee</a
				>.
			</p>
			<p>
				If you wish to make the app better, please give some feedback and let me know how I can
				improve the experience.
			</p>
			<p>Thank you!</p>
			<p class="name">Tom</p>
		</div>
	</div>
</div>

<style lang="scss">
	@mixin absolute-inset-0 {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
	}
	@mixin flex-place-center {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	:root {
		--height-chart: 200px;
		--height-count: 1.5em;
		--height-label: 1.2em;
		--height-bar-max: calc(var(--height-chart) - var(--height-count) - var(--height-label));
		--height-bar-relative: 0;
	}

	.whole-thing {
		@include absolute-inset-0;
		z-index: 2;
		opacity: 1;
		transition: opacity 0.6s;

		&.hidden {
			opacity: 0;
			pointer-events: none;
		}
	}
	.overlay {
		@include absolute-inset-0;
		background-color: var(--color-overlay);
	}
	.card {
		@include absolute-inset-0;
		margin: auto;
		width: 100%;
		height: fit-content;
		max-width: 400px;
		background-color: var(--color-bg);

		display: flex;
		flex-direction: column;
		border-radius: 16px;
	}
	.heading {
		padding: 24px;
		display: flex;
		justify-content: space-between;
		color: var(--color-line);
		text-transform: uppercase;
		font-weight: 700;
		letter-spacing: 1px;
		.close-button {
			cursor: pointer;
		}
	}
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
