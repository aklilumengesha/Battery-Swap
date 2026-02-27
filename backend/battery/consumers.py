"""
WebSocket Consumers for Battery Swap Application
Handles real-time updates for station inventory
"""

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model

User = get_user_model()


class StationInventoryConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for real-time station inventory updates.
    
    Clients can subscribe to updates for specific stations or all stations.
    Updates are sent when:
    - Battery is added to a station
    - Battery is booked from a station
    - Battery is collected from a station
    - Station inventory changes
    """

    async def connect(self):
        """
        Handle WebSocket connection.
        Authenticate user and add to appropriate groups.
        """
        # Get station_id from URL route (optional - for specific station updates)
        self.station_id = self.scope['url_route']['kwargs'].get('station_id')
        
        # Create group name
        if self.station_id:
            # Subscribe to specific station updates
            self.group_name = f'station_{self.station_id}'
        else:
            # Subscribe to all station updates
            self.group_name = 'stations_all'
        
        # Add this channel to the group
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        
        # Accept the WebSocket connection
        await self.accept()
        
        # Send connection confirmation
        await self.send(text_data=json.dumps({
            'type': 'connection_established',
            'message': f'Connected to {self.group_name}',
            'station_id': self.station_id
        }))

    async def disconnect(self, close_code):
        """
        Handle WebSocket disconnection.
        Remove from groups.
        """
        # Leave the group
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        """
        Handle messages received from WebSocket.
        Currently not used, but can be extended for client requests.
        """
        try:
            data = json.loads(text_data)
            message_type = data.get('type')
            
            if message_type == 'ping':
                # Respond to ping with pong
                await self.send(text_data=json.dumps({
                    'type': 'pong',
                    'timestamp': data.get('timestamp')
                }))
            else:
                # Echo back for now
                await self.send(text_data=json.dumps({
                    'type': 'echo',
                    'message': data
                }))
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Invalid JSON'
            }))

    # Handler methods for different event types
    
    async def inventory_update(self, event):
        """
        Handle inventory update events from channel layer.
        Send the update to the WebSocket client.
        """
        await self.send(text_data=json.dumps({
            'type': 'inventory_update',
            'station_id': event['station_id'],
            'station_name': event.get('station_name'),
            'available_batteries': event['available_batteries'],
            'booked_batteries': event['booked_batteries'],
            'total_batteries': event['total_batteries'],
            'timestamp': event.get('timestamp'),
            'action': event.get('action', 'update')
        }))

    async def battery_booked(self, event):
        """
        Handle battery booked events.
        Notify clients when a battery is booked.
        """
        await self.send(text_data=json.dumps({
            'type': 'battery_booked',
            'station_id': event['station_id'],
            'station_name': event.get('station_name'),
            'battery_id': event.get('battery_id'),
            'available_batteries': event['available_batteries'],
            'booked_batteries': event['booked_batteries'],
            'user': event.get('user'),
            'timestamp': event.get('timestamp')
        }))

    async def battery_collected(self, event):
        """
        Handle battery collected events.
        Notify clients when a battery is collected.
        """
        await self.send(text_data=json.dumps({
            'type': 'battery_collected',
            'station_id': event['station_id'],
            'station_name': event.get('station_name'),
            'battery_id': event.get('battery_id'),
            'available_batteries': event['available_batteries'],
            'booked_batteries': event['booked_batteries'],
            'timestamp': event.get('timestamp')
        }))

    async def battery_added(self, event):
        """
        Handle battery added events.
        Notify clients when a battery is added to a station.
        """
        await self.send(text_data=json.dumps({
            'type': 'battery_added',
            'station_id': event['station_id'],
            'station_name': event.get('station_name'),
            'battery_id': event.get('battery_id'),
            'available_batteries': event['available_batteries'],
            'total_batteries': event['total_batteries'],
            'timestamp': event.get('timestamp')
        }))

    async def station_status(self, event):
        """
        Handle station status events.
        Notify clients about station operational status changes.
        """
        await self.send(text_data=json.dumps({
            'type': 'station_status',
            'station_id': event['station_id'],
            'station_name': event.get('station_name'),
            'status': event['status'],
            'message': event.get('message'),
            'timestamp': event.get('timestamp')
        }))


class UserNotificationConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for user-specific notifications.
    Handles personal notifications for authenticated users.
    """

    async def connect(self):
        """
        Handle WebSocket connection for authenticated users.
        """
        # Get user from scope (set by auth middleware)
        self.user = self.scope.get('user')
        
        # Only allow authenticated users
        if not self.user or not self.user.is_authenticated:
            await self.close()
            return
        
        # Create user-specific group
        self.group_name = f'user_{self.user.pk}'
        
        # Add to user's personal group
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        
        # Accept connection
        await self.accept()
        
        # Send connection confirmation
        await self.send(text_data=json.dumps({
            'type': 'connection_established',
            'message': f'Connected to personal notifications',
            'user_id': self.user.pk
        }))

    async def disconnect(self, close_code):
        """
        Handle disconnection.
        """
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        """
        Handle messages from client.
        """
        try:
            data = json.loads(text_data)
            message_type = data.get('type')
            
            if message_type == 'ping':
                await self.send(text_data=json.dumps({
                    'type': 'pong',
                    'timestamp': data.get('timestamp')
                }))
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Invalid JSON'
            }))

    async def booking_confirmed(self, event):
        """
        Notify user that their booking is confirmed.
        """
        await self.send(text_data=json.dumps({
            'type': 'booking_confirmed',
            'booking_id': event['booking_id'],
            'station_name': event.get('station_name'),
            'battery_info': event.get('battery_info'),
            'message': event.get('message'),
            'timestamp': event.get('timestamp')
        }))

    async def booking_ready(self, event):
        """
        Notify user that their battery is ready for collection.
        """
        await self.send(text_data=json.dumps({
            'type': 'booking_ready',
            'booking_id': event['booking_id'],
            'station_name': event.get('station_name'),
            'message': event.get('message'),
            'timestamp': event.get('timestamp')
        }))

    async def notification(self, event):
        """
        Send general notification to user.
        """
        await self.send(text_data=json.dumps({
            'type': 'notification',
            'title': event.get('title'),
            'message': event['message'],
            'level': event.get('level', 'info'),
            'timestamp': event.get('timestamp')
        }))

