<script lang="ts">
  import svelteLogo from './assets/svelte.svg';
  import AudioPlayer from './lib/AudioPlayer.svelte';
  import Autocomplete from './lib/Autocomplete.svelte';
  import Counter from './lib/Counter.svelte';
  import Guesses from './lib/Guesses.svelte';
  import type { IGuess, IGuessedGuess } from './lib/types/IGuess';

  const lengthSteps = [1, 2, 4, 7, 11, 16];
  function skipToNextStep() {
    guesses.push({ type: 'skipped' });
    guesses = guesses;
  }
  function guessToNextStep() {
    if (!currentGuess) {
      throw new Error('currentGuess must have a value to submit');
    }
    guesses.push(currentGuess);
    guesses = guesses;
    currentGuess = null;
  }

  let currentGuess: IGuessedGuess | null = {
    artists: 'Me',
    isCorrectArtist: false,
    name: 'City of Stars',
    type: 'guessed',
  };

  $: stepIndex = guesses.length;
  $: stepGap = lengthSteps[stepIndex + 1] - lengthSteps[stepIndex];

  let guesses: IGuess[] = [];
  $: paddedGuesses = padArrayEnd(guesses, lengthSteps.length, {
    type: 'empty',
  });

  function padArrayEnd<T>(arr: T[], maxLength: number, fillItem: T) {
    const newArr = [...arr];
    while (newArr.length < maxLength) {
      newArr.push(fillItem);
    }
    return newArr;
  }
</script>

<main>
  <Guesses guesses={paddedGuesses} />
  <Autocomplete />

  <AudioPlayer maxLength={lengthSteps[stepIndex]} {lengthSteps} />
  <button on:click={skipToNextStep}>
    Skip{stepGap ? ` (+${stepGap}s)` : ''}
  </button>
  <button disabled={!currentGuess} on:click={guessToNextStep}> Submit </button>
  <div id="playlist" />
  <ul>
    <li><input type="checkbox" />Search all songs</li>
    <li><input type="checkbox" />Limit playback</li>
    <li><input type="checkbox" />Guess logic</li>
    <li>
      <input type="checkbox" /> Endpoint
      <ul>
        <li><input type="checkbox" />Update auth</li>
        <li><input type="checkbox" />Read playlist id</li>
        <li><input type="checkbox" />Pick one at random</li>
      </ul>
    </li>
  </ul>
</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
  }
</style>
