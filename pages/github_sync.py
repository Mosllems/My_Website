import requests
from django.conf import settings
from django.utils.dateparse import parse_datetime

from pages.models import Project

GITHUB_API_URL = "https://api.github.com"


def fetch_repos():
    headers = {
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    if settings.GITHUB_TOKEN:
        headers["Authorization"] = f"Bearer {settings.GITHUB_TOKEN}"

    url = f"{GITHUB_API_URL}/users/{settings.GITHUB_USERNAME}/repos"
    params = {"per_page": 100, "type": "owner", "page": 1}

    repos = []
    while True:
        response = requests.get(url, headers=headers, params=params, timeout=10)
        response.raise_for_status()
        page = response.json()
        if not page:
            break
        repos.extend(page)
        params["page"] += 1

    return [repo for repo in repos if not repo["fork"]]


def sync_projects():
    repos = fetch_repos()

    created_count = 0
    updated_count = 0
    seen_ids = []

    for repo in repos:
        _, created = Project.objects.update_or_create(
            github_id=repo["id"],
            defaults={
                "name": repo["name"],
                "description": repo["description"] or "",
                "repository_url": repo["html_url"],
                "website_url": repo["homepage"] or "",
                "language": repo["language"] or "",
                "stars": repo["stargazers_count"],
                "tags": repo.get("topics", []),
                "pushed_at": parse_datetime(repo["pushed_at"]) if repo["pushed_at"] else None,
            },
        )
        seen_ids.append(repo["id"])
        if created:
            created_count += 1
        else:
            updated_count += 1

    hidden_count = (
        Project.objects.exclude(github_id__in=seen_ids)
        .filter(is_visible=True)
        .update(is_visible=False)
    )

    return {"created": created_count, "updated": updated_count, "hidden": hidden_count}
