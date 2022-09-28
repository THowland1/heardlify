<script lang="ts">
  import Cross from '../icons/Cross.svelte';
  import EmptyBox from './EmptyBox.svelte';
  import type { IGuess } from '../../types/IGuess';

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
      <EmptyBox />
    </div>
    <div class="skipped">SKIPPED</div>
  {:else if guess.type === 'guessed'}
    <div class="icon">
      <Cross color={guess.isCorrectArtist ? colors.warning : colors.negative} />
    </div>
    <div class="artist" class:correct-artist={guess.isCorrectArtist}>
      {guess.artists}
    </div>
    &nbsp;-&nbsp;
    <div>{guess.name}</div>
  {/if}
</div>

<style>
  .box {
    border: solid 1px var(--color-mg);
    color: var(--color-line);
    height: 38px;
    display: flex;
    align-items: center;
    padding: 8px;
  }
  .icon {
    display: flex;

    justify-content: center;
    width: 30px;
    margin-left: 2px;
    margin-right: 8px;
    color: var(--color-mg);
  }
  .correct-artist {
    color: var(--color-fg);
  }
  .skipped {
    color: var(--color-line);
    letter-spacing: 2.7px;
    font-weight: 700;
  }
</style>
