<script lang="ts">
	import { page } from '$app/stores';

	function addHoursPure(date: Date, hours: number) {
		const copy = new Date(date);
		copy.setHours(copy.getHours() + hours);
		return copy;
	}
	function setSearchParamPure(url: URL, key: string, value: string) {
		const copy = new URL(url);
		copy.searchParams.set(key, value);
		return copy;
	}
	const url = $page.url;
	$: date = getDateFromURL(url);
	$: nextDay = addHoursPure(date, 24);
	$: previousDay = addHoursPure(date, -24);
	$: nextUrl = setSearchParamPure(url, 'date', nextDay.toISOString());
	$: previousUrl = setSearchParamPure(url, 'date', previousDay.toISOString());

	const email = $page.url.searchParams.get('time-machine');
	import { onMount } from 'svelte';
	import LoadingSpinner from './LoadingSpinner.svelte';
	import Play from './Play.svelte';
	import Playing from './Playing.svelte';
	import { createEventDispatcher } from 'svelte';
	import { getDateFromURL } from '$lib/functions/get-date-from-url';
	import ChevronLeft from './ChevronLeft.svelte';
	import ChevronRight from './ChevronRight.svelte';
	const dispatch = createEventDispatcher<{ play: void }>();
	export let autoplay = false;
	export let maxLength: number;
	export let lengthSteps: number[];
	export let src: string | null;
	export let timeMachine: boolean;
	let duration: number;
	let currentTime = 0;
	let audio: HTMLAudioElement | null = null;
	let paused = true;
	let tryingToPlay = false;

	$: progressPercentage = currentTime / absoluteMaxLength;
	$: maxPercentage = maxLength / absoluteMaxLength;
	$: absoluteMaxLength = lengthSteps[lengthSteps.length - 1];

	$: if (currentTime > maxLength) {
		pause();
	}
	$: if (tryingToPlay && audio) {
		tryingToPlay = false;
		play();
	}

	function play() {
		dispatch('play');
		if (!audio) {
			tryingToPlay = true;
			return;
		}
		audio.play();
		audio = audio;
	}
	function pause() {
		if (!audio) {
			return;
		}
		audio.pause();
		audio.currentTime = 0;
		audio = audio;
	}

	function formatTime(seconds: number) {
		const mm = Math.floor(seconds / 60);
		const ss = Math.floor(seconds % 60);
		return `${mm}:${String(ss).padStart(2, '0')}`;
	}

	onMount(() => {
		if (autoplay) {
			play();
		}
	});
</script>

{#if src}
	<audio {src} bind:this={audio} bind:duration bind:currentTime bind:paused />
{/if}

<!-- {paused}
{currentTime}
{duration}
{progressPercentage} -->
<div class="progress-container">
	<div class="progress">
		<div class="progress-inner progress-inner-max" style="width: {100 * maxPercentage}%;" />
		<div
			class="progress-inner progress-inner-current"
			style="width: {100 * progressPercentage}%;"
		/>
		{#each lengthSteps as step}
			<div
				class="progress-inner-step"
				class:inverted={step < maxLength}
				style="left: {(100 * step) / absoluteMaxLength}%;"
			/>
		{/each}
	</div>
</div>

<div class="button-bar">
	<span class="time"> {formatTime(currentTime)}</span>
	{#if timeMachine}
		<a class="chevron" href={previousUrl.toString()} target="_self"><ChevronLeft /></a>
	{/if}
	<button
		class="play-pause"
		class:play={paused}
		class:pause={!paused}
		on:click={paused ? play : pause}
	>
		{#if tryingToPlay}
			<LoadingSpinner />
		{:else if paused}
			<Play />
		{:else}
			<Playing />
		{/if}
	</button>
	{#if timeMachine}
		<a class="chevron" href={nextUrl.toString()} target="_self"><ChevronRight /> </a>
	{/if}
	<span class="time"> {formatTime(absoluteMaxLength)}</span>
</div>

<style>
	.button-bar {
		display: flex;
		justify-content: space-between;
		padding: 8px 12px;

		width: 100%;
		max-width: var(--width-game);
		margin: auto;
	}

	.progress-container {
		width: 100%;
		border-top: solid 1px var(--color-line);
		border-bottom: solid 1px var(--color-line);
		padding: 0 12px;
	}
	.progress {
		width: 100%;
		max-width: var(--width-game);
		margin: auto;

		position: relative;
		height: 14px;
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
		background-color: var(--color-bg);
	}
	.progress-inner-max {
		background-color: var(--color-mg);
	}
	.progress-inner-current {
		z-index: 1;
		background-color: var(--color-positive);
	}
	.play-pause {
		color: var(--color-fg);
		border: solid 2px var(--color-fg);
		height: 48px;
		width: 48px;
		border-radius: 48px;
		background-color: transparent;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.chevron {
		color: var(--color-fg);
		align-self: center;
	}
</style>
