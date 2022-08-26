<script lang="ts">
	import AudioPlayer from '../shared/AudioPlayer/AudioPlayer.svelte';
	import Button from '../shared/Button.svelte';
	import Share from './Share.svelte';
	import SpotifyPreview from './SpotifyPreview.svelte';
	import type { IDetailedOption } from '../../types/IOption';
	import type { IStage } from '../../types/IStage';

	export let playlistName: string;
	let shareFeedback: string | null;
	export let correctOption: IDetailedOption;
	export let stages: IStage[];
	export let timeMachine: boolean;
	export let date: Date;
	const DAY_0 = new Date('2022-08-25');
	const DAY_IN_MS = 24 * 60 * 60 * 1000;

	function numberTo2Digit(val: number) {
		return String(val).padStart(2, '0');
	}

	function getFullDaysSinceEpoch(date: Date) {
		return Math.floor(date.valueOf() / DAY_IN_MS);
	}

	let now = new Date();
	const dayIndex = getFullDaysSinceEpoch(date) - getFullDaysSinceEpoch(DAY_0);
	let clear: number | null = null;
	$: {
		if (clear) clearInterval(clear);
		clear = setInterval(() => (now = new Date()), 1000) as any as number;
	}
	function getTimeToNextDayString(dateTime: Date) {
		const nextMidnight = new Date(dateTime);
		nextMidnight.setHours(24, 0, 0, 0);

		var msec = nextMidnight.valueOf() - now.valueOf();
		var hh = Math.floor(msec / 1000 / 60 / 60);
		msec -= hh * 1000 * 60 * 60;
		var mm = Math.floor(msec / 1000 / 60);
		msec -= mm * 1000 * 60;
		var ss = Math.floor(msec / 1000);
		msec -= ss * 1000;

		return `${numberTo2Digit(hh)}:${numberTo2Digit(mm)}:${numberTo2Digit(ss)}`;
	}
	$: timeToNextGameString = getTimeToNextDayString(now);

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
		const correctStage = stages.find((s) => s.guess.type === 'guessed' && s.guess.isCorrectSong);
		if (!correctStage) {
			return { type: 'failure' };
		}
		return {
			type: 'success',
			message: correctStage.message,
			time: correctStage.duration
		};
	}
	async function copyResultsToClipboard() {
		const text = `
    #Heardles-${playlistName}
    #${dayIndex}

    🔇${stages
			.map(({ guess }) => {
				if (guess.type === 'guessed') {
					if (guess.isCorrectSong) {
						return '🟩';
					} else if (guess.isCorrectArtist) {
						return '🟨';
					} else {
						return '🟥';
					}
				} else {
					return '⬛️';
				}
			})
			.join('')}

    ${window.location.toString()}
    `;

		const shareData = { text };
		if ('canShare' in navigator && 'share' in navigator && navigator.canShare(shareData)) {
			await navigator.share(shareData);
			shareFeedback = 'Shared!';
		} else if ('clipboard' in navigator && 'writeText' in navigator.clipboard) {
			await navigator.clipboard.writeText(text);
			shareFeedback = 'Copied to clipboard!';
		} else {
			shareFeedback = 'Could not copy!';
		}

		setTimeout((_) => (shareFeedback = null), 3000);
	}

	$: result = evaluateResult();

	$: headline = result.type === 'success' ? result.message : 'UNLUCKY!';
	$: message =
		result.type === 'success'
			? `You got today's Heardle within ${result.time} second${result.time === 1 ? '' : 's'}.`
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
					class:dash--correct={stage.guess.type === 'guessed' && stage.guess.isCorrectSong}
				/>
			{/each}
		</div>

		<div class="message">{@html message}</div>

		<Button on:click={copyResultsToClipboard} color="primary">SHARE&nbsp;<Share /></Button>
		{#if shareFeedback}
			<div class="share-feedback">{shareFeedback}</div>
		{/if}

		<div class="next">
			<div>NEXT HEARDLE IN</div>
			<div>{timeToNextGameString}</div>
		</div>
	</div>

	<div class="bottom">
		<AudioPlayer
			autoplay
			src={correctOption.previewUrl}
			maxLength={30}
			lengthSteps={[30]}
			{timeMachine}
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
	.next,
	.share-feedback {
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
