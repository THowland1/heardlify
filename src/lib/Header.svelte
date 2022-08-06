<script lang="ts">
  import SpotifyLogo from './SpotifyLogo.svg.svelte';

  export let playlistName: string | null = null;
</script>

<div class="nav-container">
  <nav class="nav">
    <h1>HEARDLE</h1>
    <div>
      {#if !!playlistName}
        <div class="current-playlist">
          <SpotifyLogo />
          {playlistName ?? ''}
        </div>
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

  .current-playlist {
    background-color: var(--color-mg);
    padding: 8px;
    border-radius: 6px;

    display: flex;
    gap: 6px;
  }
</style>
