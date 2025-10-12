// js/stats-loader.js
class StatsDashboard {
    constructor() {
        this.statsFile = '../time/stats.json';
        this.init();
    }

    async init() {
        try {
            await this.loadStats();
            this.startCounterAnimations();
        } catch (error) {
            console.error('Error loading statistics:', error);
            this.setFallbackValues();
        }
    }

    async loadStats() {
        const response = await fetch(this.statsFile);
        if (!response.ok) throw new Error('Statistics file not found');
        
        this.stats = await response.json();
        console.log('Statistics loaded:', this.stats);
    }

    startCounterAnimations() {
        const statsMap = {
            'projectsCount': 'projectsCount',
            'commitsCount': 'commitsCount', 
            'reposCount': 'reposCount',
            'contributionsCount': 'contributionsCount'
        };

        Object.entries(statsMap).forEach(([elementId, statKey]) => {
            if (this.stats[statKey]) {
                this.animateCounter(elementId, this.stats[statKey]);
            }
        });
    }

    animateCounter(elementId, targetValue) {
        const element = document.getElementById(elementId);
        if (!element) {
            console.warn(`Elemento ${elementId} not found`);
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new StatsDashboard();
});
