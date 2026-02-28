from django.contrib import admin
from subscription.models import SubscriptionPlan, UserSubscription


@admin.register(SubscriptionPlan)
class SubscriptionPlanAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'swap_limit_per_month', 'priority_support', 'is_active']
    list_filter = ['is_active', 'priority_support']
    search_fields = ['name']
    ordering = ['price']


@admin.register(UserSubscription)
class UserSubscriptionAdmin(admin.ModelAdmin):
    list_display = ['user', 'plan', 'start_date', 'end_date', 'is_active', 'is_expired']
    list_filter = ['is_active', 'plan']
    search_fields = ['user__email', 'user__name']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-start_date']

    def is_expired(self, obj):
        return obj.is_expired()
    is_expired.boolean = True
    is_expired.short_description = 'Expired'
