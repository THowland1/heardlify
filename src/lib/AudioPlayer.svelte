<script lang="ts">
  import { getSong } from './get-song';
  let src = '';
  let duration: number;
  let currentTime = 0;
  let audio: HTMLAudioElement;
  let paused = true;

  const song = getSong().then((song) => {
    src = song.items[0].track.preview_url;
    audio = audio;
  });
  $: progressPercentage = currentTime / duration;
</script>

<audio {src} bind:this={audio} bind:duration bind:currentTime bind:paused />

{#if !paused}
  <button
    on:click={() => {
      audio.pause();
      audio.currentTime = 0;
      audio = audio;
    }}>pause</button
  >
{:else}
  <button
    on:click={() => {
      audio.play();
      audio = audio;
    }}>play</button
  >
{/if}
<!-- {paused}
{currentTime}
{duration}
{progressPercentage} -->
<div class="progress">
  <div class="progress-inner" style="width: {100 * progressPercentage}%;" />
</div>

<style>
  .progress {
    width: 300px;
    height: 10px;
    border: solid 1px #999;
  }
  .progress-inner {
    height: 10px;
    background-color: #999;
  }
</style>
