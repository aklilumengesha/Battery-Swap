# Subscription Enforcement - Commit Message

```
feat: Implement subscription enforcement with swap limit validation

Created Utility Functions (subscription/utils.py):
- get_active_subscription(user): Get user's active subscription
- get_monthly_swap_count(user): Count swaps in current month
- can_create_order(user): Validate if user can create order
- get_subscription_status(user): Get detailed subscription info

Order Creation Enforcement:
- Added subscription check before order creation
- Validates active subscription exists
- Checks if subscription is expired
- Validates monthly swap limit not exceeded
- Returns 403 Forbidden with meaningful error if limit exceeded
- Returns subscription status with successful orders

Error Responses:
- "No active subscription found. Please subscribe to a plan to continue."
- "Your subscription has expired. Please renew to continue."
- "Monthly swap limit reached (X/Y). Please upgrade your plan or wait until next month."

New API Endpoint:
- GET /api/subscription-status/
  Returns detailed subscription status:
  * has_subscription (bool)
  * plan_name (str)
  * swap_limit (int)
  * swaps_used (int)
  * swaps_remaining (int)
  * is_expired (bool)
  * priority_support (bool)
  * end_date (datetime)

Updated Views:
- Orders.post(): Added subscription validation before order creation
- SubscriptionStatusView: New view for subscription status

Logic Flow:
1. User attempts to create order
2. System checks for active subscription
3. System validates subscription not expired
4. System counts current month's swaps
5. System compares with plan limit
6. If valid: Create order and return success with status
7. If invalid: Return 403 with specific error message

Features:
- Modular utility functions for reusability
- Clear separation of concerns
- Meaningful error messages for users
- Subscription status included in order response
- Monthly reset of swap counts
- Automatic expiration checking

Benefits:
- Enforces subscription limits
- Prevents unauthorized swaps
- Provides clear user feedback
- Enables monetization
- Tracks usage accurately
- Supports plan upgrades

The enforcement system ensures users stay within their subscription limits while providing clear feedback for upgrades or renewals.
```

## Implementation Details

### Utility Functions

**get_active_subscription(user)**
- Queries for active, non-expired subscriptions
- Uses select_related for performance
- Returns None if no active subscription

**get_monthly_swap_count(user)**
- Calculates start of current month
- Counts paid orders since month start
- Uses user.orders ManyToMany relationship

**can_create_order(user)**
- Checks subscription existence
- Validates expiration
- Compares usage against limit
- Returns (bool, error_message) tuple

**get_subscription_status(user)**
- Comprehensive status dictionary
- Includes usage statistics
- Calculates remaining swaps
- Handles users without subscriptions

### Order Creation Flow

```python
# Before (no enforcement)
def post(request):
    battery = get_battery()
    station = get_station()
    order = create_order()
    return success_response()

# After (with enforcement)
def post(request):
    can_create, error = can_create_order(user)
    if not can_create:
        return Response(error, 403)
    
    battery = get_battery()
    station = get_station()
    order = create_order()
    status = get_subscription_status(user)
    return success_response(status)
```

### Error Response Format

```json
{
  "success": false,
  "message": "Monthly swap limit reached (10/10). Please upgrade your plan or wait until next month.",
  "error_code": "SUBSCRIPTION_LIMIT_EXCEEDED"
}
```

### Success Response Format

```json
{
  "success": true,
  "order_pk": 123,
  "subscription_status": {
    "has_subscription": true,
    "plan_name": "Premium",
    "swap_limit": 30,
    "swaps_used": 15,
    "swaps_remaining": 15,
    "is_expired": false,
    "priority_support": true,
    "end_date": "2024-02-01T00:00:00Z"
  }
}
```

### Subscription Status Endpoint

```
GET /api/subscription-status/
Authorization: Bearer <token>

Response:
{
  "success": true,
  "status": {
    "has_subscription": true,
    "plan_name": "Basic",
    "swap_limit": 10,
    "swaps_used": 5,
    "swaps_remaining": 5,
    "is_expired": false,
    "priority_support": false,
    "end_date": "2024-02-01T00:00:00Z"
  }
}
```

## Testing

### Test Cases

1. **User with no subscription**
   - Attempt order creation
   - Expect: 403 with "No active subscription" message

2. **User with expired subscription**
   - Attempt order creation
   - Expect: 403 with "Subscription expired" message

3. **User at swap limit**
   - User has 10/10 swaps used
   - Attempt order creation
   - Expect: 403 with "Limit reached" message

4. **User within limit**
   - User has 5/10 swaps used
   - Attempt order creation
   - Expect: 200 with order and status

5. **Subscription status endpoint**
   - Call /api/subscription-status/
   - Expect: Accurate usage statistics

## Future Enhancements

- Prorated upgrades
- Rollover unused swaps
- Family/team plans
- Usage analytics dashboard
- Email notifications at 80% usage
- Automatic renewal
- Grace period after expiration
- Usage history tracking
