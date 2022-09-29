<script lang="ts">
	import '../app.css';
	import { QueryClient, QueryClientProvider } from '@sveltestack/svelte-query';
	import { navigating, page } from '$app/stores';
	import PortalContextProvider from '$lib/context/PortalContextProvider.svelte';

	const queryClient = new QueryClient();

	const URL = $page.url;
</script>

<svelte:head>
	<base href="/" />

	<meta name="author" content="Tom Howland" />
	<meta property="og:locale" content="en_GB" />
	<meta property="og:url" content={URL.toString()} />
	<meta property="og:type" content="website" />

	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<QueryClientProvider client={queryClient}>
	<PortalContextProvider>
		<div class="fill" class:navigating={Boolean($navigating)}>
			<slot />
		</div>
	</PortalContextProvider>
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
