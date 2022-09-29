<script lang="ts">
	import Modal from '../Modal/Modal.svelte';
	import Button from '../shared/Button.svelte';

	export let alert: string;
	export let onclose = () => {};

	const close = () => {
		alert = '';
		onclose();
	};
</script>

<Modal title="Feedback" open={Boolean(alert)} hideheading {close}>
	<div class="alert">
		<div class="alert-body">
			{alert}
		</div>
		<div class="alert-footer">
			<Button color="tertiary" on:click={close}>CLOSE</Button>
		</div>
	</div>
</Modal>

<style lang="scss">
	.alert {
		padding: 12px;
	}
	.alert-body {
		display: flex;
		padding: 12px;
		justify-content: center;
		color: var(--color-line);
	}
	.alert-footer {
		display: flex;
		justify-content: center;
		color: var(--color-line);
	}
</style>
