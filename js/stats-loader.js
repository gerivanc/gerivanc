// js/stats-loader.js
class StatsDashboard {
    constructor() {
        this.statsFile = 'https://raw.githubusercontent.com/gerivanc/gerivanc/main/time/stats.json';
        this.init();
    }

    async init() {
        try {
            await this.loadStats();
        } catch (error) {
            console.log('⚠️ Usando valores padrão para estatísticas');
            this.setFallbackValues();
        }
    }

    async loadStats() {
        try {
            const response = await fetch(this.statsFile);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            this.stats = data;
            this.startCounterAnimations();
            
        } catch (error) {
            throw error;
        }
    }

    startCounterAnimations() {
        if (!this.stats) return;

        const stats = [
            { id: 'projectsCount', value: this.stats.projectsCount || 8 },       // ✅ PERSONALIZADO
            { id: 'commitsCount', value: this.stats.commitsCount || 250 },       // ✅ PERSONALIZADO
            { id: 'reposCount', value: this.stats.reposCount || 12 },            // ✅ PERSONALIZADO
            { id: 'contributionsCount', value: this.stats.contributionsCount || 150 } // ✅ PERSONALIZADO
        ];

        stats.forEach((stat, index) => {
            setTimeout(() => {
                this.animateCounter(stat.id, stat.value);
            }, index * 300);
        });
    }

    animateCounter(elementId, targetValue) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const duration = 1500;
        const startTime = Date.now();
        
        function update() {
            const currentTime = Date.now();
            const progress = Math.min((currentTime - startTime) / duration, 1);
            
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(targetValue * easeOut);
            
            element.textContent = currentValue.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = targetValue.toLocaleString();
            }
        }
        
        requestAnimationFrame(update);
    }

    setFallbackValues() {
        const fallbackStats = [
            { id: 'projectsCount', value: 8 },       // ✅ PERSONALIZADO
            { id: 'commitsCount', value: 250 },      // ✅ PERSONALIZADO
            { id: 'reposCount', value: 12 },         // ✅ PERSONALIZADO
            { id: 'contributionsCount', value: 150 } // ✅ PERSONALIZADO
        ];

        fallbackStats.forEach((stat, index) => {
            setTimeout(() => {
                this.animateCounter(stat.id, stat.value);
            }, index * 300);
        });
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    new StatsDashboard();
});
