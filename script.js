// ============================================
// Smooth Scroll with Offset
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            const offset = 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// Advanced Intersection Observer
// ============================================
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, delay);
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => {
        observer.observe(el);
    });

    // Stagger dossier items
    const dossierItems = document.querySelectorAll('.dossier-item');
    dossierItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('visible');
        }, index * 100);
    });

    // Stagger question items
    const questionItems = document.querySelectorAll('.question-item');
    questionItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('visible');
        }, index * 150);
    });
});

// ============================================
// Neural Network Visualization (Hero)
// ============================================
class NeuralNetwork {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.nodes = [];
        this.connections = [];
        this.animationFrame = null;
        
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.createNodes();
        this.animate();
    }

    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.dpr = window.devicePixelRatio || 1;
        this.canvas.width = rect.width * this.dpr;
        this.canvas.height = rect.height * this.dpr;
        this.ctx.scale(this.dpr, this.dpr);
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
    }

    createNodes() {
        const nodeCount = 30;
        const width = this.canvas.width / this.dpr;
        const height = this.canvas.height / this.dpr;
        
        this.nodes = [];
        for (let i = 0; i < nodeCount; i++) {
            this.nodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                radius: Math.random() * 2 + 1,
                pulse: Math.random() * Math.PI * 2
            });
        }
    }

    updateNodes() {
        const width = this.canvas.width / this.dpr;
        const height = this.canvas.height / this.dpr;
        
        this.nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;
            
            // Boundary reflection
            if (node.x < 0 || node.x > width) {
                node.vx *= -1;
                node.x = Math.max(0, Math.min(width, node.x));
            }
            if (node.y < 0 || node.y > height) {
                node.vy *= -1;
                node.y = Math.max(0, Math.min(height, node.y));
            }
            
            node.pulse += 0.02;
        });
    }

    drawConnections() {
        const maxDistance = 200;
        this.ctx.strokeStyle = 'rgba(0, 191, 255, 0.15)';
        this.ctx.lineWidth = 0.5;
        
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const node1 = this.nodes[i];
                const node2 = this.nodes[j];
                const dx = node1.x - node2.x;
                const dy = node1.y - node2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    const opacity = 1 - (distance / maxDistance);
                    this.ctx.strokeStyle = `rgba(0, 191, 255, ${opacity * 0.2})`;
                    this.ctx.beginPath();
                    this.ctx.moveTo(node1.x, node1.y);
                    this.ctx.lineTo(node2.x, node2.y);
                    this.ctx.stroke();
                }
            }
        }
    }

    drawNodes() {
        this.nodes.forEach(node => {
            const pulseSize = Math.sin(node.pulse) * 0.5 + 1;
            const radius = node.radius * pulseSize;
            
            // Outer glow
            const gradient = this.ctx.createRadialGradient(
                node.x, node.y, 0,
                node.x, node.y, radius * 3
            );
            gradient.addColorStop(0, 'rgba(0, 191, 255, 0.6)');
            gradient.addColorStop(0.5, 'rgba(0, 191, 255, 0.2)');
            gradient.addColorStop(1, 'rgba(0, 191, 255, 0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, radius * 3, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Node
            this.ctx.fillStyle = 'rgba(0, 191, 255, 0.8)';
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width / this.dpr, this.canvas.height / this.dpr);
        
        this.updateNodes();
        this.drawConnections();
        this.drawNodes();
        
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }
}

// ============================================
// Data Flow Visualization (Indictment)
// ============================================
class DataFlowVisualization {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.animationFrame = null;
        
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.createParticles();
        this.animate();
    }

    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.dpr = window.devicePixelRatio || 1;
        this.canvas.width = rect.width * this.dpr;
        this.canvas.height = rect.height * this.dpr;
        this.ctx.scale(this.dpr, this.dpr);
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
    }

    createParticles() {
        const particleCount = 50;
        const width = this.canvas.width / this.dpr;
        const height = this.canvas.height / this.dpr;
        
        this.particles = [];
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.5 + 0.2,
                trail: []
            });
        }
    }

    updateParticles() {
        const width = this.canvas.width / this.dpr;
        const height = this.canvas.height / this.dpr;
        
        this.particles.forEach(particle => {
            // Store trail
            particle.trail.push({ x: particle.x, y: particle.y });
            if (particle.trail.length > 10) {
                particle.trail.shift();
            }
            
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = width;
            if (particle.x > width) particle.x = 0;
            if (particle.y < 0) particle.y = height;
            if (particle.y > height) particle.y = 0;
        });
    }

    drawParticles() {
        this.particles.forEach(particle => {
            // Draw trail
            particle.trail.forEach((point, index) => {
                const opacity = (index / particle.trail.length) * particle.opacity * 0.3;
                this.ctx.strokeStyle = `rgba(0, 191, 255, ${opacity})`;
                this.ctx.lineWidth = 1;
                if (index > 0) {
                    const prevPoint = particle.trail[index - 1];
                    this.ctx.beginPath();
                    this.ctx.moveTo(prevPoint.x, prevPoint.y);
                    this.ctx.lineTo(point.x, point.y);
                    this.ctx.stroke();
                }
            });
            
            // Draw particle
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size * 2
            );
            gradient.addColorStop(0, `rgba(0, 191, 255, ${particle.opacity})`);
            gradient.addColorStop(1, `rgba(0, 191, 255, 0)`);
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    animate() {
        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width / this.dpr, this.canvas.height / this.dpr);
        
        this.updateParticles();
        this.drawParticles();
        
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }
}


// ============================================
// Scroll Progress Indicator
// ============================================
let scrollProgress = 0;
function updateScrollProgress() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    scrollProgress = scrollTop / (documentHeight - windowHeight);
}

window.addEventListener('scroll', updateScrollProgress);

// ============================================
// Initialize Visualizations
// ============================================
let neuralNetwork, dataFlow;

function initVisualizations() {
    neuralNetwork = new NeuralNetwork('neural-canvas');
    
    // Initialize data flow when indictment section is visible
    const indictmentSection = document.getElementById('indictment');
    if (indictmentSection) {
        const indictmentObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !dataFlow) {
                    dataFlow = new DataFlowVisualization('data-flow-canvas');
                }
            });
        }, { threshold: 0.1 });
        
        indictmentObserver.observe(indictmentSection);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVisualizations);
} else {
    initVisualizations();
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (neuralNetwork) neuralNetwork.destroy();
    if (dataFlow) dataFlow.destroy();
});
