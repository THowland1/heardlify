<script lang="ts">
  interface $$Props extends svelte.JSX.HTMLAttributes<HTMLButtonElement> {
    color?: 'primary' | 'secondary';
  }
  let color = ($$props as $$Props).color;
</script>

<button
  class:primary={color === 'primary'}
  class:secondary={color === 'secondary'}
  class="button"
  on:click
  {...$$restProps}
>
  <slot />
</button>

<style>
  .button {
    padding: 12px;
    background-color: var(--color-mg);
    border: none;
    color: var(--color-fg);
    cursor: pointer;
    letter-spacing: 0.1em;
    text-indent: 3.5px;
  }
  .button.primary {
    background-color: var(--color-positive);
  }
</style>
