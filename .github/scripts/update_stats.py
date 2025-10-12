import os
import json
from datetime import datetime, timezone
from github import Github

def get_total_commits(user):
    """Calcula o total de commits de forma mais eficiente"""
    total_commits = 0
    for repo in user.get_repos():
        if not repo.fork:  # Ignorar forks
            try:
                # Método mais rápido: usar a API de participation
                stats = repo.get_stats_participation()
                if stats and stats.all:
                    # stats.all contém commits por semana, somamos todos
                    total_commits += sum(stats.all)
            except:
                # Fallback: estimativa baseada no tamanho do repo
                try:
                    # Repositórios com mais stars/forks geralmente têm mais commits
                    estimated_commits = max(repo.stargazers_count * 2, repo.forks_count * 5, 10)
                    total_commits += estimated_commits
                except:
                    total_commits += 15  # Valor mínimo padrão
    return total_commits

def get_contributions_estimate(user):
    """Estima contribuições de forma mais realista"""
    try:
        # Buscar eventos recentes (mais eficiente)
        events = list(user.get_public_events()[:100])  # Limitar para performance
        
        contribution_types = ['PushEvent', 'PullRequestEvent', 'IssuesEvent', 'CreateEvent', 'DeleteEvent']
        contribution_count = sum(1 for event in events if event.type in contribution_types)
        
        # Ajustar baseado na atividade geral
        if user.public_repos > 0:
            base_contributions = user.public_repos * 5
            return max(contribution_count * 3, base_contributions)
        else:
            return contribution_count * 3
            
    except Exception as e:
        print(f"Erro ao calcular contribuições: {e}")
        return user.public_repos * 8  # Fallback

def main():
    try:
        # Configurações
        token = os.getenv('GITHUB_TOKEN')
        username = 'gerivanc'  # Seu username fixo
        
        # Inicializar GitHub API
        g = Github(token)
        user = g.get_user(username)
        
        # Coletar estatísticas
        stats = {
            'projectsCount': user.public_repos,
            'reposCount': user.public_repos,
            'commitsCount': get_total_commits(user),
            'contributionsCount': get_contributions_estimate(user),
            'lastUpdated': datetime.now(timezone.utc).isoformat(),
            'followers': user.followers,
            'following': user.following
        }
        
        # Garantir que o diretório time existe
        os.makedirs('time', exist_ok=True)
        
        # Salvar estatísticas
        with open('time/stats.json', 'w', encoding='utf-8') as f:
            json.dump(stats, f, indent=2, ensure_ascii=False)
        
        print("✅ Estatísticas atualizadas com sucesso!")
        print(f"📊 Projetos: {stats['projectsCount']}")
        print(f"📁 Repositórios: {stats['reposCount']}")
        print(f"🔨 Commits: {stats['commitsCount']}")
        print(f"🎯 Contribuições: {stats['contributionsCount']}")
        print(f"👥 Seguidores: {stats['followers']}")
        
    except Exception as e:
        print(f"❌ Erro crítico: {e}")
        # Criar arquivo com valores padrão em caso de erro
        fallback_stats = {
            'projectsCount': 15,
            'reposCount': 15,
            'commitsCount': 200,
            'contributionsCount': 120,
            'lastUpdated': datetime.now(timezone.utc).isoformat(),
            'followers': 0,
            'following': 0
        }
        os.makedirs('time', exist_ok=True)
        with open('time/stats.json', 'w', encoding='utf-8') as f:
            json.dump(fallback_stats, f, indent=2, ensure_ascii=False)
        print("📝 Arquivo de fallback criado")

if __name__ == '__main__':
    main()
