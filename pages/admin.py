from django.contrib import admin
from pages.models import Category, Skill


class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name"]


class SkillAdmin(admin.ModelAdmin):
    list_display = ["name", "category", "icon_type"]
    list_filter = ["category"]
    list_per_page = 15
    search_fields = ["name"]


admin.site.register(Category, CategoryAdmin)
admin.site.register(Skill, SkillAdmin)
