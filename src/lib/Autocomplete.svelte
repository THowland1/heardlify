<script lang="ts">
  import type { IOption } from './types/IOption';

  let options: IOption[] = [
    {
      id: '1',
      name: 'Moo',
      artists: [{ id: 'a', name: 'The Moo band' }],
    },
    {
      id: '2',
      name: 'Boo',
      artists: [{ id: 'b', name: 'The Boop band' }],
    },
  ];
  let textvalue = '';
  export let selectedOption: IOption | null;

  function formatOption(option: IOption): string {
    return `${option.artists.map((a) => a.name).join(', ')} - ${option.name}`;
  }
  function selectOption(option: IOption): void {
    console.log(textvalue);
    selectedOption = option;
    textvalue = formatOption(option);
  }
</script>

<div class="container">
  <div class="options">
    {#each options as option}
      <button on:click={() => selectOption(option)} class="option">
        {formatOption(option)}
      </button>
    {/each}
  </div>
  <input
    bind:value={textvalue}
    class="input"
    type="text"
    placeholder="Know it? Search for the artist / title"
  />
</div>

<style>
  .container {
    --options-display: none;
    border: solid 1px #999;
    position: relative;
  }
  .container:focus-within {
    --options-display: block;
  }
  .options {
    display: var(--options-display);
    position: absolute;
    left: 0;
    right: 0;
    bottom: 100%;
    z-index: 1;
    background-color: #999;
  }
  .option {
    cursor: pointer;
  }
  button {
    all: unset;
    display: block;
  }
  input {
    padding: 15px;
    width: 100%;
  }
</style>
