<script lang="ts">
	import type { PageData } from './$types';

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
			'Insights from Nehme AI Labs on on‑prem GenAI architecture, efficiency, reliability engineering, and AI systems.'}
	/>
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


