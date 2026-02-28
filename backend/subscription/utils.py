"""
Subscription utility functions for validation and enforcement
"""
from django.utils import timezone
from subscription.models import UserSubscription


def get_active_subscription(user):
    """
    Get user's active subscription
    
    Args:
        user: User instance
        
    Returns:
        UserSubscription instance or None
    """
    try:
        subscription = UserSubscription.objects.filter(
            user=user,
            is_active=True,
            end_date__gt=timezone.now()
        ).select_related('plan').first()
        
        return subscription
    except Exception:
        return None


def get_monthly_swap_count(user):
    """
    Get user's swap count for current month
    
    Args:
        user: User instance
        
    Returns:
        int: Number of swaps this month
    """
    # Get start of current month
    now = timezone.now()
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    # Count orders created this month
    swap_count = user.orders.filter(
        booked_time__gte=month_start,
        is_paid=True
    ).count()
    
    return swap_count


def can_create_order(user):
    """
    Check if user can create a new order based on subscription limits
    
    Args:
        user: User instance
        
    Returns:
        tuple: (bool, str) - (can_create, error_message)
    """
    # Get active subscription
    subscription = get_active_subscription(user)
    
    if not subscription:
        return False, "No active subscription found. Please subscribe to a plan to continue."
    
    # Check if subscription is expired
    if subscription.is_expired():
        return False, "Your subscription has expired. Please renew to continue."
    
    # Get current month's swap count
    current_swaps = get_monthly_swap_count(user)
    swap_limit = subscription.plan.swap_limit_per_month
    
    # Check if limit exceeded
    if current_swaps >= swap_limit:
        return False, f"Monthly swap limit reached ({current_swaps}/{swap_limit}). Please upgrade your plan or wait until next month."
    
    return True, ""


def get_subscription_status(user):
    """
    Get detailed subscription status for user
    
    Args:
        user: User instance
        
    Returns:
        dict: Subscription status information
    """
    subscription = get_active_subscription(user)
    
    if not subscription:
        return {
            'has_subscription': False,
            'plan_name': None,
            'swap_limit': 0,
            'swaps_used': 0,
            'swaps_remaining': 0,
            'is_expired': True,
            'priority_support': False
        }
    
    current_swaps = get_monthly_swap_count(user)
    swap_limit = subscription.plan.swap_limit_per_month
    
    return {
        'has_subscription': True,
        'plan_name': subscription.plan.name,
        'swap_limit': swap_limit,
        'swaps_used': current_swaps,
        'swaps_remaining': max(0, swap_limit - current_swaps),
        'is_expired': subscription.is_expired(),
        'priority_support': subscription.plan.priority_support,
        'end_date': subscription.end_date
    }
