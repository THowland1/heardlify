<script lang="ts">
  import type { IOption } from './types/IOption';

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
  {#if !!textvalue}
    <div class="options">
      {#each filteredOptions.options as option}
        <button
          on:click={(e) => {
            selectOption(option);
            e.currentTarget.blur();
          }}
          class="option"
        >
          {@html wrapMatchingText(option.formatted, textvalue)}
        </button>
      {/each}
      <div>
        {#if filteredOptions.options.length > 0}
          {filteredOptions.options.length} of {filteredOptions.totalCount} for "{textvalue}"
        {:else}
          No results for "{textvalue}". Maybe it's something else...
        {/if}
      </div>
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

  :global(em) {
    font-style: normal;
    background-color: yellow;
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
