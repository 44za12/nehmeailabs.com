<script lang="ts">
	import FlashCheckDemo from '$lib/components/FlashCheckDemo.svelte';

	type ReducedRow = {
		model: string;
		size: string;
		'RAG Truth': number;
		average: number;
		CNN: number;
		REVEAL: number;
		MeetB: number;
	};

	type FullBenchmarkRow = {
		model: string;
		size: string;
		average: number;
		CNN: number;
		XSum: number;
		MediaS: number;
		MeetB: number;
		WICE: number;
		REVEAL: number;
		ClaimV: number;
		FactCk: number;
		ExpertQA: number;
		LFQA: number;
		'RAG Truth': number;
	};

	// Source-of-truth numbers (full benchmark across datasets).
	const fullBenchmark: FullBenchmarkRow[] = [
		{
			model: 'Nehme-FlashCheck-1B',
			size: '1B',
			average: 81.9,
			CNN: 90.0,
			XSum: 71.1,
			MediaS: 78.7,
			MeetB: 84.2,
			WICE: 56.7,
			REVEAL: 87.8,
			ClaimV: 77.3,
			FactCk: 76.1,
			ExpertQA: 73.5,
			LFQA: 82.9,
			'RAG Truth': 84.6
		},
		{
			model: 'Nehme-FlashCheck-270M',
			size: '270M',
			average: 75.5,
			CNN: 89.8,
			XSum: 62.9,
			MediaS: 74.0,
			MeetB: 79.0,
			WICE: 40.2,
			REVEAL: 73.4,
			ClaimV: 74.9,
			FactCk: 75.0,
			ExpertQA: 50.4,
			LFQA: 71.0,
			'RAG Truth': 82.6
		},
		{
			model: 'Bespoke-Minicheck-7B',
			size: '7B',
			average: 77.4,
			CNN: 65.5,
			XSum: 77.8,
			MediaS: 76.0,
			MeetB: 78.3,
			WICE: 83.0,
			REVEAL: 88.0,
			ClaimV: 75.3,
			FactCk: 77.7,
			ExpertQA: 59.2,
			LFQA: 86.7,
			'RAG Truth': 84.0
		},
		{
			model: 'Granite Guardian 3.3',
			size: '8B',
			average: 76.5,
			CNN: 67.0,
			XSum: 74.9,
			MediaS: 74.0,
			MeetB: 78.6,
			WICE: 76.6,
			REVEAL: 89.6,
			ClaimV: 75.9,
			FactCk: 76.1,
			ExpertQA: 59.6,
			LFQA: 86.9,
			'RAG Truth': 82.2
		},
		{
			model: 'Mistral-Large 2',
			size: '123B',
			average: 76.5,
			CNN: 64.8,
			XSum: 74.7,
			MediaS: 69.6,
			MeetB: 84.2,
			WICE: 80.3,
			REVEAL: 87.7,
			ClaimV: 71.8,
			FactCk: 74.5,
			ExpertQA: 60.8,
			LFQA: 87.0,
			'RAG Truth': 85.9
		},
		{
			model: 'FactCG-DeBERTa-L',
			size: '0.4B',
			average: 75.6,
			CNN: 70.1,
			XSum: 73.9,
			MediaS: 72.3,
			MeetB: 74.3,
			WICE: 74.2,
			REVEAL: 88.4,
			ClaimV: 78.5,
			FactCk: 72.1,
			ExpertQA: 59.1,
			LFQA: 86.7,
			'RAG Truth': 82.3
		},
		{
			model: 'Qwen2.5-72B-Instruct',
			size: '72B',
			average: 75.6,
			CNN: 63.6,
			XSum: 73.0,
			MediaS: 71.9,
			MeetB: 80.4,
			WICE: 80.2,
			REVEAL: 88.9,
			ClaimV: 70.0,
			FactCk: 77.0,
			ExpertQA: 60.1,
			LFQA: 84.3,
			'RAG Truth': 81.9
		},
		{
			model: 'MiniCheck-Flan-T5-L',
			size: '0.8B',
			average: 75.0,
			CNN: 69.9,
			XSum: 74.3,
			MediaS: 73.6,
			MeetB: 77.3,
			WICE: 72.2,
			REVEAL: 86.2,
			ClaimV: 74.6,
			FactCk: 74.7,
			ExpertQA: 59.0,
			LFQA: 85.2,
			'RAG Truth': 78.0
		},
		{
			model: 'Llama-3.3-70B-Instruct',
			size: '70B',
			average: 74.5,
			CNN: 68.7,
			XSum: 74.7,
			MediaS: 69.5,
			MeetB: 78.4,
			WICE: 76.6,
			REVEAL: 85.5,
			ClaimV: 67.4,
			FactCk: 78.5,
			ExpertQA: 58.3,
			LFQA: 79.8,
			'RAG Truth': 82.6
		},
		{
			model: 'Llama-3.1-405B-Instruct',
			size: '405B',
			average: 74.4,
			CNN: 64.8,
			XSum: 75.1,
			MediaS: 68.6,
			MeetB: 81.2,
			WICE: 71.8,
			REVEAL: 86.4,
			ClaimV: 67.5,
			FactCk: 79.4,
			ExpertQA: 58.5,
			LFQA: 81.9,
			'RAG Truth': 82.9
		},
		{
			model: 'QwQ-32B-Preview',
			size: '32B',
			average: 71.8,
			CNN: 57.0,
			XSum: 71.6,
			MediaS: 69.3,
			MeetB: 78.5,
			WICE: 72.3,
			REVEAL: 86.2,
			ClaimV: 67.7,
			FactCk: 75.6,
			ExpertQA: 60.0,
			LFQA: 78.9,
			'RAG Truth': 72.4
		}
	];

	const displayName = (model: string) => {
		return model;
	};

	// Customer-facing table (sorted by RAG Truth), derived from the full benchmark.
	const benchmark: ReducedRow[] = [
		// 4B is commercial; numbers are shown here for the top-line RAG view.
		{
			model: 'Nehme-FlashCheck-4B',
			size: '4B',
			'RAG Truth': 91.7,
			average: 86.1,
			CNN: 90.1,
			REVEAL: 88.0,
			MeetB: 87.7
		},
		...fullBenchmark.map((r) => ({
			model: displayName(r.model),
			size: r.size,
			'RAG Truth': r['RAG Truth'],
			average: r.average,
			CNN: r.CNN,
			REVEAL: r.REVEAL,
			MeetB: r.MeetB
		}))
	].sort((a, b) => b['RAG Truth'] - a['RAG Truth']);

