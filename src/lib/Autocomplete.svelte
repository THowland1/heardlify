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
  function clear() {
    textvalue = '';
    selectedOption = null;
  }
</script>

<div class="container">
  {#if !!textvalue}
    <div class="options">
      {#each options as option}
        <button
          on:click={(e) => {
            selectOption(option);
            e.currentTarget.blur();
          }}
          class="option"
        >
          {formatOption(option)}
        </button>
      {/each}
    </div>
  {/if}
  <div class="input-container">
    <span class="hourglass-icon">🔎</span>
    <input
      bind:value={textvalue}
      on:focus={clear}
      class="input"
      type="text"
      placeholder="Know it? Search for the artist / title"
    />
    {#if !!textvalue}
      <button on:click={clear} class="close-button">&times;</button>
    {/if}
  </div>
</div>

<style>
  :root {
    --input-height: 45px;
  }
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
    all: unset;
    display: block;
  }
  .input {
    padding-left: var(--input-height);
    padding-right: var(--input-height);
    flex: 1;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .input-container {
    position: relative;
    height: var(--input-height);
  }
  .hourglass-icon {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    width: var(--input-height);
  }
  .close-button {
    position: absolute;
    z-index: 1;
    top: 0;
    bottom: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: var(--input-height);
    color: #999;
    background-color: transparent;
  }
</style>
