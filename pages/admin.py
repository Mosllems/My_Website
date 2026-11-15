from django.contrib import admin, messages
from django.core.exceptions import PermissionDenied
from django.shortcuts import redirect
from django.urls import path, reverse
from django.utils.html import format_html

from pages.github_sync import sync_projects
from pages.models import Category, Skill, Interest, Education, Experience, ContactForm, Project, ProjectImage


class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "updated_at"]


class SkillAdmin(admin.ModelAdmin):
    list_display = ["name", "category", "icon_type", "updated_at"]
    list_filter = ["category"]
    list_per_page = 15
    search_fields = ["name"]


class InterestAdmin(admin.ModelAdmin):
    list_display = ["name", "updated_at"]
    list_per_page = 15
    search_fields = ["name"]


class EducationAdmin(admin.ModelAdmin):
    list_display = ["major", "degree", "gpa", "institution", "start_date", "end_date"]
    list_filter = ["major", "degree", "institution", "gpa"]
    list_per_page = 15
    search_fields = ["major", "degree", "institution"]


class ExperienceAdmin(admin.ModelAdmin):
    list_display = ["position", "company", "location"]
    list_filter = ["position", "company"]
    list_per_page = 15
    search_fields = ["position", "company"]


class ContactFormAdmin(admin.ModelAdmin):
    list_display = ["name", "email", "subject", "created_at"]
    list_filter = ["name", "email",]
    list_per_page = 15
    search_fields = ["name", "email"]

class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 1
    fields = ["image", "preview", "order"]
    readonly_fields = ["preview"]

    @admin.display(description="Preview")
    def preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="height:80px;border-radius:4px;">', obj.image.url)
        return "-"


class ProjectAdmin(admin.ModelAdmin):
    list_display = ["name", "language", "stars", "is_visible", "is_featured", "order", "pushed_at"]
    list_editable = ["is_visible", "is_featured", "order"]
    list_filter = ["is_visible", "is_featured", "language"]
    list_per_page = 10
    search_fields = ["name", "description", "language"]
    inlines = [ProjectImageInline]
    change_list_template = "admin/pages/project/change_list.html"

    GITHUB_FIELDS = [
        "github_id", "name", "description", "repository_url",
        "website_url", "language", "stars", "tags", "pushed_at",
    ]

    fieldsets = [
        ("Display settings", {"fields": ["is_visible", "is_featured", "order"]}),
        ("GitHub data (synced)", {"fields": GITHUB_FIELDS}),
    ]

    def get_readonly_fields(self, request, obj=None):
        if obj:
            return self.GITHUB_FIELDS
        return []

    def get_urls(self):
        custom_urls = [
            path(
                "sync-github/",
                self.admin_site.admin_view(self.sync_github_view),
                name="pages_project_sync_github",
            ),
        ]
        # Custom URLs must come first, or the default "<path:object_id>/" pattern swallows them.
        return custom_urls + super().get_urls()

    def sync_github_view(self, request):
        changelist_url = reverse("admin:pages_project_changelist")

        # Sync writes to the DB, so only run it from the POST form, never from a plain GET.
        if request.method != "POST":
            return redirect(changelist_url)

        if not self.has_change_permission(request):
            raise PermissionDenied

        try:
            result = sync_projects()
        except Exception as error:
            self.message_user(request, f"GitHub sync failed: {error}", messages.ERROR)
        else:
            self.message_user(
                request,
                f"Sync complete — Created: {result['created']}, "
                f"Updated: {result['updated']}, Hidden: {result['hidden']}",
                messages.SUCCESS,
            )

        return redirect(changelist_url)



admin.site.register(Category, CategoryAdmin)
admin.site.register(Skill, SkillAdmin)
admin.site.register(Interest, InterestAdmin)
admin.site.register(Education, EducationAdmin)
admin.site.register(Experience, ExperienceAdmin)
admin.site.register(ContactForm, ContactFormAdmin)
admin.site.register(Project, ProjectAdmin)

