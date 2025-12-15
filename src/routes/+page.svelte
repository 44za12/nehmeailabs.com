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
	<title>Nehme AI Labs — Ruthlessly efficient AI architecture.</title>
	<meta
		name="description"
		content="Nehme AI Labs delivers fixed-fee architectural audits for on‑prem GenAI stacks—cutting compute cost and hallucination risk with deterministic verification (FlashCheck)."
	/>
	<meta property="og:title" content="Nehme AI Labs" />
	<meta
		property="og:description"
		content="Nehme AI Labs delivers fixed-fee architectural audits for on‑prem GenAI stacks—cutting compute cost and hallucination risk with deterministic verification (FlashCheck)."
	/>
	<meta property="twitter:title" content="Nehme AI Labs" />
	<meta
		property="twitter:description"
		content="Nehme AI Labs delivers fixed-fee architectural audits for on‑prem GenAI stacks—cutting compute cost and hallucination risk with deterministic verification (FlashCheck)."
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
			Your On-Premise GenAI stack is a bonfire of inefficiency. We are the fire department.
		</p>

		<a class="cta-button" href="#contact">
			Request an Audit <span class="cta-arrow">→</span>
		</a>

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
			<h2 class="section-headline">The New State-of-the-Art</h2>
		</div>

		<div class="sota-content">
			<p class="sota-subtext fade-in" use:inview data-delay="0">
				Introducing Nehme-FlashCheck, a new family of fact-verification models that redefine efficiency and
				accuracy.
			</p>

			<p class="fade-in" use:inview data-delay="150" style="max-width: 900px; margin: 0 auto">
				By providing a simple "Yes" or "No" answer to any claim against a document, FlashCheck acts as a powerful
				verification layer, drastically reducing AI hallucinations and building more trustworthy systems.
			</p>

			<div class="sota-grid">
				<div class="sota-item fade-in" use:inview data-delay="0">
					<div class="sota-model-name">FlashCheck‑1B</div>
					<div class="sota-accuracy">81.9%</div>
					<p class="sota-description">
						Outperforms all known models, including IBM's Granite Guardian (76.5%) and Bespoke-Minicheck-7B (77.4%),
						while being 8x smaller.
					</p>
				</div>

				<div class="sota-item fade-in" use:inview data-delay="150">
					<div class="sota-model-name">FlashCheck‑270M</div>
					<div class="sota-accuracy">75.46%</div>
					<p class="sota-description">
						Surpasses models like MiniCheck-Flan-T5-L (75.0%) at a fraction of the size. Efficiency without
						compromise.
					</p>
				</div>
			</div>

			<a class="cta-button fade-in" use:inview data-delay="250" href="/flashcheck">
				Explore the Benchmark <span class="cta-arrow">→</span>
			</a>
		</div>
	</div>
</section>

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
				This is not a sales call. This is a 20-minute diagnostic session to determine if we are a fit. If I cannot
				identify a clear path to save you at least double my audit fee in the first quarter, we will end the call.
			</p>

			<div class="mailto-container fade-in" use:inview data-delay="200">
				<a class="mailto-link" href="mailto:start.the.conversation@nehmeailabs.com"
					>start.the.conversation@nehmeailabs.com</a
				>
			</div>
		</div>
	</div>
</section>
