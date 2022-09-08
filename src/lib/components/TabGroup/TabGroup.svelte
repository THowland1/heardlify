<script lang="ts">
	const options = ['search', 'favourites'] as const;
	const name = Math.random().toString().replace('.', '');
	export let value = options[0] as typeof options[number];
</script>

<div class="wrapper">
	{#each options as option}
		<input
			checked={value === option}
			on:change={() => (value = option)}
			class="radio"
			type="radio"
			id={name + option}
			{name}
			value={option}
		/>
		<label class="label" for={name + option}>
			{option}
		</label>
	{/each}
</div>

<style lang="scss">
	.wrapper {
		display: flex;
		background-color: var(--color-mbg);
		color: var(--color-line);
		border-radius: 32px;
		padding: 4px;
		gap: 4px;
	}
	.radio {
		appearance: none;
		opacity: 0;
		margin: 0;
		border: none;
		position: absolute;
	}
	.label {
		line-height: 1.2;
		border-radius: 32px;
		padding: 4px 8px;
		cursor: pointer;

		&:hover {
			color: var(--color-fg);
		}
	}
	.radio:checked + .label {
		background-color: var(--color-mg);
		color: var(--color-fg);
	}
</style>
