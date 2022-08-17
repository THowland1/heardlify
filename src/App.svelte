<script lang="ts">
  import GameScreen from './lib/components/GameScreen/GameScreen.svelte';
  import type { IGuess } from './lib/types/IGuess';
  import type { IStage } from './lib/types/IStage';
  import GameOverScreen from './lib/components/GameOverScreen/GameOverScreen.svelte';
  import Header from './lib/components/Header/Header.svelte';
  import {
    getTodaysAnswer,
    type IResponse,
  } from './lib/functions/get-todays-answer';
  import LinkThatLooksLikeButton from './lib/components/shared/LinkThatLooksLikeButton.svelte';
  import { onMount } from 'svelte';
  import PlaylistSearchModal from './lib/components/PlaylistSearchModal/PlaylistSearchModal.svelte';
  import {
    getTodaysGuesses,
    setTodaysGuesses,
  } from './lib/functions/get-todays-guesses';

  function getDate(date = new Date()) {
    var timestamp = date.getTime() - date.getTimezoneOffset() * 60000;
    var correctDate = new Date(timestamp);
    return correctDate;
  }

  const PLAYLIST_ID_QUERYSTRING_KEY = 'playlist-id';

  const q = new URLSearchParams(window.location.search);
  const playlistId =
    q.get(PLAYLIST_ID_QUERYSTRING_KEY) ?? '0erQqpBCFFYj0gDam2pnp1';
  const date = getDate();

  let playlist: IResponse | null = null;

  async function loadData() {
    if (playlist) {
      return;
    }
    const data = await getTodaysAnswer(playlistId, date);
    playlist = data;
  }
  onMount(loadData);

  const premadePlaylists = [
    { name: '60s', playlistId: '37i9dQZF1DXaKIA8E7WcJj' },
    { name: '70s', playlistId: '37i9dQZF1DXdj82GcM2wq2' },
    { name: '80s', playlistId: '37i9dQZF1DXb57FjYWz00c' },
    { name: '90s', playlistId: '37i9dQZF1DXbTxeAdrVG2l' },
    { name: '00s', playlistId: '37i9dQZF1DX4o1oenSJRJd' },
    { name: '2010s', playlistId: '37i9dQZF1DX5Ejj0EkURtP' },
  ];

  let stages: IStage[] = getTodaysGuesses(playlistId, date);
  $: {
    setTodaysGuesses(playlistId, date, stages);
  }

  $: gameIsOver =
    stages.some((s) => s.guess.type === 'guessed' && s.guess.isCorrectSong) ||
    stages.every((s) => s.guess.type !== 'empty');

  $: bgImage = playlist ? `url(${playlist.playlist.imageUrl})` : undefined;

  let modalOpen = false;
</script>

<svelte:window on:online={loadData} />

<div class="bg" style:--image-bg={bgImage} />
<div class="bg-blur" />

<PlaylistSearchModal bind:open={modalOpen} />

<div class="whole-thing">
  <Header
    playlistName={playlist?.playlist?.name ?? null}
    on:click={() => (modalOpen = true)}
  />
  <main class="game">
    {#if gameIsOver && playlist}
      <GameOverScreen
        playlistName={playlist.playlist.name}
        correctOption={playlist.answer}
        {stages}
      />
    {:else}
      <GameScreen
        options={playlist?.options ?? null}
        correctOption={playlist?.answer ?? null}
        bind:stages
      />
    {/if}
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
  .bg {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    background-image: var(--color-bg);
    background-image: var(--image-bg);
    filter: blur(32px);
    z-index: -2;
    background-size: 100% 100%;
    transition: background-image 2s ease-in-out;
  }
  .bg-blur {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 0;
    background-color: var(--color-overlay);
    z-index: -1;
  }
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
