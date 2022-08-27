<script lang="ts">
	import '../app.css';
	import { QueryClient, QueryClientProvider } from '@sveltestack/svelte-query';
	import { navigating, page } from '$app/stores';
	import ChevronLeft from '$lib/components/shared/AudioPlayer/ChevronLeft.svelte';
	import LinkThatLooksLikeButton from '$lib/components/shared/LinkThatLooksLikeButton.svelte';
	import Header from '$lib/components/Header/Header.svelte';

	const queryClient = new QueryClient();

	const URL = $page.url;
</script>

<div class="bg" />
<div class="bg-blur" />
<Header playlistName={null} showChip={false} />
<div class="whole-thing">
	<h1>Uh oh!</h1>
	<p class="subheading">
		You have stumbled on a page that doesn't exist!<br />Or something has gone wrong on our end.<br
		/>Either way, sorry about that.
	</p>
	<LinkThatLooksLikeButton color="primary" href="/"
		><span class="button-contents"><ChevronLeft /> Go back to home</span></LinkThatLooksLikeButton
	>
</div>

<style>
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
	.button-contents {
		display: flex;
		align-items: center;
		line-height: 1;
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
		line-height: 1.5;
	}
	.whole-thing {
		max-width: var(--width-game);
		margin: auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: var(--padding);
		height: 100%;
		gap: 12px;
	}
</style>
