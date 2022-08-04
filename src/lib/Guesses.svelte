<script lang="ts">
  import Guess from './Guess.svelte';
  import type { IGuess } from './types/IGuess';
  export let guesses: IGuess[];
</script>

<div class="guesses">
  {#each guesses as guess}
    <Guess {guess} />
  {/each}
</div>

<style>
  .guesses {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
</style>
