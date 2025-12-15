import type { RequestHandler } from './$types';
import { OG_IMAGE_PATH, SITE_NAME, SITE_URL } from '$lib/config/site';

type PostModule = {
	metadata?: {
		title?: string;
		date?: string;
		excerpt?: string;
	};
};

const escapeXml = (s: string) =>
	s
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');

export const prerender = true;

export const GET: RequestHandler = async () => {
	const modules = import.meta.glob('$lib/posts/*.md', { eager: true }) as Record<string, PostModule>;

	const posts = Object.entries(modules)
		.map(([p, mod]) => {
			const slug = p.split('/').pop()?.replace(/\.md$/, '') ?? p;
			return {
				slug,
				title: mod.metadata?.title ?? slug,
				date: mod.metadata?.date ?? '',
				excerpt: mod.metadata?.excerpt ?? ''
			};
		})
		.sort((a, b) => (a.date < b.date ? 1 : -1));

	const items = posts
		.map((post) => {
			const link = `${SITE_URL}/post/${post.slug}`;
			const pubDate = post.date ? new Date(post.date).toUTCString() : '';
			return `
  <item>
    <title>${escapeXml(post.title)}</title>
    <link>${escapeXml(link)}</link>
    <guid isPermaLink="true">${escapeXml(link)}</guid>
    ${pubDate ? `<pubDate>${escapeXml(pubDate)}</pubDate>` : ''}
    <description>${escapeXml(post.excerpt)}</description>
  </item>`;
		})
		.join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${escapeXml(`${SITE_NAME} Blog`)}</title>
  <link>${escapeXml(SITE_URL)}</link>
  <description>${escapeXml(
		'Insights from Nehme AI Labs on on‑prem GenAI architecture, efficiency, reliability engineering, and AI systems.'
	)}</description>
  <image>
    <url>${escapeXml(`${SITE_URL}${OG_IMAGE_PATH}`)}</url>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${escapeXml(SITE_URL)}</link>
  </image>
${items}
</channel>
</rss>
`;

	return new Response(xml, {
		headers: {
			'content-type': 'application/rss+xml; charset=utf-8',
			'cache-control': 'public, max-age=300'
		}
	});
};


