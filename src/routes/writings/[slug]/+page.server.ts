import type { PageServerLoad } from './$types';
import { loadWritingBySlug } from '$lib/server/writings';

export const load: PageServerLoad = async ({ params }) => {
	const post = await loadWritingBySlug(params.slug);

	return {
		slug: params.slug,
		metadata: post.metadata,
		bodyHtml: post.bodyHtml
	};
};
