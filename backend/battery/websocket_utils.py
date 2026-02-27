"""
Utility functions for WebSocket broadcasting
Helper functions to send real-time updates to connected clients
"""

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from datetime import datetime


def get_station_inventory_data(station):
    """
    Get current inventory data for a station.
    
    Args:
        station: Station model instance
        
    Returns:
        dict: Inventory data
    """
    return {
        'station_id': station.pk,
        'station_name': station.name,
        'available_batteries': station.batteries.count(),
        'booked_batteries': station.booked_batteries.count(),
        'total_batteries': station.batteries.count() + station.booked_batteries.count(),
        'timestamp': datetime.now().isoformat()
    }


def broadcast_inventory_update(station, action='update'):
    """
    Broadcast inventory update to all clients subscribed to this station.
    
    Args:
        station: Station model instance
        action: Type of action ('update', 'add', 'book', 'collect')
    """
    channel_layer = get_channel_layer()
    
    # Get inventory data
    data = get_station_inventory_data(station)
    data['action'] = action
    
    # Broadcast to specific station group
    async_to_sync(channel_layer.group_send)(
        f'station_{station.pk}',
        {
            'type': 'inventory_update',
            **data
        }
    )
    
    # Also broadcast to all stations group
    async_to_sync(channel_layer.group_send)(
        'stations_all',
        {
            'type': 'inventory_update',
            **data
        }
    )


def broadcast_battery_booked(station, battery, user=None):
    """
    Broadcast battery booked event.
    
    Args:
        station: Station model instance
        battery: Battery model instance
        user: User who booked (optional)
    """
    channel_layer = get_channel_layer()
    
    data = get_station_inventory_data(station)
    data.update({
        'battery_id': battery.pk,
        'user': user.email if user else None
    })
    
    # Broadcast to station groups
    async_to_sync(channel_layer.group_send)(
        f'station_{station.pk}',
        {
            'type': 'battery_booked',
            **data
        }
    )
    
    async_to_sync(channel_layer.group_send)(
        'stations_all',
        {
            'type': 'battery_booked',
            **data
        }
    )
    
    # Send personal notification to user
    if user:
        async_to_sync(channel_layer.group_send)(
            f'user_{user.pk}',
            {
                'type': 'booking_confirmed',
                'booking_id': None,  # Will be set in view
                'station_name': station.name,
                'battery_info': f"{battery.company.name} - {battery.vehicle.name}",
                'message': f'Battery booked successfully at {station.name}',
                'timestamp': datetime.now().isoformat()
            }
        )


def broadcast_battery_collected(station, battery):
    """
    Broadcast battery collected event.
    
    Args:
        station: Station model instance
        battery: Battery model instance
    """
    channel_layer = get_channel_layer()
    
    data = get_station_inventory_data(station)
    data['battery_id'] = battery.pk
    
    # Broadcast to station groups
    async_to_sync(channel_layer.group_send)(
        f'station_{station.pk}',
        {
            'type': 'battery_collected',
            **data
        }
    )
    
    async_to_sync(channel_layer.group_send)(
        'stations_all',
        {
            'type': 'battery_collected',
            **data
        }
    )


def broadcast_battery_added(station, battery):
    """
    Broadcast battery added event.
    
    Args:
        station: Station model instance
        battery: Battery model instance
    """
    channel_layer = get_channel_layer()
    
    data = get_station_inventory_data(station)
    data['battery_id'] = battery.pk
    
    # Broadcast to station groups
    async_to_sync(channel_layer.group_send)(
        f'station_{station.pk}',
        {
            'type': 'battery_added',
            **data
        }
    )
    
    async_to_sync(channel_layer.group_send)(
        'stations_all',
        {
            'type': 'battery_added',
            **data
        }
    )


def broadcast_station_status(station, status, message=None):
    """
    Broadcast station status change.
    
    Args:
        station: Station model instance
        status: Status string ('online', 'offline', 'maintenance')
        message: Optional message
    """
    channel_layer = get_channel_layer()
    
    data = {
        'station_id': station.pk,
        'station_name': station.name,
        'status': status,
        'message': message,
        'timestamp': datetime.now().isoformat()
    }
    
    # Broadcast to station groups
    async_to_sync(channel_layer.group_send)(
        f'station_{station.pk}',
        {
            'type': 'station_status',
            **data
        }
    )
    
    async_to_sync(channel_layer.group_send)(
        'stations_all',
        {
            'type': 'station_status',
            **data
        }
    )


def send_user_notification(user, title, message, level='info'):
    """
    Send notification to a specific user.
    
    Args:
        user: User model instance
        title: Notification title
        message: Notification message
        level: Notification level ('info', 'success', 'warning', 'error')
    """
    channel_layer = get_channel_layer()
    
    async_to_sync(channel_layer.group_send)(
        f'user_{user.pk}',
        {
            'type': 'notification',
            'title': title,
            'message': message,
            'level': level,
            'timestamp': datetime.now().isoformat()
        }
    )


def notify_booking_ready(user, booking_id, station_name):
    """
    Notify user that their booking is ready for collection.
    
    Args:
        user: User model instance
        booking_id: Booking ID
        station_name: Station name
    """
    channel_layer = get_channel_layer()
    
    async_to_sync(channel_layer.group_send)(
        f'user_{user.pk}',
        {
            'type': 'booking_ready',
            'booking_id': booking_id,
            'station_name': station_name,
            'message': f'Your battery is ready for collection at {station_name}',
            'timestamp': datetime.now().isoformat()
        }
    )

