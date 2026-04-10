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
        (None, {"fields": ("age", "phone_number")}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {"fields": ("age", "phone_number")})),
