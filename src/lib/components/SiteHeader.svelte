<script lang="ts">
	import { page } from '$app/stores';

	type NavItem = { href: string; label: string; activeWhen?: (pathname: string) => boolean };

	const nav: NavItem[] = [
		{ href: '/', label: 'Home', activeWhen: (p) => p === '/' },
		{ href: '/flashcheck', label: 'FlashCheck', activeWhen: (p) => p.startsWith('/flashcheck') },
		{ href: '/blog', label: 'Blog', activeWhen: (p) => p.startsWith('/blog') || p.startsWith('/post') }
	];

	$: contactHref = $page.url.pathname === '/' ? '#contact' : '/#contact';
	$: pathname = $page.url.pathname;
	$: if (pathname) menuOpen = false;

	let menuOpen = false;

	const closeMenu = () => {
		menuOpen = false;
	};
</script>

<header class="main-header">
	<div class="container">
		<a class="logo" href="/" aria-label="Nehme AI Labs">
			<img class="logo-mark" src="/logo.png" alt="Nehme AI Labs logo" width="170" height="50" />
		</a>
		<nav class="main-nav" aria-label="Main">
			<button
				type="button"
				class="nav-toggle"
				aria-label="Toggle navigation"
				aria-expanded={menuOpen}
				on:click={() => (menuOpen = !menuOpen)}
			>
				<span class="nav-toggle-bar"></span>
				<span class="nav-toggle-bar"></span>
			</button>

			<div class="nav-links" class:open={menuOpen}>
				{#each nav as item (item.href)}
					<a
						href={item.href}
						on:click={closeMenu}
						class:active={item.activeWhen ? item.activeWhen($page.url.pathname) : $page.url.pathname === item.href}
					>
						{item.label}
					</a>
				{/each}
				<a href={contactHref} on:click={closeMenu} class:active={$page.url.hash === '#contact'}>Contact</a>
			</div>
		</nav>
	</div>
</header>

<style>
	.nav-toggle {
		display: none;
		border: 1px solid var(--border);
		background: transparent;
		color: var(--text-primary);
		padding: 0.6rem 0.7rem;
		border-radius: 6px;
		cursor: pointer;
	}

	.nav-toggle-bar {
		display: block;
		width: 20px;
		height: 2px;
		background: var(--text-secondary);
		margin: 5px 0;
	}

	.nav-links {
		display: flex;
		align-items: center;
	}

	@media (max-width: 768px) {
		.nav-toggle {
			display: inline-flex;
			align-items: center;
			justify-content: center;
		}

		.nav-links {
			display: none;
		}

		.nav-links.open {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			position: absolute;
			top: 100%;
			left: 0;
			right: 0;
			padding: 0.75rem 1.25rem;
			background: rgba(10, 10, 10, 0.92);
			backdrop-filter: blur(12px);
			-webkit-backdrop-filter: blur(12px);
			border-bottom: 1px solid var(--border);
		}

		/* Ensure global/blog CSS doesn't force desktop spacing */
		.main-nav a {
			margin-left: 0 !important;
			padding: 0.75rem 0;
			width: 100%;
		}

		.main-header .container {
			position: relative;
		}
	}
</style>


