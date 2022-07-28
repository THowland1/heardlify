<script>
  import svelteLogo from './assets/svelte.svg';
  import AudioPlayer from './lib/AudioPlayer.svelte';
  import Autocomplete from './lib/Autocomplete.svelte';
  import Counter from './lib/Counter.svelte';
  import Guesses from './lib/Guesses.svelte';

  const lengthSteps = [1, 2, 4, 7, 11, 16];
  let stepIndex = 0;
  function goToNextStep() {
    if (stepIndex < lengthSteps.length - 1) {
      stepIndex = stepIndex + 1;
    }
  }
  $: stepGap = lengthSteps[stepIndex + 1] - lengthSteps[stepIndex];
</script>

<main>
  <Guesses />
  <Autocomplete />
  <div id="buttons">
    <div id="skip">skip</div>
    <div id="submit">submit</div>
  </div>
  <AudioPlayer maxLength={lengthSteps[stepIndex]} {lengthSteps} />
  <button on:click={goToNextStep}>Skip{stepGap ? ` (+${stepGap}s)` : ''}</button
  >

  <div id="playlist" />
  <ul>
    <li><input type="checkbox" />Search all songs</li>
    <li><input type="checkbox" />Limit playback</li>
    <li><input type="checkbox" />Guess logic</li>
    <li>
      <input type="checkbox" /> Endpoint
      <ul>
        <li><input type="checkbox" />Update auth</li>
        <li><input type="checkbox" />Read playlist id</li>
        <li><input type="checkbox" />Pick one at random</li>
      </ul>
    </li>
  </ul>
</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
  }
</style>
