// js/stats-loader.js
class StatsDashboard {
    constructor() {
        this.statsFile = '../time/stats.json'; // ✅ CORRIGIDO: data → time
        this.init();
    }

    async init() {
        try {
            await this.loadStats();
            this.startCounterAnimations();
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
            this.setFallbackValues();
        }
    }

    async loadStats() {
        const response = await fetch(this.statsFile);
        if (!response.ok) throw new Error('Arquivo de estatísticas não encontrado');
        
        this.stats = await response.json();
        console.log('Estatísticas carregadas:', this.stats);
    }

    startCounterAnimations() {
        const statsMap = {
            'projectsCount': 'projectsCount',
            'commitsCount': 'commitsCount', 
            'reposCount': 'reposCount',
            'contributionsCount': 'contributionsCount'
        };

        Object.entries(statsMap).forEach(([elementId, statKey]) => {
            if (this.stats[statKey] !== undefined) {
                this.animateCounter(elementId, this.stats[statKey]);
            }
        });
    }

    animateCounter(elementId, targetValue) {
        const element = document.getElementById(elementId);
        if (!element) {
            console.warn(`Elemento ${elementId} não encontrado`);
            return;
        }

        const duration = 2000;
        const step = targetValue / (duration / 16);
        let currentValue = 0;

        const timer = setInterval(() => {
            currentValue += step;
            if (currentValue >= targetValue) {
                currentValue = targetValue;
                clearInterval(timer);
            }
            element.textContent = Math.floor(currentValue).toLocaleString();
        }, 16);
    }

    setFallbackValues() {
        const fallbackStats = {
            'projectsCount': 15,
            'commitsCount': 120,
            'reposCount': 8,
            'contributionsCount': 45
        };

        Object.entries(fallbackStats).forEach(([elementId, value]) => {
            const element = document.getElementById(elementId);
            if (element) {
                element.textContent = value;
            }
        });
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new StatsDashboard();
});
