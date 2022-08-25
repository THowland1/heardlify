<script lang="ts">
	interface $$Props extends svelte.JSX.HTMLAttributes<HTMLButtonElement> {}
</script>

<span class="skeleton-box" style="width: 100%;" {...$$restProps} />

<style lang="scss">
	.skeleton-box {
		display: inline-block;
		height: 0.8em;
		border-radius: 1em;
		position: relative;
		overflow: hidden;
		background-color: var(--color-mg);

		&::after {
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			transform: translateX(-100%);
			background-image: linear-gradient(
				90deg,
				rgba(#777, 0) 0,
				rgba(#777, 0.2) 20%,
				rgba(#777, 0.5) 60%,
				rgba(#777, 0)
			);
			animation: shimmer 2s infinite;
			content: '';
		}

		@keyframes shimmer {
			100% {
				transform: translateX(100%);
			}
		}
	}
</style>
