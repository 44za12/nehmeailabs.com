<script lang="ts">
	import './layout.css';
	import SiteHeader from '$lib/components/SiteHeader.svelte';
	import { page } from '$app/stores';
	import { OG_IMAGE_PATH, SITE_DESCRIPTION, SITE_EMAIL, SITE_NAME, SITE_TAGLINE, SITE_URL } from '$lib/config/site';

	let { children } = $props();

	let canonical = $derived(SITE_URL + $page.url.pathname);
	let ogImage = $derived(SITE_URL + OG_IMAGE_PATH);
</script>

<svelte:head>
	<meta name="robots" content="index,follow" />
	<meta name="theme-color" content="#000000" />
	<link rel="manifest" href="/site.webmanifest" />

	<link rel="icon" href="/favicon.ico" sizes="any" />
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
	<link rel="apple-touch-icon" href="/apple-touch-icon.png" />

	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;800;900&display=swap"
		rel="stylesheet"
	/>

	<link rel="stylesheet" href="/styles.css" />

	<link rel="canonical" href={canonical} />

	<link rel="alternate" type="application/rss+xml" title="Nehme AI Labs Blog" href="/rss.xml" />

	<meta name="description" content={SITE_DESCRIPTION} />

	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:url" content={canonical} />
	<meta property="og:type" content="website" />
	<meta property="og:image" content={ogImage} />
	<meta property="og:description" content={SITE_DESCRIPTION} />
	<meta name="twitter:image" content={ogImage} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:description" content={SITE_DESCRIPTION} />

	<script type="application/ld+json">
		{JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'Organization',
			name: SITE_NAME,
			url: SITE_URL,
			email: SITE_EMAIL,
			description: SITE_TAGLINE
		})}
	</script>
</svelte:head>

<SiteHeader />
{@render children()}
