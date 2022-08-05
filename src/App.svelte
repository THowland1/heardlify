<script lang="ts">
  import GameScreen from './lib/GameScreen.svelte';
  import type { IGuess } from './lib/types/IGuess';
  import type { IStage } from './lib/types/IStage';
  import GameOverScreen from './lib/GameOverScreen.svelte';
  import Header from './lib/Header.svelte';
  import { getSong } from './lib/get-song';
  import LinkThatLooksLikeButton from './lib/LinkThatLooksLikeButton.svelte';

  const PLAYLIST_ID_QUERYSTRING_KEY = 'playlist-id';

  const q = new URLSearchParams(window.location.search);
  const playlistId =
    q.get(PLAYLIST_ID_QUERYSTRING_KEY) ?? '0erQqpBCFFYj0gDam2pnp1';

  const dataTask = getSong(playlistId);

  const premadePlaylists = [
    { name: '60s', playlistId: '37i9dQZF1DXaKIA8E7WcJj' },
    { name: '70s', playlistId: '37i9dQZF1DXdj82GcM2wq2' },
    { name: '80s', playlistId: '37i9dQZF1DXb57FjYWz00c' },
    { name: '90s', playlistId: '37i9dQZF1DXbTxeAdrVG2l' },
    { name: '00s', playlistId: '37i9dQZF1DX4o1oenSJRJd' },
    { name: '2010s', playlistId: '37i9dQZF1DX5Ejj0EkURtP' },
  ];

  function goToOtherPlaylist(playlistId: string) {
    window.location.search = new URLSearchParams({
      [PLAYLIST_ID_QUERYSTRING_KEY]: playlistId,
    }).toString();
  }

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

  $: gameIsOver =
    stages.some((s) => s.guess.type === 'guessed' && s.guess.isCorrectSong) ||
    stages.every((s) => s.guess.type !== 'empty');
</script>

<div class="whole-thing">
  <Header />
  <main class="game">
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
  <footer class="footer">
    <h6>Try out another</h6>
    <div class="others">
      {#each premadePlaylists as playlist}
        <LinkThatLooksLikeButton
          href={`/?playlist-id=${playlist.playlistId}`}
          disabled={playlist.playlistId === playlistId}
        >
          {playlist.name}
        </LinkThatLooksLikeButton>
      {/each}
    </div>
  </footer>
</div>

<style>
  .whole-thing {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .game {
    flex: 1;
    width: 100%;
    margin: auto;

    display: flex;
    flex-direction: column;
  }

  .footer {
    width: 100%;
    max-width: var(--width-game);
    margin: auto;
    text-align: center;
  }
  .others {
    display: flex;
    justify-content: center;
    gap: 8px;
  }
</style>
