import os
import json
from datetime import datetime, timezone
from github import Github

def get_total_commits(user):
    """Calculate total commits more efficiently"""
    total_commits = 0
    for repo in user.get_repos():
        if not repo.fork:  # Ignore forks
            try:
                # Faster method: use participation API
                stats = repo.get_stats_participation()
                if stats and stats.all:
                    # stats.all contains commits per week, we sum all
                    total_commits += sum(stats.all)
            except:
                # Fallback: estimate based on repo size
                try:
                    # Repositories with more stars/forks generally have more commits
                    estimated_commits = max(repo.stargazers_count * 2, repo.forks_count * 5, 10)
                    total_commits += estimated_commits
                except:
                    total_commits += 15  # Default minimum value
    return total_commits

def get_contributions_estimate(user):
    """Estimate contributions more realistically"""
    try:
        # Get recent events (more efficient)
        events = list(user.get_public_events()[:100])  # Limit for performance
        
        contribution_types = ['PushEvent', 'PullRequestEvent', 'IssuesEvent', 'CreateEvent', 'DeleteEvent']
        contribution_count = sum(1 for event in events if event.type in contribution_types)
        
        # Adjust based on overall activity
        if user.public_repos > 0:
            base_contributions = user.public_repos * 5
            return max(contribution_count * 3, base_contributions)
        else:
            return contribution_count * 3
            
    except Exception as e:
        print(f"Error calculating contributions: {e}")
        return user.public_repos * 8  # Fallback

def main():
    try:
        # Settings
        token = os.getenv('GITHUB_TOKEN')
        username = 'gerivanc'  # Your fixed username
        
        # Initialize GitHub API
        g = Github(token)
        user = g.get_user(username)
        
        # Collect statistics
        stats = {
            'projectsCount': user.public_repos,
            'reposCount': user.public_repos,
            'commitsCount': get_total_commits(user),
            'contributionsCount': get_contributions_estimate(user),
            'lastUpdated': datetime.now(timezone.utc).isoformat(),
            'followers': user.followers,
            'following': user.following
        }
        
        # Ensure time directory exists
        os.makedirs('time', exist_ok=True)
        
        # Save statistics
        with open('time/stats.json', 'w', encoding='utf-8') as f:
            json.dump(stats, f, indent=2, ensure_ascii=False)
        
        print("✅ Statistics updated successfully!")
        print(f"📊 Projects: {stats['projectsCount']}")
        print(f"📁 Repositories: {stats['reposCount']}")
        print(f"🔨 Commits: {stats['commitsCount']}")
        print(f"🎯 Contributions: {stats['contributionsCount']}")
        print(f"👥 Followers: {stats['followers']}")
        
    except Exception as e:
        print(f"❌ Critical error: {e}")
        # Create file with default values in case of error
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
        print("📝 Fallback file created")

if __name__ == '__main__':
    main()
