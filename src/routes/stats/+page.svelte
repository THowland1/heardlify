<script lang="ts">
	import ActivityByTime from './activity-by-time.svelte';

	import Logs from './logs.svelte';

	import MostActiveSessions from './most-active-sessions.svelte';
	import ScoresForPlaylistDay from './scores-for-playlist-day.svelte';
	import SessionHistory from './session-history.svelte';
	import TopPlaylists from './top-playlists.svelte';
</script>

<svelte:head />

<div class="bg" />
<div class="bg-blur" />
<div class="whole-thing">
	<div>
		<h2>Activity by time</h2>
		<ActivityByTime />
	</div>
	<div>
		<h2>Top playlists</h2>
		<TopPlaylists />
	</div>
	<div>
		<h2>Logs</h2>
		<Logs />
	</div>
	<div>
		<h2>Scores for Playlist Day</h2>
		<ScoresForPlaylistDay />
	</div>
	<div>
		<h2>Erroring endpoints</h2>
		<div>Coming soon</div>
	</div>
	<div>
		<h2>Most Active Sessions</h2>
		<MostActiveSessions />
	</div>
	<div>
		<h2>Session history</h2>
		<SessionHistory />
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

	.whole-thing {
		max-width: var(--width-game);
		margin: auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: var(--padding);
		height: 100%;
		gap: 12px;
	}
</style>
