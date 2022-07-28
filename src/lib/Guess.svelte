<script lang="ts">
  import type { IGuess } from './types/IGuess';

  export let guess: IGuess;
</script>

<div class="box">
  {#if guess.type === 'skipped'}
    [] - skipped
  {:else if guess.type === 'guessed'}
    <div>{JSON.stringify(guess)}</div>
  {/if}
</div>

<style>
  .box {
    border: solid 1px #999;
    height: 32px;
  }
</style>
