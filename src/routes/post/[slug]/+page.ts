import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

type PostModule = {
	default: import('svelte').Component;
	metadata?: {
		title?: string;
		date?: string;
		excerpt?: string;
	};
};

export const load: PageLoad = async ({ params }) => {
	const modules = import.meta.glob('$lib/posts/*.md', { eager: true }) as Record<string, PostModule>;
	const entry = Object.entries(modules).find(([path]) => path.endsWith(`/${params.slug}.md`));
	if (!entry) throw error(404, 'Post not found');

	const [, mod] = entry;
	return {
		component: mod.default,
		metadata: mod.metadata ?? {},
		slug: params.slug
	};
};


