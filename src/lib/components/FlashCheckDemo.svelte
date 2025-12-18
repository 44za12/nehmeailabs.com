<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { Wllama, LoggerWithoutDebug } from '@wllama/wllama';
	import wasmSingleThreadUrl from '@wllama/wllama/esm/single-thread/wllama.wasm?url';
	import wasmMultiThreadUrl from '@wllama/wllama/esm/multi-thread/wllama.wasm?url';
	import curatedExamples from '$lib/demo/flashcheck_examples.json';

	/**
	 * In-browser demo models.
	 *
	 * Notes:
	 * - These run client-side via Wllama (WASM) loading GGUF from Hugging Face.
	 * - Keep them small/quantized so the demo stays responsive.
	 */
	type DemoModel = {
		id: '270m' | '1b';
		label: string;
		repo: string;
		file: string;
		note: string;
	};

	const DEMO_MODELS: DemoModel[] = [
		{
			id: '270m',
			label: 'FlashCheck‑270M (Instant)',
			repo: 'nehmeailabs-org/nehme-flashcheck-270m',
			file: 'nehme-flashcheck-270m.Q8_0.gguf',
			note: 'Fast, lightweight browser-side verifier.'
		},
		{
			id: '1b',
			label: 'FlashCheck‑1B (High Precision)',
			repo: 'nehmeailabs-org/nehme-flashcheck-1b',
			file: 'nehme-flashcheck-1b.Q8_0.gguf',
			note: 'Higher-precision model; larger download and longer first run.'
		}
	];

	const SYSTEM_MESSAGE =
		`You are a fact checking model developed by NehmeAILabs. Determine whether the provided claim is consistent with the corresponding document. Consistency in this context implies that all information presented in the claim is substantiated by the document. If not, it should be considered inconsistent. Please assess the claim's consistency with the document by responding with either "Yes" or "No".`;

	type Progress = { loaded: number; total: number };
	type Example = { label?: string; document: string; claim: string };

	const fallbackExamples: Example[] = [
		{ label: 'Sky / No', document: 'The sky is green.', claim: 'The sky is blue.' },
		{
			label: 'SLA / No',
			document:
				'SLA: The service guarantees 99.9% uptime per calendar month. P95 latency target is 200ms. Support is available 24/7.',
			claim: 'The SLA guarantees 99.99% uptime per month.'
		}
	];

	const examples: Example[] = (
		(Array.isArray(curatedExamples) ? curatedExamples : []) as Array<{
			label?: string;
			document: string;
			claim: string;
		}>
	)
		.filter((e) => typeof e?.document === 'string' && typeof e?.claim === 'string')
		.map((e) => ({ label: e.label, document: e.document, claim: e.claim }));

	let documentText = '';
	let claimText = '';

	let wllama: Wllama | null = null;
	let modelLoaded = false;
	let isLoading = false;
	let isVerifying = false;
	let status = 'Idle';
	let progress: Progress | null = null;

	let rawOutput = '';
	let verdict: 'Yes' | 'No' | null = null;

	let selectedModelId: DemoModel['id'] = '270m';
	$: selectedModel = DEMO_MODELS.find((m) => m.id === selectedModelId) ?? DEMO_MODELS[0];

	const normalizeVerdict = (text: string): 'Yes' | 'No' | null => {
		const cleaned = text
			.replaceAll('<end_of_turn>', ' ')
			.replaceAll('<eos>', ' ')
			.replaceAll('<bos>', ' ')
			.replaceAll('<pad>', ' ')
			.trim();

		// 1) Strongest: find explicit Yes/No anywhere (common: "Answer: No")
		const yn = cleaned.match(/\b(yes|no)\b/i)?.[1]?.toLowerCase();
		if (yn === 'yes') return 'Yes';
		if (yn === 'no') return 'No';

		// 2) Common NLI/classification labels
		const upper = cleaned.toUpperCase();
		if (upper.includes('ENTAILMENT') || upper.includes('SUPPORTED') || upper.includes('SUPPORTS')) return 'Yes';
		if (upper.includes('CONTRADICTION') || upper.includes('REFUTED') || upper.includes('UNSUPPORTED'))
			return 'No';

		// 3) Fallback: first token heuristic
		const first = cleaned.split(/\s+/)[0] ?? '';
		const token = first.replace(/[^a-zA-Z_]/g, '').toUpperCase();
		if (token === 'YES') return 'Yes';
		if (token === 'NO') return 'No';
		if (token === 'LABEL_1') return 'Yes';
		if (token === 'LABEL_0') return 'No';
		return null;
	};

	const buildPrompt = (doc: string, claim: string) => `Document: ${doc}\n\nClaim: ${claim}`;

	type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

	const loadModel = async () => {
		if (!wllama) return;
		isLoading = true;
		status = 'Loading…';
		progress = { loaded: 0, total: 1 };
		verdict = null;
		rawOutput = '';

		try {
			await wllama.loadModelFromHF(selectedModel.repo, selectedModel.file, {
				progressCallback: ({ loaded, total }: Progress) => {
					progress = { loaded, total };
				}
			});
			modelLoaded = true;
			status = 'Ready';
		} catch (e) {
			modelLoaded = false;
			status = e instanceof Error ? `Load failed: ${e.message}` : 'Load failed';
		} finally {
			isLoading = false;
		}
	};

	const verify = async () => {
		if (!wllama) return;
		if (!modelLoaded) await loadModel();
		if (!modelLoaded) return;

		isVerifying = true;
		status = 'Verifying…';
		verdict = null;
		rawOutput = '';

		try {
			const prompt = buildPrompt(documentText, claimText);
			const messages: ChatMessage[] = [
				{ role: 'system', content: SYSTEM_MESSAGE },
				{ role: 'user', content: prompt }
			];

			// Prefer chat completion so we can set a system message.
			// Fallback to plain completion if the model/chat template doesn't support it.
			let text: string;
			try {
				text = (await wllama.createChatCompletion(messages, {
					nPredict: 8,
					sampling: { temp: 0.0, top_k: 1, top_p: 1.0 }
				})) as string;
			} catch {
				text = (await wllama.createCompletion(`${prompt}\n\nAnswer (Yes/No only):`, {
					nPredict: 8,
					sampling: { temp: 0.0, top_k: 1, top_p: 1.0 }
				})) as string;
			}
			rawOutput = text;
			verdict = normalizeVerdict(text);
			status = verdict ? 'Done' : 'Done (unexpected output)';
		} catch (e) {
			status = e instanceof Error ? `Verify failed: ${e.message}` : 'Verify failed';
		} finally {
			isVerifying = false;
		}
	};

	const loadExample = (ex: Example) => {
		documentText = ex.document;
		claimText = ex.claim;
		verdict = null;
		rawOutput = '';
		status = modelLoaded ? 'Ready' : 'Idle';
	};

	let lastExampleIndex: number | null = null;
	const loadRandomExample = () => {
		const pool = examples.length > 0 ? examples : fallbackExamples;
		if (pool.length === 0) return;
		let idx = Math.floor(Math.random() * pool.length);
		if (lastExampleIndex !== null && pool.length > 1) {
			while (idx === lastExampleIndex) idx = Math.floor(Math.random() * pool.length);
		}
		lastExampleIndex = idx;
		loadExample(pool[idx]);
	};

	onMount(() => {
		if (!browser) return;
		const wasmPaths = {
			'single-thread/wllama.wasm': wasmSingleThreadUrl,
			'multi-thread/wllama.wasm': wasmMultiThreadUrl
		};
		wllama = new Wllama(wasmPaths, { logger: LoggerWithoutDebug });

		// Start with a random example pre-filled.
		loadRandomExample();
	});

	$: progressPct =
		progress && progress.total > 0 ? Math.round((progress.loaded / progress.total) * 100) : null;
	$: canVerify = documentText.trim().length > 0 && claimText.trim().length > 0 && !isLoading && !isVerifying;
