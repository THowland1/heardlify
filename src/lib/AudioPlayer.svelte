<script lang="ts">
  let audio: HTMLAudioElement = null as any;
</script>

<audio
  bind:this={audio}
  id="track"
  src="data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA"
/>
<button on:click={() => audio.play()}>play</button>
<div>dfzjxodfjioprdsz</div>

<style>
  div {
    border: solid 1px #999;
  }
</style>
