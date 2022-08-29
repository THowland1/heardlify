import type { PageServerLoad } from '.svelte-kit/types/src/routes/$types';

export const load: PageServerLoad = async ({ locals }) => {
	return {
		sessionId: locals.sessionid
	};
};
