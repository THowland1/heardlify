<script lang="ts">
	import PlaylistSearch from '$lib/components/PlaylistSearch/PlaylistSearch.svelte';
	import type { PageData } from '.svelte-kit/types/src/routes/$types';
	import { page } from '$app/stores';
	import { browser } from '$app/env';
	import FeedbackModal from './FeedbackModal.svelte';
	import TabGroup from '$lib/components/TabGroup/TabGroup.svelte';
	import Favourites from '$lib/components/Favourites/Favourites.svelte';
	import { setDateContext } from './date-context';
	import { getDateFromURL } from '$lib/functions/get-date-from-url';
	import SupportModal from './SupportModal.svelte';
	import SunsetModal from './SunsetModal.svelte';
	import { fade } from 'svelte/transition';
	import Recents from '$lib/components/Recents/Recents.svelte';
	const TITLE = 'Heardlify';
	const DESCRIPTION = 'Make a guessing game from your favourite playlist!';
	const IMAGE = `${$page.url.origin}/og-image.png`;

	let feedbackModalOpen = false;
	let supportModalOpen = false;
	let sunsetModalOpen = false;
	const selectedTabOptions = ['search', 'favourites', 'recents'] as const;
	let selectedTab = 'search' as typeof selectedTabOptions[number];

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
	<div class="messages">
		<p class="subheading">Look up any Spotify playlist and turn it into a guessing game</p>
		<div class="subheading">🌅 Heardlify is sunsetting  🌅</div>
		<button class="button support" on:click={() => (sunsetModalOpen = true)}>
			What does this mean?
		</button>
	</div>
	<TabGroup options={selectedTabOptions} bind:value={selectedTab} />

	<div class="tab-panels">
		{#key selectedTab}
			<div class="tab-panel" transition:fade>
				{#if selectedTab === 'search'}
					<PlaylistSearch {date} />
				{/if}
				{#if selectedTab === 'favourites' && browser}
					<Favourites {date} />
				{/if}
				{#if selectedTab === 'recents' && browser}
					<Recents {date} />
				{/if}
			</div>
		{/key}
	</div>
	<div class="buttons">
		<button class="button support" on:click={() => (supportModalOpen = true)}
			>Support the app</button
		>
		<button class="button feedback" on:click={() => (feedbackModalOpen = true)}>Feedback</button>
	</div>
</div>
<FeedbackModal bind:open={feedbackModalOpen} />
<SupportModal bind:open={supportModalOpen} />
<SunsetModal bind:open={sunsetModalOpen} />

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
	.messages {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 2px;
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
	.buttons {
		display: flex;
		justify-content: space-around;
		width: 100%;
	}
	.button {
		border: none;
		background: transparent;
		text-decoration: underline;
		color: var(--color-line);
	}
	.tab-panels {
		position: relative;
		flex: 1;
		width: 100%;
		overflow: auto;
	}
	.tab-panel {
		position: absolute;
		inset: 0;
	}
</style>
