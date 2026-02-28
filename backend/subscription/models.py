from django.db import models
from django.conf import settings
from django.utils import timezone


class SubscriptionPlan(models.Model):
    """
    Subscription plan model defining different tiers of service
    """
    name = models.CharField(max_length=100, unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    swap_limit_per_month = models.IntegerField(
        help_text="Maximum number of battery swaps allowed per month"
    )
    priority_support = models.BooleanField(
        default=False,
        help_text="Whether this plan includes priority customer support"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this plan is currently available for subscription"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Subscription Plan"
        verbose_name_plural = "Subscription Plans"
        ordering = ['price']

    def __str__(self):
        return f"{self.name} - ${self.price}/month"


class UserSubscription(models.Model):
    """
    User subscription model tracking active subscriptions
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='subscriptions'
    )
    plan = models.ForeignKey(
        SubscriptionPlan,
        on_delete=models.PROTECT,
        related_name='user_subscriptions'
    )
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "User Subscription"
        verbose_name_plural = "User Subscriptions"
        ordering = ['-start_date']

    def __str__(self):
        return f"{self.user.email} - {self.plan.name}"

    def is_expired(self):
        """Check if subscription has expired"""
        return timezone.now() > self.end_date

    def save(self, *args, **kwargs):
        """Auto-deactivate if expired"""
        if self.is_expired():
            self.is_active = False
        super().save(*args, **kwargs)
