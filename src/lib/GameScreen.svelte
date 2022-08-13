<script lang="ts">
  import AudioPlayer from './AudioPlayer.svelte';
  import Autocomplete from './Autocomplete.svelte';
  import Button from './Button.svelte';
  import Guesses from './Guesses.svelte';
  import type { IGuess, IGuessedGuess } from './types/IGuess';
  import type { IDetailedOption, IOption } from './types/IOption';
  import type { IStage } from './types/IStage';

  function arraysIntersect<T>(a: T[], b: T[]) {
    return a.some((aa) => b.includes(aa));
  }

  export let correctOption: IDetailedOption | null;
  export let options: IOption[] | null;
  export let stages: IStage[] = [];

  function skipToNextStep() {
    if (!currentStage) {
      throw new Error('Cannot skip - There is no currentStage');
    }
    currentStage.guess = { type: 'skipped' };
    stages = stages;
    console.log(currentStage);
  }
  function guessToNextStep() {
    if (!currentStage) {
      throw new Error('Cannot skip - There is no currentStage');
    }
    if (!selectedOption) {
      throw new Error('selectedOption must have a value to submit');
    }
    currentStage.guess = evaluateGuess(selectedOption);
    stages = stages;
    selectedOption = null;
  }

  function evaluateGuess(option: IOption): IGuessedGuess {
    if (!correctOption) {
      throw new Error('correctOption must have a value to submit');
    }
    return {
      artists: option.artists.formatted,
      isCorrectArtist: arraysIntersect(
        option.artists.list.map((o) => o.id),
        correctOption.artists.list.map((o) => o.id)
      ),
      isCorrectSong: option.id === correctOption.id,
      name: option.name,
      type: 'guessed',
    };
  }

  $: currentStage = stages.find((s) => s.guess.type === 'empty');
  $: nextStage = stages[stages.findIndex((s) => s.guess.type === 'empty') + 1];
  $: stepGap = nextStage?.duration - (currentStage?.duration ?? 0);

  let selectedOption: IOption | null = null;
</script>

<div class="game-screen">
  <Guesses guesses={stages.map((s) => s.guess)} />

  <AudioPlayer
    src={correctOption?.previewUrl ?? null}
    maxLength={currentStage?.duration ?? 0}
    lengthSteps={stages.map((s) => s.duration)}
  />
  <div class="autocomplete-container">
    {#if options}
      <Autocomplete {options} bind:selectedOption />
    {/if}
  </div>

  <div class="buttons">
    <Button on:click={skipToNextStep}>
      SKIP{stepGap ? ` (+${stepGap}s)` : ''}
    </Button>
    <Button
      color="primary"
      disabled={!selectedOption}
      on:click={guessToNextStep}
    >
      SUBMIT
    </Button>
  </div>
</div>

<style>
  .game-screen {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .autocomplete-container,
  .buttons {
    max-width: var(--width-game);
    margin: auto;
    width: 100%;
    padding-left: 12px;
    padding-right: 12px;
    padding-bottom: 12px;
  }
  .buttons {
    display: flex;
    justify-content: space-between;
  }
</style>
