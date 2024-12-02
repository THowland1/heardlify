<script lang="ts">
	import { page } from '$app/stores';
	import { getDateFromURL } from '$lib/functions/get-date-from-url';
	import { setDateContext } from './date-context';
	const TITLE = 'Heardlify';
	const DESCRIPTION = 'Make a guessing game from your favourite playlist!';
	const IMAGE = `${$page.url.origin}/og-image.png`;

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
	<div class="messages">
		<h1>Heardlify</h1>
		<br>
		<div class="subheading">So long and goodnight!</div>
		<br>
		<div class="subheading">In November 2024, Spotify announced their API will no longer provide the 30-second previews that were the lifeblood of this project</div>
		<br>
		<div class="subheading">I can't state enough how honoured I am that people have enjoyed the app with their friends and families</div>
		<br>
		<div class="subheading">I am glad I brought you all joy</div>
		<br>
		<div class="subheading">Thank you for all your kind messages over the years</div>
		<p class="name">Tom</p>
	</div>
	
</div>
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
		min-height: 100vh;
		margin: auto;
		display: grid;
		place-items: center;
		justify-content: center;
		align-items: center;
		padding: var(--padding);
		height: 100%;
		gap: 12px;
	}

	.name {
			font-family: cursive;
			font-style: italic;
			font-size: 1.5em;
			text-align: right;
		}
</style>
