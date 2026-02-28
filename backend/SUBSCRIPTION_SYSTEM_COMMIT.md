# Subscription System - Commit Message

```
feat: Add subscription system with plans and user subscriptions

Created Models:
- SubscriptionPlan model with fields:
  * name (CharField, unique)
  * price (DecimalField)
  * swap_limit_per_month (IntegerField)
  * priority_support (BooleanField)
  * is_active (BooleanField)
  * created_at, updated_at (auto timestamps)

- UserSubscription model with fields:
  * user (ForeignKey to User)
  * plan (ForeignKey to SubscriptionPlan)
  * start_date (DateTimeField)
  * end_date (DateTimeField)
  * is_active (BooleanField)
  * created_at, updated_at (auto timestamps)

Created Serializers:
- SubscriptionPlanSerializer: Full plan details
- UserSubscriptionSerializer: Subscription with nested plan details
- SubscribeSerializer: Validation and subscription creation logic

Created API Endpoints:
- GET /api/plans/ - List all active subscription plans (public)
- POST /api/subscribe/ - Create new subscription (authenticated)
- GET /api/my-subscription/ - Get user's active subscription (authenticated)

Features:
- Auto-deactivate expired subscriptions
- Prevent multiple active subscriptions per user
- Duration-based subscriptions (1-12 months)
- Plan validation and availability checks
- Clean REST architecture with proper status codes
- Comprehensive error handling
- Admin interface for plan management

Database:
- Added subscription app to INSTALLED_APPS
- Created migrations for new models
- Protected plan deletion (PROTECT on FK)

The subscription system allows users to subscribe to different plans with varying swap limits and support levels, enabling monetization of the battery swap service.
```

## API Documentation

### 1. List Subscription Plans
```
GET /api/plans/
```

**Response:**
```json
{
  "results": [
    {
      "id": 1,
      "name": "Basic",
      "price": "9.99",
      "swap_limit_per_month": 10,
      "priority_support": false,
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### 2. Subscribe to Plan
```
POST /api/subscribe/
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "plan_id": 1,
  "duration_months": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Subscription created successfully",
  "subscription": {
    "id": 1,
    "user": 1,
    "user_email": "user@example.com",
    "plan": 1,
    "plan_details": {
      "id": 1,
      "name": "Basic",
      "price": "9.99",
      "swap_limit_per_month": 10,
      "priority_support": false,
      "is_active": true
    },
    "start_date": "2024-01-01T00:00:00Z",
    "end_date": "2024-02-01T00:00:00Z",
    "is_active": true,
    "is_expired": false
  }
}
```

### 3. Get My Subscription
```
GET /api/my-subscription/
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "subscription": {
    "id": 1,
    "user": 1,
    "user_email": "user@example.com",
    "plan": 1,
    "plan_details": {
      "id": 1,
      "name": "Basic",
      "price": "9.99",
      "swap_limit_per_month": 10,
      "priority_support": false
    },
    "start_date": "2024-01-01T00:00:00Z",
    "end_date": "2024-02-01T00:00:00Z",
    "is_active": true,
    "is_expired": false
  }
}
```

## Migration Instructions

1. Run migrations:
```bash
cd batterySwap/backend
python manage.py makemigrations subscription
python manage.py migrate
```

2. Create sample plans in Django admin or shell:
```python
from subscription.models import SubscriptionPlan

SubscriptionPlan.objects.create(
    name="Basic",
    price=9.99,
    swap_limit_per_month=10,
    priority_support=False,
    is_active=True
)

SubscriptionPlan.objects.create(
    name="Premium",
    price=19.99,
    swap_limit_per_month=30,
    priority_support=True,
    is_active=True
)
```

## File Structure
```
subscription/
├── __init__.py
├── admin.py          # Admin interface configuration
├── apps.py           # App configuration
├── models.py         # SubscriptionPlan, UserSubscription models
├── serializers.py    # DRF serializers
├── views.py          # API views
├── urls.py           # URL routing
├── tests.py          # Unit tests
└── migrations/
    └── __init__.py
```
