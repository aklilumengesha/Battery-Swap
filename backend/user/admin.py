from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import CustomUser, Order


@admin.register(CustomUser)
class CustomUserAdmin(BaseUserAdmin):
    ordering = ["email"]
    list_display = ["email", "name", "user_type", "is_active", "date_joined"]
    list_filter = ["user_type", "is_active", "is_staff"]
    search_fields = ["email", "name"]

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal info", {"fields": ("name", "phone", "avatar")}),
        ("Role", {"fields": ("user_type",)}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Dates", {"fields": ("date_joined", "last_active")}),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "name", "user_type", "password1", "password2"),
        }),
    )


admin.site.register(Order)
