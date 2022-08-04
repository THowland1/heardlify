<script lang="ts">
  import AudioPlayer from './AudioPlayer.svelte';
  import Autocomplete from './Autocomplete.svelte';
  import Guesses from './Guesses.svelte';
  import type { IGuess, IGuessedGuess } from './types/IGuess';
  import type { IDetailedOption, IOption } from './types/IOption';
  import type { IStage } from './types/IStage';

  function arraysIntersect<T>(a: T[], b: T[]) {
    return a.some((aa) => b.includes(aa));
  }

  export let correctOption: IDetailedOption;
  export let options: IOption[];
  export let stages: IStage[] = [];

  function skipToNextStep() {
    currentStage.guess = { type: 'skipped' };
    stages = stages;
    console.log(currentStage);
  }
  function guessToNextStep() {
    if (!selectedOption) {
      throw new Error('selectedOption must have a value to submit');
    }
    currentStage.guess = evaluateGuess(selectedOption);
    stages = stages;
    selectedOption = null;
  }

  function evaluateGuess(option: IOption): IGuessedGuess {
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
  $: stepGap = nextStage?.duration - currentStage?.duration;

  let selectedOption: IOption | null = null;
</script>

<div class="game-screen">
  <Guesses guesses={stages.map((s) => s.guess)} />
  <Autocomplete {options} bind:selectedOption />

  <AudioPlayer
    src={correctOption.previewUrl}
    maxLength={currentStage?.duration}
    lengthSteps={stages.map((s) => s.duration)}
  />
  <button on:click={skipToNextStep}>
    Skip{stepGap ? ` (+${stepGap}s)` : ''}
  </button>
  <button disabled={!selectedOption} on:click={guessToNextStep}>
    Submit
  </button>
</div>

<style>
  .game-screen {
    display: flex;
    flex-direction: column;
  }
</style>
