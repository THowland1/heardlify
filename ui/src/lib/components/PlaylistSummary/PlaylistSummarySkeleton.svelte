<script lang="ts">
	interface $$Props extends svelte.JSX.HTMLAttributes<HTMLDivElement> {
		shimmer?: boolean;
	}
	import Skeleton from './Skeleton.svelte';
	export let shimmer = true;
</script>

<div class="playlist" {...$$restProps}>
	<div class="image" height="80px" width="80px">
		<Skeleton style="height: 100%; width:100%" {shimmer} />
	</div>
	<div class="text">
		<Skeleton style="width: 25%" {shimmer} />
		<Skeleton style="width: 50%" {shimmer} />
		<Skeleton style="width: 25%" {shimmer} />
	</div>
</div>

<style>
	.wrapper {
		position: relative;
	}
	.playlist {
		display: flex;
		height: 80px;
		background-color: var(--color-mbg);
		border-radius: 8px;
		overflow: hidden;
		margin-bottom: 12px;

		color: inherit;
		padding: 0;
		text-decoration: inherit;
	}

	.image {
		height: 80px;
		width: 80px;
	}
	.text {
		flex: 1;
		padding: 12px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		overflow: hidden;
	}
	.description {
		text-overflow: ellipsis;
		overflow: hidden;
		color: var(--color-line);
		white-space: nowrap;
	}
	.owner {
		color: var(--color-line);
	}
	.star {
		position: absolute;
		bottom: 0;
		right: 0;
		background-color: transparent;
		border: none;
		color: var(--color-line);
		padding: 6px;
		height: 32px;
		width: 32px;
	}
</style>
