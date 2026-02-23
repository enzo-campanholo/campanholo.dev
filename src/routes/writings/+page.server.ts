import type { PageServerLoad } from './$types';
import { listWritings } from '$lib/server/writings';

export const load: PageServerLoad = async () => {
	return {
		heading: "Enzo's Writings",
		items: await listWritings()
	};
};
