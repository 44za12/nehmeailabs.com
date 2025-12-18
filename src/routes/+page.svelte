<script lang="ts">
	import { onMount } from 'svelte';
	import { inview } from '$lib/actions/inview';
	import { createDataFlowVisualization, createNeuralNetwork } from '$lib/legacy/visualizations';

	let neuralCanvas: HTMLCanvasElement | null = null;
	let dataFlowCanvas: HTMLCanvasElement | null = null;

	onMount(() => {
		let neural: { destroy: () => void } | null = null;
		let dataFlow: { destroy: () => void } | null = null;
		let indictmentObserver: IntersectionObserver | null = null;

		// Smooth in-page anchor scroll with fixed header offset
		const onAnchorClick = (e: Event) => {
			const target = e.target as HTMLElement | null;
			const anchor = target?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
			if (!anchor) return;

			const targetId = anchor.getAttribute('href');
			if (!targetId) return;
			const section = document.querySelector(targetId) as HTMLElement | null;
			if (!section) return;

			e.preventDefault();
			const headerOffset = 100;
			const top = section.getBoundingClientRect().top + window.pageYOffset - headerOffset;
			window.scrollTo({ top, behavior: 'smooth' });
		};

		document.addEventListener('click', onAnchorClick);

		if (neuralCanvas) neural = createNeuralNetwork(neuralCanvas);

		const indictmentSection = document.getElementById('indictment');
		if (indictmentSection && dataFlowCanvas) {
			const canvas = dataFlowCanvas;
			indictmentObserver = new IntersectionObserver(
				(entries) => {
					for (const entry of entries) {
						if (!entry.isIntersecting) continue;
						if (!dataFlow) dataFlow = createDataFlowVisualization(canvas);
					}
				},
				{ threshold: 0.1 }
			);
			indictmentObserver.observe(indictmentSection);
		}

		return () => {
			document.removeEventListener('click', onAnchorClick);
			indictmentObserver?.disconnect();
			neural?.destroy();
			dataFlow?.destroy();
		};
	});
</script>

<svelte:head>
	<title>Nehme AI Labs — Ruthlessly Efficient AI Architecture</title>
	<meta
		name="description"
		content="Nehme AI Labs delivers fixed-fee architectural audits for on‑prem GenAI stacks—cutting compute cost and failure risk with surgical interventions. FlashCheck is our RAG hallucination detector."
	/>
	<meta property="og:title" content="Nehme AI Labs" />
	<meta
		property="og:description"
		content="Fixed-fee architectural audits for on‑prem GenAI stacks—cut compute cost and reduce failure risk. FlashCheck is our RAG hallucination detector."
	/>
	<meta property="twitter:title" content="Nehme AI Labs" />
	<meta
		property="twitter:description"
		content="Fixed-fee architectural audits for on‑prem GenAI stacks—cut compute cost and reduce failure risk. FlashCheck is our RAG hallucination detector."
	/>
</svelte:head>

<section class="hero-section" id="top">
	<div class="hero-background" aria-hidden="true">
		<canvas id="neural-canvas" bind:this={neuralCanvas}></canvas>
		<div class="hero-grid-overlay"></div>
	</div>

	<div class="hero-content">
		<div class="hero-headline-wrapper">
			<h1 class="hero-headline">
				<span class="headline-word">Stop</span>
				<span class="headline-word">Burning</span>
				<span class="headline-word">Capital.</span>
			</h1>
		</div>

		<p class="hero-subheadline">
			Your on‑prem GenAI stack is a bonfire of inefficiency. We are the fire department.
		</p>

		<div style="display:flex; gap: 0.75rem; flex-wrap: wrap; justify-content: center; margin-top: 1.5rem">
			<a class="cta-button" href="#contact">Request an Audit <span class="cta-arrow">→</span></a>
			<a class="cta-button" href="/flashcheck" style="border-color: rgba(255,255,255,0.18)">
				Explore FlashCheck <span class="cta-arrow">→</span>
			</a>
		</div>

		<div class="scroll-indicator" aria-hidden="true">
			<div class="scroll-line"></div>
		</div>
	</div>
</section>

<section class="content-section" id="indictment">
	<div class="container">
		<div class="section-header">
			<div class="section-number">01</div>
			<h2 class="section-headline">The Circus of Architectural Malpractice</h2>
		</div>

		<div class="section-content">
			<p class="large-text fade-in" use:inview data-delay="0">
				We see PhDs deploying 70-billion-parameter models for retrieval tasks. We see entire server racks burning cash
				on simple classification. This isn't innovation. It's a failure of architectural imagination.
			</p>

			<div class="indictment-visualization fade-in" use:inview data-delay="250">
				<canvas id="data-flow-canvas" bind:this={dataFlowCanvas} aria-hidden="true"></canvas>
			</div>
		</div>
	</div>
</section>

