type Destroyable = { destroy: () => void };

function resizeCanvasToParent(canvas: HTMLCanvasElement) {
	const parent = canvas.parentElement;
	if (!parent) return { width: 0, height: 0, dpr: 1 };

	const rect = parent.getBoundingClientRect();
	const dpr = window.devicePixelRatio || 1;

	// Set backing store size (device pixels)
	canvas.width = Math.max(1, Math.floor(rect.width * dpr));
	canvas.height = Math.max(1, Math.floor(rect.height * dpr));

	// Set CSS size (layout pixels)
	canvas.style.width = `${rect.width}px`;
	canvas.style.height = `${rect.height}px`;

	return { width: rect.width, height: rect.height, dpr };
}

export function createNeuralNetwork(canvas: HTMLCanvasElement): Destroyable {
	const ctx = canvas.getContext('2d');
	if (!ctx) return { destroy: () => {} };

	let animationFrame: number | null = null;
	let dpr = 1;

	type Node = { x: number; y: number; vx: number; vy: number; radius: number; pulse: number };
	let nodes: Node[] = [];

	const createNodes = (width: number, height: number) => {
		const nodeCount = 30;
		nodes = Array.from({ length: nodeCount }, () => ({
			x: Math.random() * width,
			y: Math.random() * height,
			vx: (Math.random() - 0.5) * 0.3,
			vy: (Math.random() - 0.5) * 0.3,
			radius: Math.random() * 2 + 1,
			pulse: Math.random() * Math.PI * 2
		}));
	};

	const resize = () => {
		const { width, height, dpr: nextDpr } = resizeCanvasToParent(canvas);
		dpr = nextDpr;
		// Reset transform so repeated resizes don't accumulate scale
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		createNodes(width, height);
	};

	const updateNodes = (width: number, height: number) => {
		for (const node of nodes) {
			node.x += node.vx;
			node.y += node.vy;

			if (node.x < 0 || node.x > width) {
				node.vx *= -1;
				node.x = Math.max(0, Math.min(width, node.x));
			}
			if (node.y < 0 || node.y > height) {
				node.vy *= -1;
				node.y = Math.max(0, Math.min(height, node.y));
			}

			node.pulse += 0.02;
		}
	};

	const drawConnections = (maxDistance = 200) => {
		ctx.lineWidth = 0.5;
		for (let i = 0; i < nodes.length; i++) {
			for (let j = i + 1; j < nodes.length; j++) {
				const a = nodes[i];
				const b = nodes[j];
				const dx = a.x - b.x;
				const dy = a.y - b.y;
				const distance = Math.sqrt(dx * dx + dy * dy);
				if (distance >= maxDistance) continue;
				const opacity = 1 - distance / maxDistance;
				ctx.strokeStyle = `rgba(0, 191, 255, ${opacity * 0.2})`;
				ctx.beginPath();
				ctx.moveTo(a.x, a.y);
				ctx.lineTo(b.x, b.y);
				ctx.stroke();
			}
		}
	};

	const drawNodes = () => {
		for (const node of nodes) {
			const pulseSize = Math.sin(node.pulse) * 0.5 + 1;
			const radius = node.radius * pulseSize;

			const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius * 3);
			gradient.addColorStop(0, 'rgba(0, 191, 255, 0.6)');
			gradient.addColorStop(0.5, 'rgba(0, 191, 255, 0.2)');
			gradient.addColorStop(1, 'rgba(0, 191, 255, 0)');

			ctx.fillStyle = gradient;
			ctx.beginPath();
			ctx.arc(node.x, node.y, radius * 3, 0, Math.PI * 2);
			ctx.fill();

			ctx.fillStyle = 'rgba(0, 191, 255, 0.8)';
			ctx.beginPath();
			ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
			ctx.fill();
		}
	};

	const animate = () => {
		const width = canvas.width / dpr;
		const height = canvas.height / dpr;
		ctx.clearRect(0, 0, width, height);

		updateNodes(width, height);
		drawConnections();
		drawNodes();

		animationFrame = window.requestAnimationFrame(animate);
	};

	const onResize = () => resize();
	window.addEventListener('resize', onResize);

	resize();
	animate();

	return {
		destroy() {
			window.removeEventListener('resize', onResize);
			if (animationFrame) window.cancelAnimationFrame(animationFrame);
		}
	};
}

export function createDataFlowVisualization(canvas: HTMLCanvasElement): Destroyable {
	const ctx = canvas.getContext('2d');
	if (!ctx) return { destroy: () => {} };

	let animationFrame: number | null = null;
	let dpr = 1;

	type Particle = {
		x: number;
		y: number;
		vx: number;
		vy: number;
		size: number;
		opacity: number;
		trail: Array<{ x: number; y: number }>;
	};

	let particles: Particle[] = [];

	const createParticles = (width: number, height: number) => {
		const particleCount = 50;
		particles = Array.from({ length: particleCount }, () => ({
			x: Math.random() * width,
			y: Math.random() * height,
			vx: (Math.random() - 0.5) * 2,
			vy: (Math.random() - 0.5) * 2,
			size: Math.random() * 3 + 1,
			opacity: Math.random() * 0.5 + 0.2,
			trail: []
		}));
	};

	const resize = () => {
		const { width, height, dpr: nextDpr } = resizeCanvasToParent(canvas);
		dpr = nextDpr;
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		createParticles(width, height);
		// Clear the "fade" buffer on resize
		ctx.clearRect(0, 0, width, height);
	};

	const updateParticles = (width: number, height: number) => {
		for (const p of particles) {
			p.trail.push({ x: p.x, y: p.y });
			if (p.trail.length > 10) p.trail.shift();

			p.x += p.vx;
			p.y += p.vy;

			if (p.x < 0) p.x = width;
			if (p.x > width) p.x = 0;
			if (p.y < 0) p.y = height;
			if (p.y > height) p.y = 0;
		}
	};

	const drawParticles = () => {
		for (const p of particles) {
			for (let i = 1; i < p.trail.length; i++) {
				const prev = p.trail[i - 1];
				const cur = p.trail[i];
				const opacity = (i / p.trail.length) * p.opacity * 0.3;
				ctx.strokeStyle = `rgba(0, 191, 255, ${opacity})`;
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.moveTo(prev.x, prev.y);
				ctx.lineTo(cur.x, cur.y);
				ctx.stroke();
			}

			const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
			gradient.addColorStop(0, `rgba(0, 191, 255, ${p.opacity})`);
			gradient.addColorStop(1, `rgba(0, 191, 255, 0)`);

			ctx.fillStyle = gradient;
			ctx.beginPath();
			ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
			ctx.fill();
		}
	};

	const animate = () => {
		const width = canvas.width / dpr;
		const height = canvas.height / dpr;
		ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
		ctx.fillRect(0, 0, width, height);

		updateParticles(width, height);
		drawParticles();

		animationFrame = window.requestAnimationFrame(animate);
	};

	const onResize = () => resize();
	window.addEventListener('resize', onResize);

	resize();
	animate();

	return {
		destroy() {
			window.removeEventListener('resize', onResize);
			if (animationFrame) window.cancelAnimationFrame(animationFrame);
		}
	};
}


