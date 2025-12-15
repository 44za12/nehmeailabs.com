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
	<title>Blog | Nehme AI Labs</title>
	<meta
		name="description"
		content="Insights from Nehme AI Labs on on‑prem GenAI architecture, efficiency, reliability engineering, and AI systems."
	/>
	<meta property="og:title" content="Blog | Nehme AI Labs" />
	<meta
		property="og:description"
		content="Insights on on‑prem GenAI architecture, efficiency, reliability engineering, and AI systems."
	/>
	<meta property="twitter:title" content="Blog | Nehme AI Labs" />
	<meta
		property="twitter:description"
		content="Insights on on‑prem GenAI architecture, efficiency, reliability engineering, and AI systems."
	/>
	<link rel="stylesheet" href="/blog.css" />
</svelte:head>

<main class="blog-main">
	<div class="container">
		<h1 class="blog-title">Blog</h1>
		<p class="blog-subtitle">Notes on on‑prem GenAI architecture, efficiency, reliability engineering, and AI systems.</p>

		<div class="posts-container" id="posts-container">
			{#each data.posts as post (post.slug)}
				<a href={`/post/${post.slug}`} class="post-card">
					<div class="post-card-content">
						<h2 class="post-card-title">{post.title}</h2>
						<p class="post-card-excerpt">{post.excerpt}</p>
						<div class="post-card-meta">
							<span class="post-card-date">{formatDate(post.date)}</span>
							<span class="post-card-readmore">Read More <span class="arrow">→</span></span>
						</div>
					</div>
				</a>
			{/each}
		</div>
	</div>
</main>


