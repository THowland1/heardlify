<script lang="ts">
  import GameScreen from './lib/GameScreen.svelte';
  import type { IGuess } from './lib/types/IGuess';
  import type { IStage } from './lib/types/IStage';
  import GameOverScreen from './lib/GameOverScreen.svelte';
  import { getSong } from './lib/get-song';

  const PLAYLIST_ID_QUERYSTRING_KEY = 'playlist-id';

  const q = new URLSearchParams(window.location.search);
  const playlistId =
    q.get(PLAYLIST_ID_QUERYSTRING_KEY) ?? '0erQqpBCFFYj0gDam2pnp1';

  const dataTask = getSong(playlistId);
  let gameOver: { guesses: IGuess[] };
  const lengthSteps = [1, 2, 4, 7, 11, 16];
  let stages: IStage[] = [
    {
      duration: 1,
      message: 'A VIRTUOSO PERFORMANCE!',
      guess: { type: 'empty' },
    },
    { duration: 2, message: 'AN ACT OF GENIUS!', guess: { type: 'empty' } },
    { duration: 4, message: "YOU'RE A STAR!", guess: { type: 'empty' } },
    { duration: 7, message: 'WHAT A PRO!', guess: { type: 'empty' } },
    { duration: 11, message: "YOU'RE A WINNER!", guess: { type: 'empty' } },
    { duration: 16, message: 'GOOD RESULT!', guess: { type: 'empty' } },
  ];
  // let stages: IStage[] = [
  //   {
  //     duration: 1,
  //     message: 'A VIRTUOSO PERFORMANCE!',
  //     guess: { type: 'skipped' },
  //   },
  //   { duration: 2, message: 'AN ACT OF GENIUS!', guess: { type: 'skipped' } },
  //   { duration: 4, message: "YOU'RE A STAR!", guess: { type: 'skipped' } },
  //   {
  //     duration: 7,
  //     message: 'WHAT A PRO!',
  //     guess: { type: 'skipped' },
  //   },
  //   {
  //     duration: 11,
  //     message: "YOU'RE A WINNER!",
  //     guess: { type: 'skipped' },
  //   },
  //   {
  //     duration: 16,
  //     message: 'GOOD RESULT!',
  //     guess: { type: 'skipped' },
  //   },
  // ];
  // let stages: IStage[] = [
  //   {
  //     duration: 1,
  //     message: 'A VIRTUOSO PERFORMANCE!',
  //     guess: { type: 'skipped' },
  //   },
  //   { duration: 2, message: 'AN ACT OF GENIUS!', guess: { type: 'skipped' } },
  //   { duration: 4, message: "YOU'RE A STAR!", guess: { type: 'skipped' } },
  //   {
  //     duration: 7,
  //     message: 'WHAT A PRO!',
  //     guess: {
  //       type: 'guessed',
  //       artists: 'Soo',
  //       isCorrectArtist: false,
  //       isCorrectSong: false,
  //       name: 'soo',
  //     },
  //   },
  //   {
  //     duration: 11,
  //     message: "YOU'RE A WINNER!",
  //     guess: {
  //       type: 'guessed',
  //       artists: 'Soo',
  //       isCorrectArtist: true,
  //       isCorrectSong: false,
  //       name: 'soo',
  //     },
  //   },
  //   {
  //     duration: 16,
  //     message: 'GOOD RESULT!',
  //     guess: {
  //       type: 'guessed',
  //       artists: 'Soo',
  //       isCorrectArtist: true,
  //       isCorrectSong: true,
  //       name: 'soo',
  //     },
  //   },
  // ];
  $: gameIsOver =
    stages.some((s) => s.guess.type === 'guessed' && s.guess.isCorrectSong) ||
    stages.every((s) => s.guess.type !== 'empty');
</script>

<main>
  {#await dataTask}
    ...
  {:then data}
    {#if gameIsOver}
      <GameOverScreen correctOption={data.answer} {stages} />
    {:else}
      <GameScreen
        options={data.options}
        correctOption={data.answer}
        bind:stages
      />
    {/if}
  {/await}
</main>
