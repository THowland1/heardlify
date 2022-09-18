<script lang="ts">
	import { browser } from '$app/env';

	import { page } from '$app/stores';
	import { MMath } from '$lib/utils/math-extend';
	import { useQuery } from '@sveltestack/svelte-query';
	import Times from '../icons/Times.svelte';
	import TabGroup from '../TabGroup/TabGroup.svelte';
	import { dragscroll } from './drag-scroll';
	import {
		fillInDays,
		getBarsFromDaysWithResults,
		getDaysForPlaylistIdFromLocalStorage,
		getSummaryFromDays,
		getBarsFromGlobalDayStats,
		getSummaryFromGlobalDayStats
	} from './stats-helper';
	import HeardlifyApi from '$lib/functions/heardlify-api';
	import { variables } from '$lib/variables';
	import { EpochDay } from '$lib/utils/epoch-day';

	export let open: boolean;
	export let playlistId: string;
	export let playlistName: string;
	export let date: Date;

	let taboptions = ['local', 'global'] as const;
	let tabvalue = 'local' as typeof taboptions[number];

	$: daysWithResults = getDaysForPlaylistIdFromLocalStorage(browser, playlistId);
	$: days = fillInDays(daysWithResults);
	$: localsummary = getSummaryFromDays(days);
	$: localbars = getBarsFromDaysWithResults(open ? daysWithResults : []);

	$: today = days.find((o) => o.epochday === EpochDay.fromDate(date));

	const baseURL = variables.basePath || $page.url.origin;
	const api = new HeardlifyApi(baseURL);

	$: queryResult = useQuery(
		['scores-for-playlist-day', { date, playlistId }] as const,
		async ({ queryKey }) => {
			console.log(queryKey);
			return api.getScoresForPlaylistDay(queryKey[1]);
		},
		{ enabled: tabvalue === 'global' }
	);
	$: globalbars = getBarsFromGlobalDayStats($queryResult.data);
	$: globalsummary = getSummaryFromGlobalDayStats($queryResult.data);
	$: bars = tabvalue === 'local' ? localbars : globalbars;
	$: summary = tabvalue === 'local' ? localsummary : globalsummary;
</script>

