<script lang="ts">
	import '../app.css';
	import { QueryClient, QueryClientProvider } from '@sveltestack/svelte-query';
	import { navigating } from '$app/stores';

	const queryClient = new QueryClient();
</script>

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
