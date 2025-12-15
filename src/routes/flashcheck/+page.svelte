<script lang="ts">
	import { onMount } from 'svelte';
	import FlashCheckDemo from '$lib/components/FlashCheckDemo.svelte';

	type ModelPoint = { model: string; sizeLabel: string; size: number | null; average: number; custom?: boolean };

	const points: ModelPoint[] = [
		{ model: 'Nehme-FlashCheck-1B', sizeLabel: '1B', size: 1, average: 81.9, custom: true },
		{ model: 'Nehme-FlashCheck-270M', sizeLabel: '270M', size: 0.27, average: 75.5, custom: true },
		{ model: 'Bespoke-Minicheck-7B', sizeLabel: '7B', size: 7, average: 77.4 },
		{ model: 'Claude-3.5 Sonnet', sizeLabel: '-', size: null, average: 77.2 },
		{ model: 'Granite Guardian 3.3', sizeLabel: '8B', size: 8, average: 76.5 },
		{ model: 'Mistral-Large 2', sizeLabel: '123B', size: 123, average: 76.5 },
		{ model: 'gpt-4o-2024-05-13', sizeLabel: '-', size: null, average: 75.9 },
		{ model: 'FactCG-DeBERTa-L', sizeLabel: '0.4B', size: 0.4, average: 75.6 },
		{ model: 'Qwen2.5-72B-Instruct', sizeLabel: '72B', size: 72, average: 75.6 },
		{ model: 'MiniCheck-Flan-T5-L', sizeLabel: '0.8B', size: 0.8, average: 75.0 },
		{ model: 'Llama-3.3-70B-Instruct', sizeLabel: '70B', size: 70, average: 74.5 },
		{ model: 'Llama-3.1-405B-Instruct', sizeLabel: '405B', size: 405, average: 74.4 },
		{ model: 'QwQ-32B-Preview', sizeLabel: '32B', size: 32, average: 71.8 }
	];

	let canvas: HTMLCanvasElement | null = null;

	onMount(() => {
		if (!canvas) return;
		let destroyed = false;
		let chart: { destroy: () => void } | null = null;

		(async () => {
			const ChartModule = await import('chart.js/auto');
			if (destroyed || !canvas) return;

			const Chart = ChartModule.default;
			const otherModels = points.filter((d) => !d.custom && d.size !== null);
			const nehmeModels = points.filter((d) => d.custom);

			const pointLabelPlugin = {
				id: 'pointLabelPlugin',
				afterDatasetsDraw(chartInstance: any) {
					const { ctx } = chartInstance;
					ctx.save();
					ctx.font = '12px Inter, system-ui, -apple-system, Segoe UI, sans-serif';
					ctx.textBaseline = 'middle';

					chartInstance.data.datasets.forEach((dataset: any, datasetIndex: number) => {
						const meta = chartInstance.getDatasetMeta(datasetIndex);
						if (!meta?.data) return;

						meta.data.forEach((element: any, index: number) => {
							const raw = dataset.data?.[index];
							const label = raw?.model ?? raw?.label ?? null;
							if (!label) return;

							const { x, y } = element.tooltipPosition();
							const isCustom = datasetIndex === 1; // our dataset is second
							ctx.fillStyle = isCustom ? '#00BFFF' : 'rgba(255, 255, 255, 0.75)';
							ctx.fillText(String(label), x + 8, y);
						});
					});

					ctx.restore();
				}
			};

			chart = new Chart(canvas, {
				type: 'scatter',
				data: {
					datasets: [
						{
							label: 'Other Models',
							data: otherModels.map((d) => ({ x: d.size as number, y: d.average, model: d.model })),
							backgroundColor: 'rgba(255, 255, 255, 0.5)',
							borderColor: 'rgba(255, 255, 255, 0.8)',
							pointRadius: 6,
							pointHoverRadius: 9
						},
						{
							label: 'Nehme-FlashCheck',
							data: nehmeModels.map((d) => ({ x: d.size, y: d.average, model: d.model })),
							backgroundColor: '#00BFFF',
							borderColor: '#00BFFF',
							pointRadius: 8,
							pointHoverRadius: 12
						}
					]
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					scales: {
						x: {
							type: 'logarithmic',
							title: {
								display: true,
								text: 'Model Size (Billions of Parameters)',
								color: '#CCCCCC',
								font: { size: 14 }
							},
							grid: { color: 'rgba(255, 255, 255, 0.1)' },
							ticks: {
								color: '#CCCCCC',
								callback: (value) => `${Number(value.toString()).toLocaleString()}B`
							}
						},
						y: {
							title: {
								display: true,
								text: 'Average Accuracy (%)',
								color: '#CCCCCC',
								font: { size: 14 }
							},
							grid: { color: 'rgba(255, 255, 255, 0.1)' },
							ticks: { color: '#CCCCCC' }
						}
					},
					plugins: {
						legend: {
							position: 'bottom',
							labels: { color: '#FFFFFF', font: { size: 14 }, usePointStyle: true }
						},
						tooltip: {
							backgroundColor: '#000000',
							titleColor: '#FFFFFF',
							bodyColor: '#FFFFFF',
							callbacks: {
								label: (context) => {
									const raw = context.raw as { x: number; y: number; model?: string };
									const x = Number(raw?.x ?? context.parsed.x);
									const y = Number(raw?.y ?? context.parsed.y);
									const model = raw?.model;
									return model ? `${model}: ${y}% @ ${x}B params` : `${y}% @ ${x}B`;
								}
							}
						}
					}
				},
				plugins: [pointLabelPlugin]
			});
		})().catch(() => {
			// Ignore chart init errors; page still renders benchmark table/leaderboard
		});

		return () => {
			destroyed = true;
			chart?.destroy();
		};
	});

	type BenchmarkRow = {
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

	const fullBenchmark: BenchmarkRow[] = [
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
			model: 'Claude-3.5 Sonnet',
			size: '-',
			average: 77.2,
			CNN: 67.6,
			XSum: 75.1,
			MediaS: 73.4,
			MeetB: 84.6,
			WICE: 77.7,
			REVEAL: 89.1,
			ClaimV: 71.4,
			FactCk: 77.8,
			ExpertQA: 60.9,
			LFQA: 85.6,
			'RAG Truth': 86.1
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
			model: 'gpt-4o-2024-05-13',
			size: '-',
			average: 75.9,
			CNN: 68.1,
			XSum: 76.8,
			MediaS: 71.4,
			MeetB: 79.8,
			WICE: 78.5,
			REVEAL: 86.5,
			ClaimV: 69.0,
			FactCk: 77.5,
			ExpertQA: 59.6,
			LFQA: 83.6,
			'RAG Truth': 84.3
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
</script>

<svelte:head>
	<title>FlashCheck | Nehme AI Labs</title>
	<meta
		name="description"
		content="Nehme AI Labs delivers fixed-fee architectural audits for on‑prem GenAI stacks—cutting compute cost and hallucination risk with deterministic verification (FlashCheck)."
	/>
	<meta property="og:title" content="FlashCheck | Nehme AI Labs" />
	<meta
		property="og:description"
		content="Nehme AI Labs delivers fixed-fee architectural audits for on‑prem GenAI stacks—cutting compute cost and hallucination risk with deterministic verification (FlashCheck)."
	/>
	<meta property="twitter:title" content="FlashCheck | Nehme AI Labs" />
	<meta
		property="twitter:description"
		content="Nehme AI Labs delivers fixed-fee architectural audits for on‑prem GenAI stacks—cutting compute cost and hallucination risk with deterministic verification (FlashCheck)."
	/>
	<link rel="stylesheet" href="/flashcheck.css" />
</svelte:head>

<main class="flashcheck-main">
	<div class="container">
		<header class="flashcheck-header">
			<h1 class="flashcheck-title">FlashCheck</h1>
			<p class="flashcheck-subtitle">
				The Anti-Hallucination Engine. Small, fast, and brutally accurate models that take a document and a claim, and
				respond only with "Yes" or "No".
			</p>
		</header>

		<section class="benchmark-section" id="anti-hallucination">
			<div class="section-header">
				<div class="section-number">01</div>
				<h2 class="section-headline">The Anti-Hallucination Engine</h2>
			</div>

			<div class="section-content">
				<p class="large-text">
					Hallucinations in Large Language Models are not a bug; they are a feature of probabilistic generation. The
					solution is not to build ever-larger models, but to enforce rigor through external verification. FlashCheck
					is designed for this purpose.
				</p>

				<div class="solution-grid center-last">
					<div class="solution-item">
						<div class="solution-icon">01</div>
						<h3 class="solution-headline">Generate, then Verify</h3>
						<p class="solution-text">
							Integrate FlashCheck as the final step in your RAG (Retrieval-Augmented Generation) pipeline. After
							your primary LLM generates a response, FlashCheck verifies each generated claim against the source
							documents. If a claim returns "No", it's a hallucination. It's that simple.
						</p>
					</div>

					<div class="solution-item">
						<div class="solution-icon">02</div>
						<h3 class="solution-headline">Lightweight &amp; Fast</h3>
						<p class="solution-text">
							Because FlashCheck models are small and specialized, they add minimal latency to your pipeline. You
							get the benefit of factual accuracy without a significant performance penalty, making it practical for
							real-time applications.
						</p>
					</div>

					<div class="solution-item">
						<div class="solution-icon">03</div>
						<h3 class="solution-headline">Deterministic Trust</h3>
						<p class="solution-text">
							The "Yes" or "No" output provides a deterministic, binary signal of trustworthiness. This allows you
							to programmatically filter, flag, or correct generated content, moving from a system of probabilistic
							trust to one of architectural certainty.
						</p>
					</div>
				</div>

				<p style="color: var(--text-secondary); margin-top: 3rem">
					FlashCheck models are available for audit and deployment. If you are ready to replace your inefficient
					fact-verification pipeline with a surgical, cost-effective solution, we should talk.
				</p>
			</div>
		</section>

		<FlashCheckDemo />

		<section class="benchmark-section" id="benchmark">
			<h2 class="benchmark-title">Performance &amp; Efficiency</h2>
			<p class="benchmark-intro">
				FlashCheck models don't just lead in accuracy; they redefine efficiency. The chart below plots model size
				against average accuracy, demonstrating that our models deliver state-of-the-art performance in a fraction of
				the size.
			</p>

			<div class="chart-container">
				<canvas id="performance-chart" bind:this={canvas}></canvas>
			</div>
		</section>

		<section class="benchmark-section" id="dominance">
			<h2 class="benchmark-title">Dominance: A Clear Leader</h2>
			<p class="benchmark-intro">
				When ranked by pure accuracy, the Nehme-FlashCheck-1B model establishes a new standard for performance,
				decisively outperforming all other models in the benchmark.
			</p>

			<div class="leaderboard-container" aria-label="Dominance leaderboard">
				{#each points
					.filter((p) =>
						[
							'Nehme-FlashCheck-1B',
							'Bespoke-Minicheck-7B',
							'Claude-3.5 Sonnet',
							'Granite Guardian 3.3',
							'Mistral-Large 2',
							'gpt-4o-2024-05-13',
							'FactCG-DeBERTa-L',
							'Qwen2.5-72B-Instruct',
							'Nehme-FlashCheck-270M',
							'MiniCheck-Flan-T5-L'
						].includes(p.model)
					)
					.sort((a, b) => b.average - a.average)
					.map((p, i) => ({ ...p, rank: i + 1 })) as item (item.model)}
					<div
						class={`leaderboard-item rank-${item.rank}${item.custom ? ' rank-nehme' : ''}`}
						aria-label={`Rank ${item.rank}: ${item.model}`}
					>
						<div class="leaderboard-rank">{item.rank}</div>
						<div class="leaderboard-model">
							{item.model}
							{#if item.custom}
								<span class="leaderboard-tag">Our Model</span>
							{/if}
						</div>
						<div class="leaderboard-score">{item.average}%</div>
					</div>
				{/each}
			</div>
		</section>

		<section class="benchmark-section" id="full-benchmark">
			<h2 class="benchmark-title">Full Benchmark Data</h2>
			<p class="benchmark-intro">The comprehensive results across all 11 datasets are detailed below.</p>

			<div class="sota-table-wrapper">
				<table class="sota-table">
					<thead>
						<tr>
							<th>Model</th>
							<th>Size</th>
							<th>Average</th>
							<th>CNN</th>
							<th>XSum</th>
							<th>MediaS</th>
							<th>MeetB</th>
							<th>WICE</th>
							<th>REVEAL</th>
							<th>ClaimV</th>
							<th>FactCk</th>
							<th>ExpertQA</th>
							<th>LFQA</th>
							<th>RAG Truth</th>
						</tr>
					</thead>
					<tbody>
						{#each fullBenchmark as row (row.model)}
							<tr class={row.model.startsWith('Nehme-FlashCheck') ? 'nehme-model highlight' : ''}>
								<td>{row.model}</td>
								<td>{row.size}</td>
								<td>{row.average}</td>
								<td>{row.CNN}</td>
								<td>{row.XSum}</td>
								<td>{row.MediaS}</td>
								<td>{row.MeetB}</td>
								<td>{row.WICE}</td>
								<td>{row.REVEAL}</td>
								<td>{row.ClaimV}</td>
								<td>{row.FactCk}</td>
								<td>{row.ExpertQA}</td>
								<td>{row.LFQA}</td>
								<td>{row['RAG Truth']}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</section>

		<section class="contact-section" id="request-an-audit">
			<p>FlashCheck models are available for audit and deployment. If you are ready to upgrade your verification pipeline, we should talk.</p>
			<a class="cta-button" href="/#contact">Request an Audit <span class="cta-arrow">→</span></a>
		</section>
	</div>
</main>


