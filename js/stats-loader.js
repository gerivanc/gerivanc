// js/stats-loader.js
class StatsDashboard {
    constructor() {
        this.statsFile = 'https://gerivanc.github.io/gerivanc/time/stats.json'; // ✅ URL ABSOLUTA
        this.init();
    }

    async init() {
        try {
            console.log('🚀 Iniciando carregamento de estatísticas...');
            await this.loadStats();
            this.startCounterAnimations();
        } catch (error) {
            console.error('❌ Erro ao carregar estatísticas:', error);
            this.setFallbackValues();
        }
    }

    async loadStats() {
        console.log('📁 Buscando arquivo:', this.statsFile);
        
        // Adicionar timestamp para evitar cache
        const url = this.statsFile + '?t=' + Date.now();
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = await response.text();
        console.log('📄 Resposta bruta:', text);
        
        const data = JSON.parse(text);
        console.log('📊 Dados parseados:', data);
        
        this.stats = data;
    }

    startCounterAnimations() {
        if (!this.stats) {
            console.warn('⚠️ Nenhum dado de estatísticas disponível');
            this.setFallbackValues();
            return;
        }

        console.log('🎯 Iniciando animações com dados:', this.stats);

        const statsMap = {
            'projectsCount': 'projectsCount',
            'commitsCount': 'commitsCount', 
            'reposCount': 'reposCount',
            'contributionsCount': 'contributionsCount'
        };

        Object.entries(statsMap).forEach(([elementId, statKey]) => {
            const value = this.stats[statKey];
            if (value !== undefined && value !== null && !isNaN(value)) {
                console.log(`🎯 Animando ${elementId}: ${value}`);
                this.animateCounter(elementId, value);
            } else {
                console.warn(`⚠️ Valor inválido para ${statKey}:`, value);
                // Usar fallback para este campo específico
                const fallbackValues = {
                    'projectsCount': 15,
                    'commitsCount': 200,
                    'reposCount': 8,
                    'contributionsCount': 120
                };
                this.animateCounter(elementId, fallbackValues[statKey]);
            }
        });
    }

    animateCounter(elementId, targetValue) {
        const element = document.getElementById(elementId);
        if (!element) {
            console.warn(`❌ Elemento ${elementId} não encontrado no DOM`);
            return;
        }

        console.log(`🔢 Iniciando animação para ${elementId}: 0 → ${targetValue}`);
        
        const duration = 2000;
        let startValue = 0;
        let startTime = null;

        function animate(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            
            // Easing function para animação suave
            const currentValue = Math.floor(startValue + (targetValue - startValue) * percentage);
            
            element.textContent = currentValue.toLocaleString();
            
            if (percentage < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = targetValue.toLocaleString();
                console.log(`✅ Animação concluída para ${elementId}: ${targetValue}`);
            }
        }

        requestAnimationFrame(animate);
    }

    setFallbackValues() {
        console.log('🔄 Usando valores de fallback');
        const fallbackStats = {
            'projectsCount': 15,
            'commitsCount': 200,
            'reposCount': 8,
            'contributionsCount': 120
        };

        Object.entries(fallbackStats).forEach(([elementId, value]) => {
            const element = document.getElementById(elementId);
            if (element) {
                this.animateCounter(elementId, value);
            }
        });
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM carregado, iniciando dashboard...');
    new StatsDashboard();
});
