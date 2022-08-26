<script lang="ts">
	import '../app.css';
	import { QueryClient, QueryClientProvider } from '@sveltestack/svelte-query';
	import { navigating, page } from '$app/stores';

	const queryClient = new QueryClient();

	const TITLE = 'Heardlify';
	const DESCRIPTION = 'Make a guessing game from your favourite playlist!';
	const URL = $page.url.origin;
</script>

<svelte:head>
	<title>{TITLE}</title>

	<meta name="description" content={DESCRIPTION} />
	<base href="/" />

	<meta name="author" content="Tom Howland" />
	<meta property="og:title" content={TITLE} />
	<meta property="og:locale" content="en_GB" />
	<meta property="og:description" content={DESCRIPTION} />
	<meta property="og:url" content={URL} />
	<meta property="og:site_name" content={TITLE} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={TITLE} />
	<meta name="twitter:description" content={DESCRIPTION} />
	<meta name="twitter:image:alt" content={TITLE} />
</svelte:head>

<QueryClientProvider client={queryClient}>
	<div class="fill" class:navigating={Boolean($navigating)}>
		<slot />
	</div>
</QueryClientProvider>

<style>
	.fill {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		transition: all 0.6s ease-in-out;
		filter: blur(0px);
		background-color: transparent;
	}
	.fill.navigating {
		background-color: #0009;
		filter: blur(20px);
	}
</style>
