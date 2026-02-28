from django.urls import path
from subscription.views import (
    ListSubscriptionPlans,
    SubscribeView,
    MySubscriptionView
)

urlpatterns = [
    path('plans/', ListSubscriptionPlans.as_view(), name='list_plans'),
    path('subscribe/', SubscribeView.as_view(), name='subscribe'),
    path('my-subscription/', MySubscriptionView.as_view(), name='my_subscription'),
]
