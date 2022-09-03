<script lang="ts">
	import HeardlifyApi from '$lib/functions/heardlify-api';
	import { variables } from '$lib/variables';
	import { page } from '$app/stores';
	import { useMutation } from '@sveltestack/svelte-query';
	import Button from '../shared/Button.svelte';
	import AnimatedEllipsis from '../Header/AnimatedEllipsis.svelte';

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

{#if open}
	<div class="feedback-modal">
		<button class="bg" on:click={close} />
		{#if $mutation.isSuccess}
			<div class="container">
				<div class="title">
					<h1>Feedback</h1>
				</div>
				<p>Thank you for the feedback!</p>
				<Button on:click={close}>Close</Button>
			</div>
		{:else}
			<div class="container">
				<div class="title">
					<h1>Feedback</h1>
				</div>
				<p>Thank you for clicking the feedback button!</p>
				<p>
					I am very proud of the app and am always looking for ways to improve the players'
					experiences
				</p>
				<p>Any feedback, positive or constructive, is welcome!</p>
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
			</div>
		{/if}
	</div>
{/if}

<style>
	p {
		margin-bottom: 0;
	}
	.bg {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		z-index: -1;
		opacity: 0;
	}
	.feedback-modal {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		background-color: var(--color-overlay);
		z-index: 3;
		backdrop-filter: blur(2px);
	}

	.container {
		width: 100%;
		max-width: var(--width-game);
		margin: auto;
		padding: 16px;

		display: flex;
		flex-direction: column;
		gap: 12px;
		height: 100%;
		justify-content: center;
	}

	.title {
		display: flex;
		justify-content: space-between;
		align-items: center;
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
		margin-top: 32px;
		color: var(--color-fg);
		font-size: 0.8em;
		font-weight: 600;
	}
</style>
