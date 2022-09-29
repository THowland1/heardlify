<script lang="ts">
	import Times from '$lib/components/icons/Times.svelte';

	export let open: boolean;
	export let title: string;
	export let hideheading = false;

	export let close = () => {
		open = false;
	};
</script>

<div class="whole-thing" class:hidden={!open}>
	<div class="overlay" on:click={close} />
	<div class="card">
		{#if !hideheading}
			<div class="heading">
				<div class="spacer" />
				<div class="heading-text">{title}</div>

				<button class="close-button" on:click={close}><Times /></button>
			</div>
		{/if}
		<div class="body">
			<slot />
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
</style>
