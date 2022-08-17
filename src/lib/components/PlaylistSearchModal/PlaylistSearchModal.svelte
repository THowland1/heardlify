<script lang="ts">
  import { onMount } from 'svelte';
  import {
    searchPlaylists,
    type IPlaylistSummary,
  } from '../../functions/search-playlists';
  export let open = true;
  let textvalue: string = 'All Out';
  let playlists: IPlaylistSummary[] = [];
  async function load() {
    await searchPlaylists(textvalue).then((data) => {
      playlists = data.playlists.items;
    });
  }

  onMount(() => {
    load();
  });
</script>

{#if open}
  <div class="playlist-search-modal">
    <button class="bg" on:click={() => (open = false)} />
    <div class="container">
      <h1>Search playlists</h1>

      <input class="input" type="text" bind:value={textvalue} on:keyup={load} />
      <div class="playlists">
        {#each playlists as playlist}
          <a class="playlist" href={`/?playlist-id=${playlist.id}`}>
            <img
              class="image"
              src={playlist.images[0].url}
              alt={playlist.name}
              height="80px"
              width="80px"
            />
            <div class="text">
              <div class="name">{playlist.name}</div>
              <div class="description">{playlist.description}</div>
              <div class="owner">By {playlist.owner.display_name}</div>
            </div>
          </a>
        {/each}
      </div>
    </div>
  </div>
{/if}

<style>
  .bg {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: -1;
    opacity: 0;
  }
  .playlist-search-modal {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: var(--color-overlay);
    z-index: 3;
    backdrop-filter: blur(2px);
  }
  .input {
    width: 100%;
    padding: 12px;
    outline: none;
    border: solid 2px var(--color-mbg);
    background-color: transparent;
    border-radius: 4px;
    color: var(--color-fg);
  }
  .input:focus {
    border-color: var(--color-positive);
  }
  .container {
    width: 100%;
    max-width: var(--width-game);
    margin: auto;
    padding: 16px;

    display: flex;
    flex-direction: column;
    gap: 12px;
    height: 100%;
  }
  .playlists {
    overflow-y: auto;
  }
  .playlist {
    display: flex;
    height: 80px;
    background-color: var(--color-mbg);
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 12px;

    color: inherit;
    padding: 0;
    text-decoration: inherit;
  }
  .playlist:hover {
    background-color: var(--color-mg);
    cursor: pointer;
  }
  .image {
    height: 80px;
    width: 80px;
  }
  .text {
    flex: 1;
    padding: 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
  }
  .description {
    text-overflow: ellipsis;
    overflow: hidden;
    color: var(--color-line);
    white-space: nowrap;
  }
  .owner {
    color: var(--color-line);
  }
</style>
