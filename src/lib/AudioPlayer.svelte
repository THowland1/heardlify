<script lang="ts">
  import { getSong } from './get-song';
  export let maxLength: number;
  export let lengthSteps = [1, 2, 4, 7, 11, 16];
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
  $: maxPercentage = maxLength / duration;
  $: absoluteMaxLength = lengthSteps[lengthSteps.length - 1];

  $: if (currentTime > maxLength) {
    pause();
  }

  function play() {
    audio.play();
    audio = audio;
  }
  function pause() {
    audio.pause();
    audio.currentTime = 0;
    audio = audio;
  }

  function formatTime(seconds: number) {
    const mm = Math.floor(seconds / 60);
    const ss = Math.floor(seconds % 60);
    return `${mm}:${String(ss).padStart(2, '0')}`;
  }
</script>

<audio {src} bind:this={audio} bind:duration bind:currentTime bind:paused />

{#if !paused}
  <button on:click={pause}>pause</button>
{:else}
  <button on:click={play}>play</button>
{/if}
<!-- {paused}
{currentTime}
{duration}
{progressPercentage} -->
<div class="progress">
  <div
    class="progress-inner progress-inner-max"
    style="width: {100 * maxPercentage}%;"
  />
  <div
    class="progress-inner progress-inner-current"
    style="width: {100 * progressPercentage}%;"
  />
  {#each lengthSteps as step}
    <div
      class="progress-inner-step"
      class:inverted={step < absoluteMaxLength}
      style="left: {(100 * step) / absoluteMaxLength}%;"
    />
  {/each}
</div>
<div class="times">
  <span> {formatTime(currentTime)}</span>
  <span> {formatTime(absoluteMaxLength)}</span>
</div>

<style>
  .times {
    display: flex;
    justify-content: space-between;
  }
  .progress {
    position: relative;
    width: 300px;
    height: 10px;
    border: solid 1px #999;
  }
  .progress-inner {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
  }
  .progress-inner-step {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 1px;
    background-color: #999;
    z-index: 2;
  }
  .progress-inner-step.inverted {
    background-color: #fff;
  }
  .progress-inner-max {
    background-color: #999;
  }
  .progress-inner-current {
    z-index: 1;
    background-color: red;
  }
</style>
