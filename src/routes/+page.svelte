<script lang="ts">
	import PlaylistSearch from '$lib/components/PlaylistSearch/PlaylistSearch.svelte';
	import type { PageData } from '.svelte-kit/types/src/routes/$types';
	import { page } from '$app/stores';
	import { browser } from '$app/env';
	import FeedbackModal from '$lib/components/FeedbackModal/FeedbackModal.svelte';
	import TabGroup from '$lib/components/TabGroup/TabGroup.svelte';
	import Favourites from '$lib/components/Favourites/Favourites.svelte';
	import { setDateContext } from './date-context';
	import { getDateFromURL } from '$lib/functions/get-date-from-url';
	const TITLE = 'Heardlify';
	const DESCRIPTION = 'Make a guessing game from your favourite playlist!';
	const IMAGE = `${$page.url.origin}/og-image.png`;

	let feedbackModalOpen = false;
	let selectedTab = 'search' as 'search' | 'favourites';

	const date = getDateFromURL($page.url);
	setDateContext(date);
</script>

<svelte:head>
	<title>{TITLE}</title>

	<meta name="description" content={DESCRIPTION} />
	<meta property="og:title" content={TITLE} />
	<meta property="og:description" content={DESCRIPTION} />
	<meta property="og:site_name" content={TITLE} />
	<meta name="twitter:title" content={TITLE} />
	<meta name="twitter:description" content={DESCRIPTION} />
	<meta name="twitter:image:alt" content={TITLE} />
	<meta property="og:image" content={IMAGE} />
	<meta name="twitter:image" content={IMAGE} />
</svelte:head>

<div class="bg" />
<div class="bg-blur" />
<div class="whole-thing">
	<h1>Heardlify</h1>
	<p class="subheading">Look up any Spotify playlist and turn it into a guessing game</p>
	<TabGroup bind:value={selectedTab} />
	{#if selectedTab === 'search'}
		<PlaylistSearch {date} />
	{/if}
	{#if selectedTab === 'favourites' && browser}
		<Favourites {date} />
	{/if}
	<button class="feedback" on:click={() => (feedbackModalOpen = true)}>Feedback</button>
</div>
<FeedbackModal bind:open={feedbackModalOpen} />

<style>
	:root {
		--padding: 32px 8px;
	}
	@media only screen and (min-width: 600px) {
		:root {
			--padding: 32px 16px;
		}
	}
	.bg {
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		right: 0;
		background-image: url(/home-bg-640x422.jpeg);
		filter: blur(32px);
		z-index: -2;
		background-size: 100% 100%;
		transition: background-image 2s ease-in-out;
	}
	.bg-blur {
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		right: 0;
		z-index: 0;
		background-color: var(--color-overlay);
		z-index: -1;
	}
	h1 {
		text-align: center;
		font-size: 3rem;
	}
	.subheading {
		font-size: 1.25rem;
		color: var(--color-line);
		text-align: center;
		font-weight: 300;
		max-width: 400px;
	}
	.whole-thing {
		max-width: var(--width-game);
		margin: auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: var(--padding);
		height: 100%;
		gap: 12px;
	}
	.feedback {
		border: none;
		background: transparent;
		text-decoration: underline;
		color: var(--color-line);
	}
</style>
