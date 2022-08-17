<script lang="ts">
  import Search from '../icons/Search.svelte';
  import Times from '../icons/Times.svelte';
  import type { IOption } from '../../types/IOption';

  export let options: IOption[];
  let textvalue = '';
  export let selectedOption: IOption | null;

  function selectOption(option: IOption): void {
    console.log(textvalue);
    selectedOption = option;
    textvalue = option.formatted;
  }
  function clear() {
    textvalue = '';
    selectedOption = null;
  }
  function getFilteredOptions(unfilteredOptions: IOption[], filter: string) {
    const filtered = unfilteredOptions.filter((o) =>
      o.formatted.toLowerCase().includes(filter.toLowerCase())
    );
    return {
      options: filtered.slice(0, 6),
      totalCount: filtered.length,
    };
  }
  $: filteredOptions = getFilteredOptions(options, textvalue);
  function wrapMatchingText(str: string, searchStr: string) {
    const index = str.toLowerCase().indexOf(searchStr.toLowerCase());
    if (index < 0) {
      return str;
    }
    const before = str.slice(0, index);
    const match = str.slice(index, index + searchStr.length);
    const after = str.slice(index + searchStr.length);
    return `${before}<em>${match}</em>${after}`;
  }
</script>

<div class="container">
  <div class="box">
    {#if !!textvalue}
      <div class="options">
        {#each filteredOptions.options as option}
          <button
            on:pointerdown={(e) => {
              selectOption(option);
              e.currentTarget.blur();
            }}
            class="option"
          >
            {@html wrapMatchingText(option.formatted, textvalue)}
          </button>
        {/each}
        <div class="count">
          {#if filteredOptions.options.length > 0}
            {filteredOptions.options.length} of {filteredOptions.totalCount} for
            "{textvalue}"
          {:else}
            No results for "{textvalue}". Maybe it's something else...
          {/if}
        </div>
      </div>
    {/if}
    <div class="input-container">
      <span class="hourglass-icon"><Search /></span>
      <input
        bind:value={textvalue}
        on:focus={clear}
        class="input"
        type="text"
        placeholder="Know it? Search for the artist / title"
      />
      {#if !!textvalue}
        <button on:click={clear} class="close-button"><Times /></button>
      {/if}
    </div>
  </div>
</div>

<style>
  :root {
    --input-height: 45px;
  }
  .container {
    --options-display: none;
    border: solid 1px var(--color-mg);
    position: relative;
    color: var(--color-fg);
  }

  .container:focus-within {
    border-color: var(--color-positive);
  }

  :global(em) {
    font-style: normal;
    background-color: var(--color-mg);
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
    z-index: 2;
    background-color: var(--color-bg);
    overflow: hidden;

    border: solid 1px var(--color-positive);
    border-bottom: none;
  }
  .option {
    cursor: pointer;
    all: unset;
    display: block;

    padding: 0.5rem 0.75rem;
    border-bottom: 1px solid var(--color-mg);
    letter-spacing: 1px;
    line-height: 1.3;
    width: 100%;
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
    background: transparent;
    border: none;
    color: var(--color-fg);
  }

  .input:focus {
    outline: none;
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
    color: var(--color-fg);
    background-color: transparent;
    border: none;
  }
  .count {
    color: var(--color-line);
    padding: 0.5rem 0.75rem;
    border-bottom: 1px solid var(--color-mg);
    font-size: 12px;
  }
</style>
