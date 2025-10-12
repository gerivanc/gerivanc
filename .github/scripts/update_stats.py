import os
import json
from datetime import datetime, timezone
from github import Github

def get_total_commits(user):
    """Calcula o total de commits de forma mais eficiente"""
    total_commits = 0
    try:
        for repo in user.get_repos():
            if not repo.fork:  # Ignorar forks
                try:
                    # Método simplificado: usar contagem de commits do repo
                    commits = repo.get_commits()
                    total_commits += commits.totalCount
                except:
                    # Fallback para repositórios vazios ou sem acesso
                    continue
    except Exception as e:
        print(f"Erro ao calcular commits: {e}")
        total_commits = user.public_repos * 20  # Estimativa fallback
    
    return min(total_commits, 1000)  # Limite máximo

def get_contributions_estimate(user):
    """Estima contribuições de forma mais realista"""
    try:
        # Estimativa baseada em repositórios e atividade
        base_contributions = user.public_repos * 10
        
        # Adicionar baseado em seguidores e stars
        additional_contributions = user.followers * 2
        
        return base_contributions + additional_contributions
    except Exception as e:
        print(f"Erro ao calcular contribuições: {e}")
        return user.public_repos * 15

def main():
    try:
        # Configurações
        token = os.getenv('GITHUB_TOKEN')
        username = 'gerivanc'
        
        print(f"🔑 Iniciando coleta de estatísticas para {username}...")
        
        # Inicializar GitHub API
        g = Github(token)
        user = g.get_user(username)
        
        print(f"👤 Usuário encontrado: {user.name}")
        print(f"📁 Repositórios públicos: {user.public_repos}")
        print(f"👥 Seguidores: {user.followers}")
        
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
        
        print("📊 Estatísticas coletadas:")
        for key, value in stats.items():
            print(f"   {key}: {value}")
        
        # Garantir que o diretório time existe
        os.makedirs('time', exist_ok=True)
        
        # Salvar estatísticas
        with open('time/stats.json', 'w', encoding='utf-8') as f:
            json.dump(stats, f, indent=2, ensure_ascii=False)
        
        print("✅ Estatísticas salvas com sucesso!")
        
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
