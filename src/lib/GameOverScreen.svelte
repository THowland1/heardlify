<script lang="ts">
  import { onMount } from 'svelte';
  import AudioPlayer from './AudioPlayer.svelte';
  import type { IDetailedOption, IOption } from './types/IOption';
  import type { IStage } from './types/IStage';

  export let correctOption: IDetailedOption;
  export let stages: IStage[];

  type IResult =
    | {
        type: 'failure';
      }
    | {
        type: 'success';
        message: string;
        time: number;
      };
  function evaluateResult(): IResult {
    const correctStage = stages.find(
      (s) => s.guess.type === 'guessed' && s.guess.isCorrectSong
    );
    if (!correctStage) {
      return { type: 'failure' };
    }
    return {
      type: 'success',
      message: correctStage.message,
      time: correctStage.duration,
    };
  }
  $: result = evaluateResult();

  $: headline = result.type === 'success' ? result.message : 'UNLUCKY!';
  $: message =
    result.type === 'success'
      ? `You got today's Heardle within ${result.time} second${
          result.time === 1 ? '' : 's'
        }.`
      : `You didn't get today's Heardle.<br />Better luck tomorrow!`;
</script>

<div class="track">
  <img src={correctOption.imgSrc} alt="Album artwork" class="image" />
  <div class="description">
    <div>{correctOption.artists.formatted}</div>
    <div>{correctOption.name}</div>
    <div>{correctOption.year}</div>
  </div>
</div>
<div>{headline}</div>

<div class="dashes">
  {#each stages as stage}
    <div
      class="dash"
      class:dash--incorrect={stage.guess.type === 'guessed' &&
        !stage.guess.isCorrectArtist &&
        !stage.guess.isCorrectSong}
      class:dash--halfcorrect={stage.guess.type === 'guessed' &&
        stage.guess.isCorrectArtist &&
        !stage.guess.isCorrectSong}
      class:dash--correct={stage.guess.type === 'guessed' &&
        stage.guess.isCorrectSong}
    />
  {/each}
</div>

<div>{@html message}</div>

<button>SHARE</button>
<div>NEXT HEARDLE IN</div>
<div>00:00:00</div>

<AudioPlayer maxLength={30} lengthSteps={[30]} />

<style>
  .dashes {
    display: flex;
    justify-content: center;
    gap: 3px;
  }
  .dash {
    height: 3px;
    width: 20px;
    background-color: #999;
  }
  .dash--incorrect {
    background-color: red;
  }
  .dash--halfcorrect {
    background-color: gold;
  }
  .dash--correct {
    background-color: green;
  }
</style>
