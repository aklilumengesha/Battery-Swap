"""
Management command to test WebSocket broadcasting
Usage: python manage.py test_websocket
"""

from django.core.management.base import BaseCommand
from battery.models import Station
from battery.websocket_utils import (
    broadcast_inventory_update,
    broadcast_station_status,
)


class Command(BaseCommand):
    help = 'Test WebSocket broadcasting functionality'

    def add_arguments(self, parser):
        parser.add_argument(
            '--station-id',
            type=int,
            help='Station ID to broadcast update for',
        )

    def handle(self, *args, **options):
        station_id = options.get('station_id')

        if station_id:
            try:
                station = Station.objects.get(pk=station_id)
                self.stdout.write(
                    self.style.SUCCESS(f'Broadcasting update for station: {station.name}')
                )
                broadcast_inventory_update(station, action='test')
                self.stdout.write(
                    self.style.SUCCESS('✓ Inventory update broadcasted successfully')
                )
            except Station.DoesNotExist:
                self.stdout.write(
                    self.style.ERROR(f'Station with ID {station_id} not found')
                )
        else:
            # Broadcast to all stations
            stations = Station.objects.all()
            if not stations.exists():
                self.stdout.write(
                    self.style.WARNING('No stations found in database')
                )
                return

            self.stdout.write(
                self.style.SUCCESS(f'Broadcasting updates for {stations.count()} stations')
            )

            for station in stations:
                broadcast_inventory_update(station, action='test')
                self.stdout.write(
                    self.style.SUCCESS(f'✓ Broadcasted update for: {station.name}')
                )

            self.stdout.write(
                self.style.SUCCESS('\n✓ All updates broadcasted successfully')
            )

        self.stdout.write('\nTo test WebSocket connection, open browser console and run:')
        self.stdout.write('const ws = new WebSocket("ws://localhost:8000/ws/stations/");')
        self.stdout.write('ws.onmessage = (e) => console.log(JSON.parse(e.data));')

