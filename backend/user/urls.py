from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from user.views import (
    CollectOrder,
    GetOrder,
    ManageUser,
    ManageUsers,
    Orders,
    SignInView,
    SignUpView,
    AdminDashboardStats,
    AdminListUsers,
    AdminToggleUser,
    AdminListProducers,
    AdminListStations,
    AdminListBookings,
    AdminListSubscriptions,
    AdminListBookingsPaginated,
    AdminRevenueChart,
)


urlpatterns = [
    path("token/refresh/", TokenRefreshView.as_view(), name="auth_token_refresh"),
    path("token/pair/", TokenObtainPairView.as_view(), name="auth_token_pair"),
    path("signin/", SignInView.as_view(), name="auth_signin"),
    path("signup/", SignUpView.as_view(), name="auth_signup"),
    path("manage/", ManageUsers.as_view(), name="users_manage"),
    path("user/manage/<int:pk>/", ManageUser.as_view(), name="user_manage"),
    path("orders/", Orders.as_view(), name="user_orders"),
    path("order/<int:pk>/", GetOrder.as_view(), name="user_order"),
    path("order/collect/<int:pk>/", CollectOrder.as_view(), name="order_collect"),
    # Admin endpoints
    path('admin/stats/', AdminDashboardStats.as_view(), name='admin_stats'),
    path('admin/users/', AdminListUsers.as_view(), name='admin_users'),
    path('admin/users/<int:pk>/toggle/', AdminToggleUser.as_view(), name='admin_toggle_user'),
    path('admin/producers/', AdminListProducers.as_view(), name='admin_producers'),
    path('admin/stations/', AdminListStations.as_view(), name='admin_stations'),
    path('admin/bookings/', AdminListBookings.as_view(), name='admin_bookings'),
    path('admin/subscriptions/', AdminListSubscriptions.as_view(), name='admin_subscriptions'),
    path('admin/bookings/paginated/', AdminListBookingsPaginated.as_view(), name='admin_bookings_paginated'),
    path('admin/revenue/chart/', AdminRevenueChart.as_view(), name='admin_revenue_chart'),
]
