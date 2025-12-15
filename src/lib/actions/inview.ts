export type InViewOptions = {
	root?: Element | null;
	rootMargin?: string;
	threshold?: number | number[];
	/**
	 * If set, automatically adds `visible` class when the element intersects.
	 * Defaults to `true`.
	 */
	addVisibleClass?: boolean;
};

export function inview(node: HTMLElement, options: InViewOptions = {}) {
	const {
		root = null,
		rootMargin = '0px 0px -100px 0px',
		threshold = 0.15,
		addVisibleClass = true
	} = options;

	let destroyed = false;
	let timeout: ReturnType<typeof setTimeout> | null = null;

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				const delayMs = Number(node.dataset.delay ?? '0') || 0;
				node.style.setProperty('--delay', `${delayMs}ms`);

				if (timeout) clearTimeout(timeout);
				timeout = setTimeout(() => {
					if (destroyed) return;
					if (addVisibleClass) node.classList.add('visible');
				}, delayMs);

				observer.unobserve(node);
			}
		},
		{ root, rootMargin, threshold }
	);

	observer.observe(node);

	return {
		update(next: InViewOptions) {
			// if options change, re-init (rare for our usage)
			options = next;
		},
		destroy() {
			destroyed = true;
			if (timeout) clearTimeout(timeout);
			observer.disconnect();
		}
	};
}