</script>

<section class="benchmark-section" id="demo">
	<h2 class="benchmark-title">Try It</h2>
	<p class="benchmark-intro">
		Paste a document and a claim. The verifier responds with <strong>Yes</strong> or <strong>No</strong>.
	</p>
	<p class="demo-note">
		Select a model and verify a claim against a source document.
		<strong>These lightweight models run in your browser</strong> (your text stays on-device).
		For enterprise-grade accuracy (97% policy adherence / 92% RAG), request the <strong>FlashCheck‑4B</strong> API.
	</p>

	<div class="demo-shell">
		<div class="demo-left">
			<div class="demo-field">
				<div class="demo-label">Select Model</div>
				<select
					class="demo-select"
					bind:value={selectedModelId}
					disabled={isLoading || isVerifying}
					on:change={() => {
						// Force reload on next verify when switching models.
						modelLoaded = false;
						status = 'Idle';
						progress = null;
						verdict = null;
						rawOutput = '';
					}}
				>
					{#each DEMO_MODELS as m (m.id)}
						<option value={m.id}>{m.label}</option>
					{/each}
				</select>
				<div class="demo-model-note">{selectedModel.note}</div>
			</div>

			<div class="demo-examples">
				<button class="demo-chip" type="button" on:click={loadRandomExample} disabled={isLoading || isVerifying}>
					Random example
				</button>
			</div>

			<div class="demo-field">
				<div class="demo-label">Document</div>
				<textarea class="demo-textarea" rows="5" bind:value={documentText}></textarea>
			</div>

			<div class="demo-field">
				<div class="demo-label">Claim</div>
				<textarea class="demo-textarea" rows="2" bind:value={claimText}></textarea>
			</div>

			<div class="demo-actions">
				<button class="demo-button" type="button" on:click={verify} disabled={!canVerify}>
					{isLoading ? 'Loading…' : isVerifying ? 'Verifying…' : 'Verify'}
				</button>
				<div class="demo-status">
					{#if progressPct !== null && isLoading}
						<div><strong>Loading:</strong> {progressPct}%</div>
					{:else}
						<div><strong>Status:</strong> {status}</div>
					{/if}
				</div>
			</div>
		</div>

		<div class="demo-right">
			<div class="demo-label">Result</div>
			<div class="demo-verdict" aria-live="polite">
				{#if verdict === 'Yes'}
					<span class="yes">Yes</span>
				{:else if verdict === 'No'}
					<span class="no">No</span>
				{:else}
					<span class="unknown">—</span>
				{/if}
			</div>

			{#if rawOutput && !verdict}
				<p style="color: var(--text-tertiary); margin-top: 1rem">
					The model returned unexpected output.
				</p>
			{/if}
		</div>
	</div>
</section>

<style>
	.demo-shell {
		display: grid;
		grid-template-columns: 1.2fr 0.8fr;
		gap: 1.5rem;
		background: var(--bg-primary);
		border: 1px solid var(--border);
		border-radius: 6px;
		padding: 1.5rem;
	}

	.demo-note {
		max-width: 900px;
		margin: -0.75rem auto 1.25rem;
		color: var(--text-tertiary);
		font-size: 0.95rem;
		line-height: 1.6;
		text-align: center;
	}

	@media (max-width: 900px) {
		.demo-shell {
			grid-template-columns: 1fr;
		}

		.demo-note {
			margin: -0.5rem auto 1rem;
			padding: 0 0.25rem;
		}
	}

	.demo-left,
	.demo-right {
		display: grid;
		gap: 1rem;
	}

	.demo-examples {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.demo-chip {
		padding: 0.45rem 0.75rem;
		border-radius: 999px;
		border: 1px solid var(--border-light);
		background: transparent;
		color: var(--text-secondary);
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s var(--transition);
	}

	.demo-chip:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.demo-chip:not(:disabled):hover {
		border-color: var(--accent);
		color: var(--accent);
	}

	.demo-field {
		display: grid;
		gap: 0.5rem;
	}

	.demo-select {
		width: 100%;
		background: var(--bg-primary);
		border: 1px solid var(--border);
		color: var(--text-primary);
		border-radius: 4px;
		padding: 0.6rem 0.75rem;
		font: inherit;
	}

	.demo-model-note {
		color: var(--text-tertiary);
		font-size: 0.95rem;
		line-height: 1.45;
	}

	.demo-label {
		font-size: 0.875rem;
		letter-spacing: 0.05em;
		color: var(--text-secondary);
		text-transform: uppercase;
	}

	.demo-actions {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.demo-status {
		color: var(--text-secondary);
		font-size: 0.95rem;
	}

	.demo-button {
		padding: 0.75rem 1.1rem;
		border-radius: 4px;
		border: 1px solid var(--accent);
		background: transparent;
		color: var(--accent);
		font-weight: 700;
		cursor: pointer;
		transition: all 0.25s var(--transition);
	}

	.demo-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.demo-button:not(:disabled):hover {
		background: var(--accent);
		color: var(--bg-secondary);
	}

	.demo-textarea {
		width: 100%;
		background: var(--bg-primary);
		border: 1px solid var(--border);
		color: var(--text-primary);
		border-radius: 4px;
		padding: 0.75rem 0.9rem;
		font: inherit;
		line-height: 1.5;
		white-space: pre-wrap;
	}

	.demo-verdict {
		margin-top: 0.25rem;
		font-size: clamp(2.5rem, 6vw, 4rem);
		font-weight: 900;
		letter-spacing: -0.03em;
	}

	.yes {
		color: var(--accent);
	}

	.no {
		color: #ff6b6b;
	}

	.unknown {
		color: var(--text-tertiary);
	}
</style>


