<script lang="ts">
  import svelteLogo from './assets/svelte.svg';
  import AudioPlayer from './lib/AudioPlayer.svelte';
  import Autocomplete from './lib/Autocomplete.svelte';
  import Counter from './lib/Counter.svelte';
  import Guesses from './lib/Guesses.svelte';
  import type { IGuess, IGuessedGuess } from './lib/types/IGuess';
  import type { IOption } from './lib/types/IOption';

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

  const correctOption: IOption = {
    id: '1',
    name: 'Moo',
    artists: [{ id: 'a', name: 'The Moo band' }],
  };

  const lengthSteps = [1, 2, 4, 7, 11, 16];
  function skipToNextStep() {
    guesses.push({ type: 'skipped' });
    guesses = guesses;
  }
  function guessToNextStep() {
    if (!selectedOption) {
      throw new Error('selectedOption must have a value to submit');
    }
    const guess = evaluateGuess(selectedOption);
    guesses.push(guess);
    guesses = guesses;
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

  let autocomplete: Autocomplete;

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

  let selectedOption: IOption | null = null;
</script>

<main>
  <Guesses guesses={paddedGuesses} />
  <Autocomplete bind:selectedOption />

  <AudioPlayer maxLength={lengthSteps[stepIndex]} {lengthSteps} />
  <button on:click={skipToNextStep}>
    Skip{stepGap ? ` (+${stepGap}s)` : ''}
  </button>
  <button disabled={!selectedOption} on:click={guessToNextStep}>
    Submit
  </button>
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
