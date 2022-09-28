<script lang="ts">
	import AudioPlayer from '../shared/AudioPlayer/AudioPlayer.svelte';
	import Button from '../shared/Button.svelte';
	import Share from './icons/Share.svelte';
	import SpotifyPreview from './SpotifyPreview.svelte';
	import type { IDetailedOption } from '../../types/IOption';
	import type { IStage } from '../../types/IStage';
	import { onMount } from 'svelte';
	import { variables } from '$lib/variables';
	import { page } from '$app/stores';
	import StatsModal from './StatsModal.svelte';
	import { evaluateResult } from '$lib/functions/result-helper';
	import Stats from './icons/Stats.svelte';
	import { EpochDay } from '$lib/utils/epoch-day';
	import HeardlifyApi from '$lib/functions/heardlify-api';

	export let playlistId: string;
	export let playlistName: string;
	let shareFeedback: string | null;
	export let correctOption: IDetailedOption;
	export let stages: IStage[];
	export let timeMachine: boolean;
	export let date: Date;

	const apiClient = new HeardlifyApi(variables.apiBasePath);

	const DAY_0 = new Date('2022-08-25T00:00');
	const DAY_IN_MS = 24 * 60 * 60 * 1000;
	let statsOpen = false;

	function numberTo2Digit(val: number) {
		return String(val).padStart(2, '0');
	}

	let now = new Date();
	const epochday = EpochDay.fromDate(date);
	const dayIndex = epochday - EpochDay.fromDate(DAY_0);
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

	async function copyResultsToClipboard() {
		const text = `#Heardlify
#${playlistName.replaceAll(/[^A-z0-9]/g, '')}
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

		setTimeout(() => (shareFeedback = null), 3000);
	}

	$: result = evaluateResult(stages);

	$: headline = result.type === 'success' ? result.message : 'UNLUCKY!';
	$: message =
		result.type === 'success'
			? `You got today's answer within ${result.time} second${result.time === 1 ? '' : 's'}.`
			: `You didn't get today's answer.<br />Better luck tomorrow!`;

	onMount(async () => {
		const key = `${playlistId}:${epochday}:recorded`;
		const recorded = localStorage.getItem(key);
		if (!recorded) {
			const baseURL = variables.basePath || $page.url.origin;
			const success = await apiClient.recordResult({
				date,
				playlistId,
				playlistName,
				numberOfGuesses: result.numberOfGuesses
			});
			if (success) {
				localStorage.setItem(key, 'true');
			}
		}
	});
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

		<div class="buttons">
			<Button on:click={copyResultsToClipboard} color="primary">SHARE&nbsp;<Share /></Button>
			&nbsp; &nbsp;
			<Button color="secondary" on:click={() => (statsOpen = true)}>STATS&nbsp;<Stats /></Button>
		</div>
		{#if shareFeedback}
			<div class="share-feedback">{shareFeedback}</div>
		{/if}

		<div class="next">
			<div>NEXT GAME IN</div>
			<div>{timeToNextGameString}</div>
			<div>Can't wait that long?</div>
			<a class="play-another-link" href="/">PLAY ANOTHER!</a>
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
<StatsModal bind:open={statsOpen} {playlistId} {playlistName} {date} />

<style lang="scss">
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

	.play-another-link {
		color: var(--color-fg);
	}

	.buttons {
		display: flex;
	}
</style>
