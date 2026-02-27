"""
WebSocket URL routing for battery app
"""

from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    # Station inventory updates - all stations
    re_path(r'ws/stations/$', consumers.StationInventoryConsumer.as_asgi()),
    
    # Station inventory updates - specific station
    re_path(r'ws/stations/(?P<station_id>\d+)/$', consumers.StationInventoryConsumer.as_asgi()),
    
    # User-specific notifications
    re_path(r'ws/notifications/$', consumers.UserNotificationConsumer.as_asgi()),
]

