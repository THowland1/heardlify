<script lang="ts">
  import ChevronDown from './ChevronDown.svelte';
  import SpotifyLogo from './SpotifyLogo.svelte';

  export let playlistName: string | null = null;
</script>

<div class="nav-container">
  <nav class="nav">
    <h1>HEARDLES</h1>
    <div class="chip-container">
      {#if !!playlistName}
        <button class="current-playlist" on:click>
          <SpotifyLogo />
          <span class="playlist-name">
            {playlistName ?? ''}
          </span>
          <ChevronDown />
        </button>
      {/if}
    </div>
  </nav>
</div>

<style>
  .nav-container {
    height: 57px;
    border-bottom: solid 1px var(--color-line);
  }
  .nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: var(--width-game);
    margin: auto;
    height: 100%;
    padding-left: 12px;
    padding-right: 12px;
  }
  .chip-container {
    overflow: hidden;
    padding-left: 8px;
    display: flex;
  }
  .current-playlist {
    background-color: var(--color-mg);
    padding: 8px;
    border-radius: 6px;

    display: flex;
    gap: 6px;

    border: none;
    color: inherit;

    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .playlist-name {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    flex: 1;
  }
</style>
