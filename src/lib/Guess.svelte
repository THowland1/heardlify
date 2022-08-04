<script lang="ts">
  import Cross from './Cross.svg.svelte';
  import EmptyBox from './EmptyBox.svg.svelte';

  import type { IGuess } from './types/IGuess';

  export let guess: IGuess;

  const colors = {
    grey: '#999',
    warning: 'yellow',
    negative: 'red',
  };
</script>

<div class="box">
  {#if guess.type === 'skipped'}
    <div class="icon">
      <EmptyBox color={colors.grey} />
    </div>
    <div>SKIPPED</div>
  {:else if guess.type === 'guessed'}
    <div class="icon">
      <Cross color={guess.isCorrectArtist ? colors.warning : colors.negative} />
    </div>
    <div>{guess.artists}</div>
    <div>-</div>
    <div>{guess.name}</div>
  {/if}
</div>

<style>
  .box {
    border: solid 1px #999;
    height: 32px;
    display: flex;
    align-items: center;
  }
  .icon {
    display: flex;

    justify-content: center;
    width: 30px;
  }
</style>
