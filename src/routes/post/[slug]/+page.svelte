<script lang="ts">
	import type { PageData } from './$types';
	import { OG_IMAGE_PATH, SITE_NAME, SITE_URL } from '$lib/config/site';

	let { data }: { data: PageData } = $props();

	const formatDate = (iso: string) => {
		const d = new Date(iso);
		return Number.isNaN(d.getTime())
			? iso
			: d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
	};
</script>

<svelte:head>
	<title>{data.metadata.title ? `${data.metadata.title} | Nehme AI Labs` : 'Post | Nehme AI Labs'}</title>
	<meta
		name="description"
		content={data.metadata.excerpt ??
			'Nehme AI Labs delivers fixed-fee architectural audits for on‑prem GenAI stacks—cutting compute cost and hallucination risk with deterministic verification (FlashCheck).'}
	/>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.metadata.title ? `${data.metadata.title} | ${SITE_NAME}` : `Post | ${SITE_NAME}`} />
	<meta
		property="og:description"
		content={data.metadata.excerpt ??
			'Nehme AI Labs delivers fixed-fee architectural audits for on‑prem GenAI stacks—cutting compute cost and hallucination risk with deterministic verification (FlashCheck).'}
	/>
	<meta property="og:image" content={`${SITE_URL}${OG_IMAGE_PATH}`} />
	<meta name="twitter:title" content={data.metadata.title ? `${data.metadata.title} | ${SITE_NAME}` : `Post | ${SITE_NAME}`} />
	<meta
		name="twitter:description"
		content={data.metadata.excerpt ??
			'Nehme AI Labs delivers fixed-fee architectural audits for on‑prem GenAI stacks—cutting compute cost and hallucination risk with deterministic verification (FlashCheck).'}
	/>
	{#if data.metadata.date}
		<meta property="article:published_time" content={data.metadata.date} />
	{/if}

	<script type="application/ld+json">
		{JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'Article',
			headline: data.metadata.title ?? data.slug,
			description:
				data.metadata.excerpt ??
				'Nehme AI Labs delivers fixed-fee architectural audits for on‑prem GenAI stacks—cutting compute cost and hallucination risk with deterministic verification (FlashCheck).',
			datePublished: data.metadata.date,
			author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
			publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
			mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/post/${data.slug}` },
			image: [`${SITE_URL}${OG_IMAGE_PATH}`]
		})}
	</script>
	<link rel="stylesheet" href="/blog.css" />
</svelte:head>

<main class="post-main">
	<div class="container">
		<header class="post-header">
			<h1 class="post-title">{data.metadata.title ?? data.slug}</h1>
			{#if data.metadata.date}
				<p class="post-meta">Published on {formatDate(data.metadata.date)}</p>
			{/if}
		</header>

		<article class="post-content" id="post-content">
			{#if data.component}
				{@const Post = data.component}
				<Post />
			{/if}
		</article>
	</div>
</main>


