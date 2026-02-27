"""
Django signals for automatic WebSocket broadcasting
Triggers real-time updates when station inventory changes
"""

from django.db.models.signals import m2m_changed, post_save
from django.dispatch import receiver
from battery.models import Station
from battery.websocket_utils import broadcast_inventory_update


@receiver(m2m_changed, sender=Station.batteries.through)
def station_batteries_changed(sender, instance, action, **kwargs):
    """
    Signal handler for when batteries are added/removed from a station.
    Broadcasts inventory update to connected WebSocket clients.
    
    Args:
        sender: The intermediate model for the many-to-many relation
        instance: The Station instance
        action: The type of update (post_add, post_remove, post_clear)
        **kwargs: Additional keyword arguments
    """
    # Only broadcast after the change is complete
    if action in ['post_add', 'post_remove', 'post_clear']:
        broadcast_inventory_update(instance, action='update')


@receiver(m2m_changed, sender=Station.booked_batteries.through)
def station_booked_batteries_changed(sender, instance, action, **kwargs):
    """
    Signal handler for when booked batteries change.
    Broadcasts inventory update to connected WebSocket clients.
    
    Args:
        sender: The intermediate model for the many-to-many relation
        instance: The Station instance
        action: The type of update (post_add, post_remove, post_clear)
        **kwargs: Additional keyword arguments
    """
    # Only broadcast after the change is complete
    if action in ['post_add', 'post_remove', 'post_clear']:
        broadcast_inventory_update(instance, action='update')


@receiver(post_save, sender=Station)
def station_saved(sender, instance, created, **kwargs):
    """
    Signal handler for when a station is created or updated.
    Broadcasts inventory update for new stations.
    
    Args:
        sender: The Station model
        instance: The Station instance
        created: Boolean indicating if this is a new instance
        **kwargs: Additional keyword arguments
    """
    if created:
        # Broadcast that a new station is available
        broadcast_inventory_update(instance, action='created')

