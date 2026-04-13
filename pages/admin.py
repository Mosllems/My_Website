from django.contrib import admin
from pages.models import Category, Skill, Interest


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



admin.site.register(Category, CategoryAdmin)
admin.site.register(Skill, SkillAdmin)
admin.site.register(Interest, InterestAdmin)
