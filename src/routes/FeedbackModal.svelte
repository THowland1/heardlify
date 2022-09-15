<script lang="ts">
	import HeardlifyApi from '$lib/functions/heardlify-api';
	import { variables } from '$lib/variables';
	import { page } from '$app/stores';
	import { useMutation } from '@sveltestack/svelte-query';
	import Button from '$lib/components/shared/Button.svelte';
	import AnimatedEllipsis from '$lib/components/Header/AnimatedEllipsis.svelte';
	import Modal from '$lib/components/Modal/Modal.svelte';

	export let open = true;
	const baseURL = variables.basePath || $page.url.origin;
	const api = new HeardlifyApi(baseURL);

	let content = '';

	$: mutation = useMutation(() =>
		api.sendFeedback({
			content
		})
	);

	function close() {
		open = false;
		$mutation.reset();
		content = '';
	}
</script>

<Modal title="Feedback" bind:open>
	<div class="container">
		{#if $mutation.isSuccess}
			<p>Thank you for the feedback!</p>
			<Button on:click={close}>Close</Button>
		{:else}
			<p>Thank you for clicking the feedback button!</p>
			<p>
				I am very proud of the app and am always looking for ways to improve the players'
				experiences
			</p>
			<p>Any feedback, positive or constructive, is welcome!</p>
			<p>If you wish to get a response, don't forget to include a return address (email, etc.)!</p>
			<label class="label" for="feedback">Your feedback</label>
			<textarea name="feedback" class="textarea" cols="30" rows="10" bind:value={content} />
			<Button color="primary" disabled={$mutation.isLoading} on:click={() => $mutation.mutate()}>
				{#if $mutation.isLoading}
					&nbsp;<AnimatedEllipsis />&nbsp;
				{:else}
					Submit
				{/if}
			</Button>
			<Button on:click={close}>Close</Button>
		{/if}
	</div>
</Modal>

<style>
	p {
		margin: 0;
		margin-bottom: 8px;
	}

	.container {
		width: 100%;
		max-width: var(--width-game);
		margin: auto;
		padding: 24px;
		padding-top: 0;

		display: flex;
		flex-direction: column;
		gap: 12px;
		height: 100%;
		justify-content: center;
	}

	.textarea {
		background-color: var(--color-overlay);
		border: solid 2px var(--color-mg);
		color: var(--color-fg);
		padding: 8px;
	}
	.textarea:focus {
		border-color: var(--color-positive);
		outline: none;
	}
	.label {
		margin-top: 16px;
		color: var(--color-fg);
		font-size: 0.8em;
		font-weight: 600;
	}
</style>
