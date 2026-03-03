"""
Test script to verify subscription plans API
Run with: python manage.py shell < test_plans_api.py
"""

from subscription.models import SubscriptionPlan
from subscription.serializers import SubscriptionPlanSerializer

print("=" * 50)
print("TESTING SUBSCRIPTION PLANS API")
print("=" * 50)

# Check database
plans = SubscriptionPlan.objects.filter(is_active=True)
print(f"\n1. Database Check:")
print(f"   Total active plans in DB: {plans.count()}")

if plans.count() == 0:
    print("   ⚠️  WARNING: No plans found in database!")
    print("   Run: python manage.py shell < add_subscription_plans.py")
else:
    print(f"   ✓ Found {plans.count()} plans")
    for plan in plans:
        print(f"     - {plan.name}: ${plan.price}/month, {plan.swap_limit_per_month} swaps")

# Test serializer
print(f"\n2. Serializer Test:")
serializer = SubscriptionPlanSerializer(plans, many=True)
print(f"   Serialized data: {serializer.data}")

print("\n" + "=" * 50)
print("TEST COMPLETE")
print("=" * 50)