<section class="content-section" id="solution">
	<div class="container">
		<div class="section-header">
			<div class="section-number">02</div>
			<h2 class="section-headline">The Surgical Intervention</h2>
		</div>

		<div class="section-content wide">
			<div class="solution-grid">
				<div class="solution-item fade-in" use:inview data-delay="0">
					<div class="solution-icon">01</div>
					<h3 class="solution-headline">We Don't Consult; We Audit.</h3>
					<p class="solution-text">
						A two-week, fixed-fee Architectural Audit. This is a diagnostic, not an open-ended engagement. We
						identify the inefficiencies. You receive a blueprint.
					</p>
				</div>

				<div class="solution-item fade-in" use:inview data-delay="150">
					<div class="solution-icon">02</div>
					<h3 class="solution-headline">We Don't Tweak; We Re-Architect.</h3>
					<p class="solution-text">
						First-principles thinking. We don't optimize what shouldn't exist. We replace a sledgehammer with a
						nutcracker. We replace monolithic models with a fleet of specialists.
					</p>
				</div>

				<div class="solution-item fade-in" use:inview data-delay="300">
					<div class="solution-icon">03</div>
					<h3 class="solution-headline">We Don't Propose; We Guarantee.</h3>
					<p class="solution-text">
						A clear, actionable blueprint to slash compute costs by a minimum of 30-60%. Not a proposal. A
						guarantee backed by architectural rigor.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<section class="content-section" id="sota">
	<div class="container">
		<div class="section-header">
			<div class="section-number">03</div>
			<h2 class="section-headline">Choose Your Precision</h2>
		</div>

		<div class="sota-content">
			<p class="sota-subtext fade-in" use:inview data-delay="0">
				The 1B is the gateway drug. The 4B is the product.
			</p>

			<div class="home-tier-grid" style="margin-top: 2rem">
				<div class="solution-item fade-in" use:inview data-delay="0">
					<div class="solution-icon">270M</div>
					<h3 class="solution-headline">FlashCheck‑Nano (270M)</h3>
					<p class="solution-text"><strong>Use case:</strong> Browser-side, latency-critical, mobile.</p>
					<p class="solution-text"><strong>Status:</strong> Free / Open Source.</p>
				</div>
				<div class="solution-item fade-in" use:inview data-delay="150">
					<div class="solution-icon">1B</div>
					<h3 class="solution-headline">FlashCheck‑Lite (1B)</h3>
					<p class="solution-text"><strong>Use case:</strong> High-volume filtering, internal tools.</p>
					<p class="solution-text"><strong>Performance:</strong> Beats GPT‑4o on RAG.</p>
					<p class="solution-text"><strong>Status:</strong> Apache 2.0 (Hugging Face).</p>
				</div>
				<div class="solution-item fade-in" use:inview data-delay="300">
					<div class="solution-icon">4B</div>
					<h3 class="solution-headline">FlashCheck‑Max (4B)</h3>
					<p class="solution-text"><strong>Use case:</strong> Regulated industries (finance, legal, health), customer-facing chatbots.</p>
					<p class="solution-text"><strong>Performance:</strong> 91.7% RAG accuracy. The ceiling of hallucination detection.</p>
					<p class="solution-text"><strong>Status:</strong> Commercial License / API.</p>
				</div>
			</div>

			<a class="cta-button fade-in" use:inview data-delay="450" href="/flashcheck">
				See the Benchmark <span class="cta-arrow">→</span>
			</a>
		</div>
	</div>
</section>

<style>
	/* Home page: 2-up grid + centered 3rd card */
	.home-tier-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1.5rem;
		align-items: stretch;
		margin-bottom: 2rem; /* breathing room before CTA/next section */
	}

	@media (max-width: 900px) {
		.home-tier-grid {
			grid-template-columns: 1fr;
			margin-bottom: 1.5rem;
		}
	}

	@media (min-width: 901px) {
		.home-tier-grid > :nth-child(3) {
			grid-column: 1 / -1;
			max-width: 720px;
			justify-self: center;
		}
	}
</style>

<section class="content-section" id="engagement">
	<div class="container">
		<div class="section-header">
			<div class="section-number">04</div>
			<h2 class="section-headline">Is This You?</h2>
		</div>

		<div class="engagement-content">
			<ul class="qualifying-questions">
				<li class="question-item" use:inview data-delay="0">
					<div class="question-number">01</div>
					<div class="question-text">Are you spending six or seven figures annually on your AI compute budget?</div>
				</li>
				<li class="question-item" use:inview data-delay="150">
					<div class="question-number">02</div>
					<div class="question-text">
						Do you suspect your architecture is inefficient but lack the internal expertise to prove it?
					</div>
				</li>
				<li class="question-item" use:inview data-delay="300">
					<div class="question-number">03</div>
					<div class="question-text">
						Are you ready to treat your AI stack as a strategic weapon instead of a cost center?
					</div>
				</li>
			</ul>

			<p class="final-statement fade-in" use:inview data-delay="450">If you answered yes, we should talk.</p>
		</div>
	</div>
</section>

<section class="content-section" id="contact">
	<div class="container">
		<div class="section-header">
			<div class="section-number">05</div>
			<h2 class="section-headline">Request an Audit</h2>
		</div>

		<div class="contact-content">
			<p class="contact-instruction fade-in" use:inview>
				This is not a sales call. This is a 20-minute diagnostic session to determine if we are a fit. If we cannot
				identify a clear path to save you at least double our fee in the first quarter, we will end the call.
			</p>

			<div class="mailto-container fade-in" use:inview data-delay="200">
				<a class="mailto-link" href="mailto:start.the.conversation@nehmeailabs.com"
					>start.the.conversation@nehmeailabs.com</a
				>
			</div>
		</div>
	</div>
</section>
