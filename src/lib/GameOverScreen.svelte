<script lang="ts">
  import AudioPlayer from './AudioPlayer.svelte';
  import Button from './Button.svelte';
  import Share from './Share.svelte';
  import SpotifyPreview from './SpotifyPreview.svelte';
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

<div class="game-over-screen">
  <div class="top">
    <SpotifyPreview song={correctOption} />
  </div>

  <div class="middle">
    <div class="headline">{headline}</div>

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

    <div class="message">{@html message}</div>

    <Button color="primary">SHARE&nbsp;<Share /></Button>

    <div class="next">
      <div>NEXT HEARDLE IN</div>
      <div>00:00:00</div>
    </div>
  </div>

  <div class="bottom">
    <AudioPlayer
      autoplay
      src={correctOption.previewUrl}
      maxLength={30}
      lengthSteps={[30]}
    />
  </div>
</div>

<style>
  .top {
    width: 100%;
    max-width: var(--width-game);
    margin: 0 auto;
  }
  .game-over-screen {
    padding: 16px;

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    height: 100%;
  }
  .middle {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 16px;
  }
  .headline {
    font-size: 20px;
  }
  .message,
  .next {
    color: var(--color-line);
    line-height: 2;
  }
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
