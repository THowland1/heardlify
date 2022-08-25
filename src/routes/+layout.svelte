<script lang="ts">
	import '../app.css';

	import { QueryClient, QueryClientProvider } from '@sveltestack/svelte-query';
	const queryClient = new QueryClient();
</script>

<QueryClientProvider client={queryClient}>
	<slot />
</QueryClientProvider>
