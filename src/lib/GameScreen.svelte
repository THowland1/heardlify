<script lang="ts">
  import AudioPlayer from './AudioPlayer.svelte';
  import Autocomplete from './Autocomplete.svelte';
  import Guesses from './Guesses.svelte';
  import type { IGuess, IGuessedGuess } from './types/IGuess';
  import type { IOption } from './types/IOption';
  import type { IStage } from './types/IStage';

  function areArraysTheSame<T extends string>(a: T[], b: T[]): boolean {
    if (a.length !== b.length) {
      return false;
    }
    for (let index = 0; index < a.length; index++) {
      if (a[index] !== b[index]) {
        return false;
      }
    }
    return true;
  }

  export let correctOption: IOption;
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
      artists: option.artists.map((o) => o.name).join(', '),
      isCorrectArtist: areArraysTheSame(
        option.artists.map((a) => a.id),
        correctOption.artists.map((a) => a.id)
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

<Guesses guesses={stages.map((s) => s.guess)} />
<Autocomplete bind:selectedOption />

<AudioPlayer
  maxLength={currentStage?.duration}
  lengthSteps={stages.map((s) => s.duration)}
/>
<button on:click={skipToNextStep}>
  Skip{stepGap ? ` (+${stepGap}s)` : ''}
</button>
<button disabled={!selectedOption} on:click={guessToNextStep}> Submit </button>
