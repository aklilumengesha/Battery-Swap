"""
Script to add sample subscription plans to the database
Run with: python manage.py shell < add_subscription_plans.py
"""

from subscription.models import SubscriptionPlan

# Clear existing plans (optional)
# SubscriptionPlan.objects.all().delete()

# Create Basic Plan
basic_plan, created = SubscriptionPlan.objects.get_or_create(
    name="Basic",
    defaults={
        'price': 9.99,
        'swap_limit_per_month': 10,
        'priority_support': False,
        'is_active': True
    }
)
if created:
    print(f"✓ Created: {basic_plan}")
else:
    print(f"Already exists: {basic_plan}")

# Create Standard Plan
standard_plan, created = SubscriptionPlan.objects.get_or_create(
    name="Standard",
    defaults={
        'price': 19.99,
        'swap_limit_per_month': 30,
        'priority_support': False,
        'is_active': True
    }
)
if created:
    print(f"✓ Created: {standard_plan}")
else:
    print(f"Already exists: {standard_plan}")

# Create Premium Plan
premium_plan, created = SubscriptionPlan.objects.get_or_create(
    name="Premium",
    defaults={
        'price': 39.99,
        'swap_limit_per_month': 100,
        'priority_support': True,
        'is_active': True
    }
)
if created:
    print(f"✓ Created: {premium_plan}")
else:
    print(f"Already exists: {premium_plan}")

# Create Unlimited Plan
unlimited_plan, created = SubscriptionPlan.objects.get_or_create(
    name="Unlimited",
    defaults={
        'price': 99.99,
        'swap_limit_per_month': 999,
        'priority_support': True,
        'is_active': True
    }
)
if created:
    print(f"✓ Created: {unlimited_plan}")
else:
    print(f"Already exists: {unlimited_plan}")

print("\n✅ Subscription plans setup complete!")
print(f"Total active plans: {SubscriptionPlan.objects.filter(is_active=True).count()}")
