<script lang="ts">
	import './layout.css';
	import SiteHeader from '$lib/components/SiteHeader.svelte';
	import { page } from '$app/stores';

	let { children } = $props();

	let canonical = $derived($page.url.origin + $page.url.pathname);
</script>

<svelte:head>
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

	<meta property="og:site_name" content="Nehme AI Labs" />
	<meta property="og:url" content={canonical} />
	<meta name="twitter:card" content="summary_large_image" />

	<script type="application/ld+json">
		{JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'Organization',
			name: 'Nehme AI Labs',
			url: 'https://nehmeailabs.com',
			email: 'start.the.conversation@nehmeailabs.com'
		})}
	</script>
</svelte:head>

<SiteHeader />
{@render children()}
