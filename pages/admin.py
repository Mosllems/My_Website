from django.contrib import admin

from pages.models import Category, Skill, Interest, Education, Experience, ContactForm


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


admin.site.register(Category, CategoryAdmin)
admin.site.register(Skill, SkillAdmin)
admin.site.register(Interest, InterestAdmin)
admin.site.register(Education, EducationAdmin)
admin.site.register(Experience, ExperienceAdmin)
admin.site.register(ContactForm, ContactFormAdmin)
