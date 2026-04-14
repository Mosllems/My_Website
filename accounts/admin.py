from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser
from .forms import CustomUserCreationForm, CustomUserChangeForm


class CustomUserAdmin(UserAdmin):
    model = CustomUser
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    list_display = ("username", "email", "first_name", "last_name", "is_staff", "last_login")
    fieldsets = UserAdmin.fieldsets + (
        ("Info", {"fields": ("age", "phone_number", "address", "website", "github", "linkedin", "bio")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("username", "password1", "password2", "first_name", "last_name", "email", "age", "phone_number", "address", "website", "github", "linkedin", "bio"),
        }),
    )

admin.site.register(CustomUser,CustomUserAdmin)