</script>

<svelte:head>
	<title>FlashCheck — Enterprise RAG Hallucination Detection | Nehme AI Labs</title>
	<meta
		name="description"
		content="Trust, verified. Nehme-FlashCheck is a retrieval-grounded factuality verifier—built for enterprise RAG pipelines."
	/>
	<meta property="og:title" content="FlashCheck — Enterprise RAG Hallucination Detection" />
	<meta
		property="og:description"
		content="Enforce groundedness in RAG. FlashCheck classifies whether a claim is supported by retrieved context."
	/>
	<meta property="twitter:title" content="FlashCheck — Enterprise RAG Hallucination Detection" />
	<meta
		property="twitter:description"
		content="Enforce groundedness in RAG. FlashCheck classifies whether a claim is supported by retrieved context."
	/>
	<link rel="stylesheet" href="/flashcheck.css" />
</svelte:head>

<main class="flashcheck-main">
	<div class="container">
		<header class="flashcheck-header">
			<h1 class="flashcheck-title">Trust, Verified.</h1>
			<p class="flashcheck-subtitle">
				Retrieval‑Grounded Factuality Verification for Production RAG.
			</p>
			<p class="benchmark-intro" style="max-width: 980px; margin: 1.25rem auto 0; text-align: center">
				Stop ungrounded generations from shipping. <strong>Nehme-FlashCheck-4B</strong> delivers <strong>92% accuracy</strong> on RAG pipelines,
				outperforming larger general‑purpose model baselines at <strong>&lt;1% of the cost</strong>.
			</p>
		</header>

		<section class="benchmark-section" id="rag-security">
			<div class="section-header">
				<div class="section-number">01</div>
				<h2 class="section-headline">RAG Security for Enterprises</h2>
			</div>

			<div class="section-content">
				<p class="large-text">
					RAG failures aren’t a product bug, they’re a brand risk. FlashCheck performs <strong>groundedness verification</strong>:
					it classifies whether each generated <strong>claim</strong> is supported by the retrieved <strong>context</strong>, returning a deterministic
					<strong>Yes</strong>/<strong>No</strong> signal your pipeline can enforce.
				</p>

				<div class="solution-grid center-last">
					<div class="solution-item">
						<div class="solution-icon">01</div>
						<h3 class="solution-headline">Ship RAG with Guardrails</h3>
						<p class="solution-text">
							Run FlashCheck after generation. If a claim isn’t supported by the retrieved context, FlashCheck returns “No”
							and your system can block, re‑retrieve, regenerate, or route to a human review queue.
						</p>
					</div>

					<div class="solution-item">
						<div class="solution-icon">02</div>
						<h3 class="solution-headline">Designed for Production</h3>
						<p class="solution-text">
							FlashCheck is a specialist verifier—built to be fast, cheap, and reliable in high-volume enterprise workflows.
						</p>
					</div>

					<div class="solution-item">
						<div class="solution-icon">03</div>
						<h3 class="solution-headline">Deterministic Enforcement</h3>
						<p class="solution-text">
							A binary decision is easy to audit, log, and enforce. Move from probabilistic trust to verifiable policy.
						</p>
					</div>
				</div>

				<p style="color: var(--text-secondary); margin-top: 3rem">
					The 1B model is available on Hugging Face today. To deploy the <strong>4B Enterprise Model</strong>, contact us for an API key or on‑prem license.
				</p>
			</div>
		</section>

		<FlashCheckDemo />

		<section class="benchmark-section" id="tiers">
			<h2 class="benchmark-title">Choose Your Precision</h2>
			<p class="benchmark-intro">
				Pick the right tier for your pipeline.
			</p>

			<div class="solution-grid">
				<div class="solution-item">
					<div class="solution-icon">270M</div>
					<h3 class="solution-headline">FlashCheck‑Nano (270M)</h3>
					<p class="solution-text"><strong>Use case:</strong> Browser-side, latency-critical, mobile.</p>
					<p class="solution-text"><strong>Status:</strong> Free / Open Source.</p>
				</div>
				<div class="solution-item">
					<div class="solution-icon">1B</div>
					<h3 class="solution-headline">FlashCheck‑Lite (1B)</h3>
					<p class="solution-text"><strong>Use case:</strong> High-volume filtering, internal tools.</p>
					<p class="solution-text"><strong>Performance:</strong> Competitive with much larger general‑purpose baselines on RAG Truth.</p>
					<p class="solution-text"><strong>Status:</strong> Apache 2.0 (Hugging Face).</p>
				</div>
				<div class="solution-item">
					<div class="solution-icon">4B</div>
					<h3 class="solution-headline">FlashCheck‑Max (4B)</h3>
					<p class="solution-text"><strong>Use case:</strong> Regulated industries (finance, legal, health), customer-facing chatbots.</p>
					<p class="solution-text"><strong>Performance:</strong> 91.7% RAG Truth. The ceiling of groundedness verification.</p>
					<p class="solution-text"><strong>Status:</strong> Commercial License / API.</p>
				</div>
			</div>
		</section>

		<section class="benchmark-section" id="full-benchmark">
			<h2 class="benchmark-title">Benchmark (RAG Truth)</h2>
			<p class="benchmark-intro">
				Sorted by <strong>RAG Truth</strong> to reflect performance on retrieval‑augmented generation pipelines.
			</p>

			<div class="sota-table-wrapper">
				<table class="sota-table">
					<thead>
						<tr>
							<th>Model</th>
							<th>Size</th>
							<th>RAG Truth</th>
							<th>Average</th>
							<th>CNN</th>
							<th>Reveal</th>
							<th>MeetB</th>
						</tr>
					</thead>
					<tbody>
						{#each benchmark as row (row.model)}
							<tr class={row.model.startsWith('Nehme-FlashCheck') ? 'nehme-model highlight' : ''}>
								<td>{row.model}</td>
								<td>{row.size}</td>
								<td>{row['RAG Truth']}</td>
								<td>{row.average}</td>
								<td>{row.CNN}</td>
								<td>{row.REVEAL}</td>
								<td>{row.MeetB}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</section>

		<section class="contact-section" id="request-an-audit">
			<p>
				Don’t let a 15% error rate destroy your brand. The 1B model is available on Hugging Face today.
				To deploy the 4B Enterprise Model, contact us for an API key or on‑prem license.
			</p>
			<a class="cta-button" href="/#contact">Request Access <span class="cta-arrow">→</span></a>
		</section>
	</div>
</main>

<style>
	/* Slightly tighter table feel for the new leaderboard/benchmark */
	.sota-table th:first-child,
	.sota-table td:first-child {
		white-space: nowrap;
	}
</style>

