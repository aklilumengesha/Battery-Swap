# Subscription System

A complete subscription management system for the Battery Swap platform.

## Features

- Multiple subscription tiers with different swap limits
- Priority support for premium plans
- Automatic expiration handling
- Duration-based subscriptions (1-12 months)
- REST API endpoints for plan management
- Admin interface for plan configuration

## Models

### SubscriptionPlan
Defines available subscription tiers.

**Fields:**
- `name`: Plan name (unique)
- `price`: Monthly price
- `swap_limit_per_month`: Maximum swaps allowed
- `priority_support`: Whether plan includes priority support
- `is_active`: Whether plan is available for subscription

### UserSubscription
Tracks user subscriptions.

**Fields:**
- `user`: Foreign key to User model
- `plan`: Foreign key to SubscriptionPlan
- `start_date`: Subscription start date
- `end_date`: Subscription end date
- `is_active`: Whether subscription is currently active

**Methods:**
- `is_expired()`: Check if subscription has expired

## API Endpoints

### List Plans
```
GET /api/plans/
```
Returns all active subscription plans. Public endpoint.

### Subscribe
```
POST /api/subscribe/
Authorization: Bearer <token>

Body:
{
  "plan_id": 1,
  "duration_months": 1
}
```
Creates a new subscription for the authenticated user.

### My Subscription
```
GET /api/my-subscription/
Authorization: Bearer <token>
```
Returns the user's active subscription.

## Setup

1. Add 'subscription' to INSTALLED_APPS in settings.py
2. Run migrations:
```bash
python manage.py makemigrations subscription
python manage.py migrate
```

3. Create sample plans:
```bash
python manage.py shell < add_subscription_plans.py
```

## Usage Example

```python
from subscription.models import SubscriptionPlan, UserSubscription
from django.utils import timezone
from dateutil.relativedelta import relativedelta

# Get a plan
plan = SubscriptionPlan.objects.get(name="Premium")

# Create subscription
subscription = UserSubscription.objects.create(
    user=user,
    plan=plan,
    start_date=timezone.now(),
    end_date=timezone.now() + relativedelta(months=1),
    is_active=True
)

# Check if expired
if subscription.is_expired():
    subscription.is_active = False
    subscription.save()
```

## Admin Interface

Access the admin interface at `/admin/` to:
- Create and manage subscription plans
- View user subscriptions
- Monitor subscription status
- Deactivate plans

## Business Logic

1. **Single Active Subscription**: Users can only have one active subscription at a time
2. **Auto-deactivation**: Expired subscriptions are automatically deactivated
3. **Plan Protection**: Plans cannot be deleted if they have active subscriptions (PROTECT)
4. **Duration Flexibility**: Subscriptions can be 1-12 months long

## Future Enhancements

- Payment integration (Stripe, PayPal)
- Automatic renewal
- Subscription upgrade/downgrade
- Usage tracking and limits enforcement
- Proration for plan changes
- Subscription analytics
