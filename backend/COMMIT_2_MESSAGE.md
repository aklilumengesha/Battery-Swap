# Commit 2: Create WebSocket Consumer and Routing

```
feat: add WebSocket consumers and routing for real-time updates

Create WebSocket infrastructure for real-time station inventory updates
and user notifications. Includes consumers, routing, and utility functions
for broadcasting updates to connected clients.

Changes:
- Create StationInventoryConsumer for station updates
- Create UserNotificationConsumer for personal notifications
- Add WebSocket URL routing configuration
- Update ASGI application with WebSocket support
- Create utility functions for broadcasting updates
- Add comprehensive WebSocket API documentation

Files created:
- battery/consumers.py (WebSocket consumers)
- battery/routing.py (WebSocket URL patterns)
- battery/websocket_utils.py (Broadcasting utilities)
- WEBSOCKET_API.md (Complete API documentation)

Files modified:
- batteryswap/asgi.py (Added WebSocket routing)

WebSocket Endpoints:
- ws://localhost:8000/ws/stations/ (all stations)
- ws://localhost:8000/ws/stations/{id}/ (specific station)
- ws://localhost:8000/ws/notifications/ (user notifications)

Features:
- Real-time inventory updates (available/booked batteries)
- Battery booking notifications
- Battery collection notifications
- Battery addition notifications
- Station status updates
- User-specific notifications
- Ping/pong for connection health
- Authentication middleware for user notifications

Message Types:
- inventory_update: Station inventory changes
- battery_booked: Battery booking events
- battery_collected: Battery collection events
- battery_added: New battery added to station
- station_status: Station operational status
- booking_confirmed: User booking confirmation
- booking_ready: Battery ready for collection
- notification: General user notifications

Broadcasting Functions:
- broadcast_inventory_update()
- broadcast_battery_booked()
- broadcast_battery_collected()
- broadcast_battery_added()
- broadcast_station_status()
- send_user_notification()
- notify_booking_ready()

Testing:
# Browser console
const ws = new WebSocket('ws://localhost:8000/ws/stations/');
ws.onmessage = (e) => console.log(JSON.parse(e.data));

# Python
python manage.py shell
>>> from channels.layers import get_channel_layer
>>> from asgiref.sync import async_to_sync
>>> channel_layer = get_channel_layer()
>>> async_to_sync(channel_layer.group_send)(
...     'stations_all',
...     {'type': 'inventory_update', 'station_id': 1, 'available_batteries': 10}
... )

Documentation:
- WEBSOCKET_API.md: Complete API reference
- Frontend integration examples
- React hooks for WebSocket connections
- Error handling patterns

Next steps:
- Commit 3: Integrate WebSocket updates with station views
- Add signals to trigger automatic updates
- Update views to broadcast changes

Notes:
- WebSocket consumers use async/await
- AuthMiddlewareStack provides authentication
- Channel layer uses Redis for message passing
- Supports multiple clients per station
- User notifications require authentication
```

## Short Version

```
feat: add WebSocket consumers and routing

- Create StationInventoryConsumer for real-time updates
- Create UserNotificationConsumer for personal alerts
- Add WebSocket routing and ASGI configuration
- Create broadcasting utility functions
- Add comprehensive API documentation

Endpoints:
- ws://localhost:8000/ws/stations/
- ws://localhost:8000/ws/stations/{id}/
- ws://localhost:8000/ws/notifications/

Testing: Connect via browser console or Python websockets
```
