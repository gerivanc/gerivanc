// js/stats-loader.js
class StatsDashboard {
    constructor() {
        // ✅ USAR RAW GITHUB URL - Sem problemas de CORS/MIME
        this.statsFile = 'https://raw.githubusercontent.com/gerivanc/gerivanc/main/time/stats.json';
        this.init();
    }

    async init() {
        try {
            console.log('🚀 Iniciando carregamento de estatísticas...');
            await this.loadStats();
        } catch (error) {
            console.error('❌ Erro ao carregar estatísticas:', error);
            this.setFallbackValues();
        }
    }

    async loadStats() {
        console.log('📁 Buscando arquivo:', this.statsFile);
        
        try {
            const response = await fetch(this.statsFile);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const text = await response.text();
            console.log('📄 Resposta bruta:', text.substring(0, 100));
            
            // Verificar se é JSON válido
            if (!text.trim().startsWith('{')) {
                throw new Error('Resposta não é JSON válido');
            }
            
            const data = JSON.parse(text);
            console.log('✅ JSON parseado com sucesso:', data);
            
            this.stats = data;
            this.startCounterAnimations();
            
        } catch (error) {
            console.error('❌ Erro no carregamento:', error);
            throw error;
        }
    }

    startCounterAnimations() {
        if (!this.stats) {
            console.warn('⚠️ Nenhum dado de estatísticas disponível');
            return;
        }

        console.log('🎯 Iniciando animações com dados:', this.stats);

        // Animar cada estatística com delay progressivo
        const stats = [
            { id: 'projectsCount', value: this.stats.projectsCount || 15 },
            { id: 'commitsCount', value: this.stats.commitsCount || 200 },
            { id: 'reposCount', value: this.stats.reposCount || 15 },
            { id: 'contributionsCount', value: this.stats.contributionsCount || 120 }
        ];

        stats.forEach((stat, index) => {
            setTimeout(() => {
                this.animateCounter(stat.id, stat.value);
            }, index * 300); // Delay progressivo
        });
    }

    animateCounter(elementId, targetValue) {
        const element = document.getElementById(elementId);
        if (!element) {
            console.warn(`❌ Elemento ${elementId} não encontrado`);
            return;
        }

        console.log(`🔢 Animando ${elementId}: 0 → ${targetValue}`);
        
        const duration = 1500;
        const startTime = Date.now();
        
        function update() {
            const currentTime = Date.now();
            const progress = Math.min((currentTime - startTime) / duration, 1);
            
            // Easing function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(targetValue * easeOut);
            
            element.textContent = currentValue.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = targetValue.toLocaleString();
                console.log(`✅ ${elementId} finalizado: ${targetValue}`);
            }
        }
        
        requestAnimationFrame(update);
    }

    setFallbackValues() {
        console.log('🔄 Usando valores de fallback');
        const fallbackStats = [
            { id: 'projectsCount', value: 15 },
            { id: 'commitsCount', value: 200 },
            { id: 'reposCount', value: 8 },
            { id: 'contributionsCount', value: 120 }
        ];

        fallbackStats.forEach((stat, index) => {
            setTimeout(() => {
                this.animateCounter(stat.id, stat.value);
            }, index * 300);
        });
    }
}

// Inicialização robusta
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM carregado, iniciando dashboard...');
    setTimeout(() => {
        new StatsDashboard();
    }, 1000);
});
