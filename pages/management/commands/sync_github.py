from django.core.management.base import BaseCommand, CommandError

from pages.github_sync import sync_projects


class Command(BaseCommand):
    help = "Sync projects from GitHub repositories"

    def handle(self, *args, **options):
        try:
            result = sync_projects()
        except Exception as error:
            raise CommandError(f"GitHub sync failed: {error}")

        self.stdout.write(self.style.SUCCESS(
            f"Created: {result['created']}, "
            f"Updated: {result['updated']}, "
            f"Hidden: {result['hidden']}"
        ))
