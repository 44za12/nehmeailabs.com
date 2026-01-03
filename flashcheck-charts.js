document.addEventListener('DOMContentLoaded', () => {
    createPerformanceChart();
});

function createPerformanceChart() {
    const ctx = document.getElementById('performance-chart');
    if (!ctx) return;

    const data = [
        { model: 'Nehme-AI-FlashCheck-1B', size: 1, average: 81.9, custom: true },
        { model: 'Nehme-AI-FlashCheck-270M', size: 0.27, average: 75.5, custom: true },
        { model: 'Bespoke-Minicheck-7B', size: 7, average: 77.4 },
        { model: 'Granite Guardian 3.3', size: 8, average: 76.5 },
        { model: 'Mistral-Large 2', size: 123, average: 76.5 },
        { model: 'FactCG-DeBERTa-L', size: 0.4, average: 75.6 },
        { model: 'Qwen2.5-72B-Instruct', size: 72, average: 75.6 },
        { model: 'MiniCheck-Flan-T5-L', size: 0.8, average: 75.0 },
        { model: 'Llama-3.3-70B-Instruct', size: 70, average: 74.5 },
        { model: 'Llama-3.1-405B-Instruct', size: 405, average: 74.4 },
        { model: 'QwQ-32B-Preview', size: 32, average: 71.8 },
    ];

    const datasets = [{
        label: 'Other Models',
        data: data.filter(d => !d.custom).map(d => ({ x: d.size, y: d.average })),
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderColor: 'rgba(255, 255, 255, 0.8)',
        pointRadius: 6,
        pointHoverRadius: 9,
    }, {
        label: 'Nehme-AI FlashCheck',
        data: data.filter(d => d.custom).map(d => ({ x: d.size, y: d.average })),
        backgroundColor: '#00BFFF',
        borderColor: '#00BFFF',
        pointRadius: 8,
        pointHoverRadius: 12,
    }];

    new Chart(ctx, {
        type: 'scatter',
        data: { datasets },
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
                        callback: (value) => Number(value.toString()).toLocaleString() + 'B'
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
                    labels: {
                        color: '#FFFFFF',
                        font: { size: 14 },
                        usePointStyle: true,
                    }
                },
                tooltip: {
                    backgroundColor: '#000000',
                    titleColor: '#FFFFFF',
                    bodyColor: '#FFFFFF',
                    callbacks: {
                        label: (context) => {
                            const point = data.find(d => d.average === context.parsed.y && d.size === context.parsed.x);
                            return `${point.model}: ${point.average}% @ ${point.size}B params`;
                        }
                    }
                }
            }
        }
    });
}

function createDominanceChart() {
    const ctx = document.getElementById('dominance-chart');
    if (!ctx) return;

    const data = [
        { model: 'Nehme-AI-FlashCheck-1B', average: 81.9, custom: true },
        { model: 'Bespoke-Minicheck-7B', average: 77.4 },
        { model: 'Granite Guardian 3.3', average: 76.5 },
        { model: 'Mistral-Large 2', average: 76.5 },
        { model: 'FactCG-DeBERTa-L', average: 75.6 },
        { model: 'Qwen2.5-72B-Instruct', average: 75.6 },
        { model: 'Nehme-AI-FlashCheck-270M', average: 75.5, custom: true },
        { model: 'MiniCheck-Flan-T5-L', average: 75.0 },
        { model: 'Llama-3.3-70B-Instruct', average: 74.5 },
        { model: 'Llama-3.1-405B-Instruct', average: 74.4 },
        { model: 'QwQ-32B-Preview', average: 71.8 },
    ].sort((a, b) => a.average - b.average);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(d => d.model),
            datasets: [{
                label: 'Average Accuracy',
                data: data.map(d => d.average),
                backgroundColor: data.map(d => d.custom ? '#00BFFF' : 'rgba(255, 255, 255, 0.5)'),
                borderColor: data.map(d => d.custom ? '#00BFFF' : 'rgba(255, 255, 255, 0.8)'),
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Average Accuracy (%)',
                        color: '#CCCCCC',
                        font: { size: 14 }
                    },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: '#CCCCCC' }
                },
                y: {
                    grid: { display: false },
                    ticks: { color: '#CCCCCC' }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#000000',
                    titleColor: '#FFFFFF',
                    bodyColor: '#FFFFFF',
                }
            }
        }
    });
}