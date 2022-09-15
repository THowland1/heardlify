<script lang="ts">
	import { browser } from '$app/env';

	import { evaluateResult } from '$lib/functions/result-helper';

	import { IStagesSchema } from '$lib/types/IStage';
	import { zz } from '$lib/utils/zod-extend';

	import Times from '../icons/Times.svelte';
	import { fade } from 'svelte/transition';

	export let open: boolean;
	export let playlistId: string;
	export let playlistName: string;

	type Stats = {
		_1: number;
		_2: number;
		_3: number;
		_4: number;
		_5: number;
		_6: number;
		_null: number;
	};
	type Bar = {
		label: string;
		count: number;
		color: 'positive' | 'negative';
	};

	function getAllResultsForPlaylistId(playlistId: string): Stats {
		const allkeys = Object.keys(localStorage);
		const matchingkeys = allkeys.filter((o) => o.startsWith(playlistId) && o.endsWith('guesses'));
		const matchingvalues = matchingkeys.map((key) => JSON.parse(localStorage.getItem(key) ?? '{}'));
		const values = matchingvalues.filter(zz.is(IStagesSchema));
		const counts = values.map(evaluateResult).map((o) => o.numberOfGuesses);
		const whereNumberOfGuessesIs = (numberOfGuesses: number | null) =>
			counts.filter((o) => o === numberOfGuesses).length;
		return {
			_1: whereNumberOfGuessesIs(1),
			_2: whereNumberOfGuessesIs(2),
			_3: whereNumberOfGuessesIs(3),
			_4: whereNumberOfGuessesIs(4),
			_5: whereNumberOfGuessesIs(5),
			_6: whereNumberOfGuessesIs(6),
			_null: whereNumberOfGuessesIs(null)
		};
	}

	const defaultStats: Stats = {
		_1: 0,
		_2: 0,
		_3: 0,
		_4: 0,
		_5: 0,
		_6: 0,
		_null: 0
	};
	$: {
		const newstats = browser && open ? getAllResultsForPlaylistId(playlistId) : defaultStats;
		bars[0].count = newstats._1;
		bars[1].count = newstats._2;
		bars[2].count = newstats._3;
		bars[3].count = newstats._4;
		bars[4].count = newstats._5;
		bars[5].count = newstats._6;
		bars[6].count = newstats._null;
		// bars = bars;
	}

	let bars = [
		{ label: '1°', count: 0, color: 'positive' },
		{ label: '2°', count: 0, color: 'positive' },
		{ label: '3°', count: 0, color: 'positive' },
		{ label: '4°', count: 0, color: 'positive' },
		{ label: '5°', count: 0, color: 'positive' },
		{ label: '6°', count: 0, color: 'positive' },
		{ label: '×', count: 0, color: 'negative' }
	] as [Bar, Bar, Bar, Bar, Bar, Bar, Bar];
	let bar1 = { label: '1°', count: 0, color: 'positive' };
	$: max = Math.max(...bars.map((o) => o.count)) || 1;
</script>

<div class="whole-thing" class:hidden={!open}>
	<div class="overlay" on:click={() => (open = false)} />
	<div class="card">
		<div class="heading">
			<div class="spacer" />
			<div class="heading-text">Stats</div>

			<button class="close-button" on:click={() => (open = false)}><Times /></button>
		</div>
		<div class="body">
			<div class="chart" style:--bar-maxcount={max}>
				{#each bars as bar, index}
					<div class="column" style:--bar-index={index} style:--bar-count={bar.count}>
						<div class="count">{bar.count || ''}</div>
						<div
							class="bar"
							class:positive={bar.color === 'positive'}
							class:negative={bar.color === 'negative'}
						/>
						<div class="label">{bar.label}</div>
					</div>
				{/each}
			</div>
			<div class="legend">
				<div>Your score distribution for</div>
				<div class="playlist-name">{playlistName}</div>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	@mixin absolute-inset-0 {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
	}
	@mixin flex-place-center {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	:root {
		--height-chart: 200px;
		--height-count: 1.5em;
		--height-label: 1.2em;
		--height-bar-max: calc(var(--height-chart) - var(--height-count) - var(--height-label));
		--height-bar-relative: 0;
	}

	.whole-thing {
		@include absolute-inset-0;
		z-index: 2;
		opacity: 1;
		transition: opacity 0.6s;

		&.hidden {
			opacity: 0;
			pointer-events: none;
		}
	}
	.overlay {
		@include absolute-inset-0;
		background-color: var(--color-overlay);
	}
	.card {
		@include absolute-inset-0;
		margin: auto;
		width: 100%;
		height: fit-content;
		max-width: 400px;
		background-color: var(--color-bg);

		display: flex;
		flex-direction: column;
		border-radius: 16px;
	}
	.heading {
		padding: 24px;
		display: flex;
		justify-content: space-between;
		color: var(--color-line);
		text-transform: uppercase;
		font-weight: 700;
		letter-spacing: 1px;
		.close-button {
			cursor: pointer;
		}
	}
	.body {
		flex: 1;
		padding: 0 24px;
	}
	.chart {
		height: var(--height-chart);
		display: flex;
		justify-content: space-between;
		overflow: hidden;
		align-items: flex-end;
	}
	.legend {
		@include flex-place-center();
		flex-direction: column;
		padding: 32px;
		color: var(--color-line);

		.playlist-name {
			color: var(--color-fg);
			font-weight: 600;
			line-height: 3;
		}
	}
	.column {
		height: 100%;
		overflow: hidden;
		width: 20px;

		display: flex;
		flex-direction: column;
		justify-content: flex-end;

		.count {
			@include flex-place-center();
			height: var(--height-count);
			line-height: 1;
		}
		.bar {
			--color-bar: var(--color-positive);
			&.positive {
				--color-bar: var(--color-positive);
			}
			&.negative {
				--color-bar: var(--color-negative);
			}
			height: calc(var(--height-bar-max) * var(--bar-count) / var(--bar-maxcount));
			background: linear-gradient(
				to top,
				transparent,
				transparent 20%,
				var(--color-bar) 20%,
				var(--color-bar)
			);
			background-size: 100% 8px;
			transition: height 0.6s;
			transition-delay: calc(0.3s + var(--bar-index) * 0.05s);
		}
		.label {
			@include flex-place-center();
			height: var(--height-label);
			line-height: 1;
			color: var(--color-line);
		}
	}
</style>
