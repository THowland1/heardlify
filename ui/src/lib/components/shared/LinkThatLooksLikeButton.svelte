<script lang="ts">
	interface $$Props extends svelte.JSX.HTMLAttributes<HTMLAnchorElement> {
		color?: 'primary' | 'secondary';
		nopadding?: boolean;
	}
	let color = ($$props as $$Props).color;
	let href = ($$props as $$Props).href;
</script>

<a
	class:primary={color === 'primary'}
	class:secondary={color === 'secondary'}
	class:nopadding={$$props.nopadding}
	class="button"
	{href}
	{...$$props}
>
	<slot />
</a>

<style>
	.button {
		padding: 12px;
		background-color: var(--color-mg);
		border: none;
		color: var(--color-fg);
		cursor: pointer;
		letter-spacing: 0.1em;
		text-indent: 3.5px;
		display: flex;
		user-select: none;

		text-decoration: inherit;
		color: inherit;
	}
	.button.primary {
		background-color: var(--color-positive);
	}
	.button[disabled='true'] {
		cursor: initial;
		pointer-events: none;
		opacity: 0.5;
	}
	.button.nopadding {
		padding: 0;
	}
</style>
