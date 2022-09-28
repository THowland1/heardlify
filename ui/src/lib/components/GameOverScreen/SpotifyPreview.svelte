<script lang="ts">
  import SpotifyWordmark from './SpotifyWordmark.svelte';
  import type { IDetailedOption } from '../../types/IOption';

  export let song: IDetailedOption;

  $: bgImage = `url(${song.imgSrc ?? '/default-playlist-300x300.png'})`;
</script>

<a
  href={`https://open.spotify.com/track/${song.id}`}
  class="spotify-preview"
  target="_blank"
  style:--image-spotify-preview={bgImage}
>
  <div class="image" />
  <div class="info">
    <div class="info__name">{song.name}</div>
    <div class="info__artists">{song.artists.formatted}</div>
    <div class="info__bottom">
      <div class="info__year">
        {song.year}
      </div>
      <div class="wordmark">
        <SpotifyWordmark />
      </div>
    </div>
  </div>
</a>

<style>
  .spotify-preview {
    --size-preview-height: 80px;

    display: flex;
    background-color: var(--color-positive);
    color: var(--color-fg);
    text-decoration: none;
    height: var(--size-preview-height);
    border-radius: 6px;
    overflow: hidden;
  }
  .image {
    background-image: var(--image-spotify-preview);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    height: var(--size-preview-height);
    width: var(--size-preview-height);
  }

  .info {
    flex: 1;
    padding: 8px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
  }
  .info__name {
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 0.2px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .info__artists {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .info__artists,
  .info__year {
    color: var(--color-line);
  }
  .info__bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
