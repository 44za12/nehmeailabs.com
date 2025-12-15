import type { PageLoad } from './$types';

type PostModule = {
	metadata?: {
		title?: string;
		date?: string;
		excerpt?: string;
	};
};

export const load: PageLoad = async () => {
	const modules = import.meta.glob('$lib/posts/*.md', { eager: true }) as Record<string, PostModule>;

	const posts = Object.entries(modules)
		.map(([path, mod]) => {
			const slug = path.split('/').pop()?.replace(/\.md$/, '') ?? path;
			return {
				slug,
				title: mod.metadata?.title ?? slug,
				date: mod.metadata?.date ?? '',
				excerpt: mod.metadata?.excerpt ?? ''
			};
		})
		.sort((a, b) => (a.date < b.date ? 1 : -1));

	return { posts };
};