<div class="whole-thing" class:hidden={!open}>
	<div class="overlay" on:click={() => (open = false)} />
	<div class="card">
		<div class="heading">
			<div class="spacer" />
			<div class="heading-text">Stats</div>
			<div class="spacer">
				<button class="close-button" on:click={() => (open = false)}><Times /></button>
			</div>
		</div>
		<div class="body">
			<div class="tabs-container">
				<TabGroup options={taboptions} bind:value={tabvalue} />
			</div>
			<div class="chart" style:--bar-maxcount={Math.max(...bars.map((o) => o.count)) || 1}>
				{#each bars as bar, index}
					<div class="column" style:--bar-index={index} style:--bar-count={bar.count}>
						<div class="count">{bar.count || ''}</div>
						<div
							class="bar"
							class:positive={bar.color === 'positive'}
							class:negative={bar.color === 'negative'}
						/>
						<div
							class="label"
							class:todaysscore={today &&
								today.result &&
								today.result.numberOfGuesses === bar.numberOfGuesses}
						>
							{bar.label}
						</div>
					</div>
				{/each}
			</div>
			<div class="legend">
				<div>Score distribution for</div>
				{#if tabvalue === 'local'}
					<div class="playlist-name">You &bull; {playlistName} &bull; All Time</div>
				{/if}
				{#if tabvalue === 'global'}
					<div class="playlist-name">Everyone &bull; {playlistName} &bull; Today</div>
				{/if}
			</div>
			<div class="summary">
				<div class="summary-item">
					<div class="summary-value">{summary.totalcorrect}/{summary.total}</div>
					<div class="summary-label">Correct</div>
				</div>
				<div class="summary-item">
					<div class="summary-value">{MMath.percent(summary.totalcorrect, summary.total)}</div>
					<div class="summary-label">Correct %</div>
				</div>

				{#if summary.streak}
					{@const streak = summary.streak}
					<div class="summary-item">
						<div class="summary-value">{streak.current} : {streak.max}</div>
						<div class="summary-label">Current:Max Streak</div>
					</div>
				{/if}
			</div>
			<div class="squares-container">
				<div class="squares-container-overlay left" />
				<div class="squares-container-overlay right" />
				<div class="squares" use:dragscroll>
					{#if tabvalue === 'local'}
						{#each days as day, i}
							{@const date = EpochDay.toDate(day.epochday)}
							<div
								title={date.toLocaleDateString(undefined, {
									month: 'short',
									day: 'numeric',
									year: 'numeric'
								})}
								class="square"
								class:empty={day.result === null || day.result.type === 'unfinished'}
								class:positive={day.result && day.result.type === 'success'}
								class:negative={day.result && day.result.type === 'failure'}
							>
								{#if i === 0 || date.getDate() === 1}
									<div class="month">{date.toLocaleDateString(undefined, { month: 'short' })}</div>
									{date.getDate()}
								{/if}
							</div>
						{/each}
					{/if}
					{#if tabvalue === 'global'}
						<div class="square" />
					{/if}
				</div>
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
	@mixin padding-y($val) {
		padding-top: $val;
		padding-bottom: $val;
	}
	@mixin padding-x($val) {
		padding-left: $val;
		padding-right: $val;
	}
	@mixin hide-scrollbar() {
		/* Hide scrollbar for Chrome, Safari and Opera */
		&::-webkit-scrollbar {
			display: none;
		}

		/* Hide scrollbar for IE, Edge and Firefox */
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
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

	.tabs-container {
		display: flex;
		justify-content: center;
	}
	.card {
		@include absolute-inset-0;
		margin: auto;
		width: 100%;
		height: fit-content;
		max-width: 450px;
		background-color: var(--color-bg);

		display: flex;
		flex-direction: column;
		border-radius: 16px;
	}
	.heading {
		padding: 24px;
		padding-bottom: 8px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: var(--color-line);
		text-transform: uppercase;
		font-weight: 700;
		letter-spacing: 1px;

		.spacer {
			width: 32px;
		}

		.close-button {
			cursor: pointer;
		}
	}
	.body {
		flex: 1;
	}
	.chart {
		@include padding-x(24px);
		height: var(--height-chart);
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
	}
	.legend {
		@include padding-y(16px);
		padding-top: 16px;
		padding-bottom: 8px;

		@include flex-place-center();
		flex-direction: column;
		color: var(--color-line);

		.playlist-name {
			color: var(--color-fg);
			font-weight: 600;
			line-height: 3;
		}
	}
	.column {
		height: 100%;
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
			width: var(--height-label);
			line-height: 1;
			color: var(--color-line);

			&.todaysscore {
				background-color: var(--color-line);
				color: var(--color-bg);
				border-radius: 100vw;
			}
		}
	}

	.summary {
		@include padding-y(16px);
		@include padding-x(16px);

		display: flex;
		justify-content: space-around;
		border-top: solid 1px var(--color-mg);
		.summary-item {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			text-align: center;

			.summary-value {
				font-size: 1.5em;
			}
			.summary-label {
				color: var(--color-line);
			}
		}
	}
	.squares-container {
		border-top: solid 1px var(--color-mg);
		overflow: hidden;
		position: relative;
		.squares-container-overlay {
			@include absolute-inset-0();
			z-index: 1;
			pointer-events: none;
			background: transparent;
			&.left {
				width: 24px;
				right: initial;
				border-bottom-left-radius: 16px;
				background: linear-gradient(
					90deg,
					var(--color-bg) 0%,
					var(--color-bg) 25%,
					transparent 100%
				);
			}
			&.right {
				width: 24px;
				left: initial;
				border-bottom-right-radius: 16px;
				background: linear-gradient(
					270deg,
					var(--color-bg) 0%,
					var(--color-bg) 25%,
					transparent 100%
				);
			}
		}
		.squares {
			@include padding-x(24px);
			@include padding-y(24px);
			display: flex;
			color: var(--color-line);
			overflow-x: auto;
			@include hide-scrollbar();
			position: relative;

			.square {
				@include flex-place-center();
				position: relative;
				font-size: 10px;
				line-height: 1;
				flex: 0 0 12px;
				height: 12px;
				margin-left: 4px;
				margin-right: 4px;
				background-color: transparent;
				&.empty {
					background-color: var(--color-mg);
				}
				&.positive {
					background-color: var(--color-positive);
				}
				&.negative {
					background-color: var(--color-negative);
				}

				.month {
					font-size: 12px;

					@include absolute-inset-0();
					top: -16px;
				}
			}
		}
	}
</style>
