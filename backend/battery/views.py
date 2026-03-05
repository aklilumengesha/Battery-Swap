from batteryswap import config
import razorpay
from rest_framework import generics, views, status
from rest_framework.response import Response

from rest_framework.permissions import IsAuthenticated

from battery.utils import get_battery_data, get_station_data
from battery.websocket_utils import broadcast_battery_added
from consumer.models import Consumer
from producer.models import Company
from battery.models import Battery, Station, Vehicle
from user.models import User
from battery.serializers import (
    BatterySerializer,
    NewBatteriesSerializer,
    StationSerializer,
    VehicleSerializer,
)


# Helper functions for user type checking
def is_producer(user):
    return user.user_type == 'producer'


def is_consumer(user):
    return user.user_type == 'consumer'


class ManageBatteries(views.APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        batteries = Battery.objects.select_related('vehicle', 'company').all()
        data = []
        for battery in batteries:
            data.append({
                'pk': battery.pk,
                'price': battery.price,
                'vehicle': {
                    'pk': battery.vehicle.pk,
                    'name': battery.vehicle.name,
                } if battery.vehicle else None,
                'company': {
                    'pk': battery.company.pk,
                    'name': battery.company.name,
                } if battery.company else None,
            })
        return Response({
            'success': True,
            'batteries': data,
            'total': len(data)
        })
    
    def post(self, request, *args, **kwargs):
        if request.user.user_type != 'producer':
            return Response(
                {'success': False, 'message': 'Only producers can create batteries'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        vehicle_pk = request.data.get('vehicle')
        company_pk = request.data.get('company')
        price = request.data.get('price')
        
        if not all([vehicle_pk, company_pk, price]):
            return Response(
                {'success': False, 'message': 'vehicle, company and price are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            vehicle = Vehicle.objects.get(pk=vehicle_pk)
            company = Company.objects.get(pk=company_pk)
            
            battery = Battery.objects.create(
                vehicle=vehicle,
                company=company,
                price=float(price)
            )
            
            return Response(
                {
                    'success': True,
                    'message': 'Battery created successfully',
                    'battery': {
                        'pk': battery.pk,
                        'price': battery.price,
                        'vehicle': {
                            'pk': vehicle.pk,
                            'name': vehicle.name,
                        },
                        'company': {
                            'pk': company.pk,
                            'name': company.name,
                        },
                    }
                },
                status=status.HTTP_201_CREATED
            )
        except Vehicle.DoesNotExist:
            return Response(
                {'success': False, 'message': f'Vehicle with pk {vehicle_pk} not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Company.DoesNotExist:
            return Response(
                {'success': False, 'message': f'Company with pk {company_pk} not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'success': False, 'message': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class ManageBattery(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BatterySerializer
    queryset = Battery.objects.all()
    
    def put(self, request, *args, **kwargs):
        if not is_producer(request.user):
            return Response(
                {'success': False, 'message': 'Only producers can update batteries'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().put(request, *args, **kwargs)
    
    def patch(self, request, *args, **kwargs):
        if not is_producer(request.user):
            return Response(
                {'success': False, 'message': 'Only producers can update batteries'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().patch(request, *args, **kwargs)
    
    def delete(self, request, *args, **kwargs):
        if not is_producer(request.user):
            return Response(
                {'success': False, 'message': 'Only producers can delete batteries'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().delete(request, *args, **kwargs)


class ListBatteries(views.APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        batteries = Battery.objects.select_related('vehicle', 'company').all()
        data = []
        for battery in batteries:
            data.append({
                'pk': battery.pk,
                'price': battery.price,
                'vehicle': {
                    'pk': battery.vehicle.pk,
                    'name': battery.vehicle.name,
                } if battery.vehicle else None,
                'company': {
                    'pk': battery.company.pk,
                    'name': battery.company.name,
                } if battery.company else None,
            })
        return Response({
            'success': True,
            'batteries': data,
            'total': len(data)
        }, status=status.HTTP_200_OK)


class ManageVehicles(generics.ListCreateAPIView):
    serializer_class = VehicleSerializer
    queryset = Vehicle.objects.all()


class ListVehicles(generics.ListAPIView):
    serializer_class = VehicleSerializer
    queryset = Vehicle.objects.all()


class ManageVehicle(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = VehicleSerializer
    queryset = Vehicle.objects.all()


class ManageStations(generics.ListCreateAPIView):
    serializer_class = StationSerializer
    queryset = Station.objects.all()
    
    def post(self, request, *args, **kwargs):
        if request.user.user_type != 'producer':
            return Response(
                {'success': False, 'message': 'Only producers can create stations'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            from producer.models import Producer
            producer = Producer.objects.get(user=request.user)
            
            name = request.data.get('name')
            latitude = request.data.get('latitude')
            longitude = request.data.get('longitude')
            
            if not name:
                return Response(
                    {'success': False, 'message': 'Station name is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if latitude is None or longitude is None:
                return Response(
                    {'success': False, 'message': 'latitude and longitude are required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            station = Station.objects.create(
                name=name,
                latitude=float(latitude),
                longitude=float(longitude),
                owner=producer
            )
            
            return Response(
                {
                    'success': True,
                    'message': 'Station created successfully',
                    'station': {
                        'pk': station.pk,
                        'name': station.name,
                        'latitude': station.latitude,
                        'longitude': station.longitude,
                    }
                },
                status=status.HTTP_201_CREATED
            )
        except Producer.DoesNotExist:
            return Response(
                {'success': False, 'message': 'Producer profile not found. Please contact support.'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'success': False, 'message': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class ManageStationBatteries(views.APIView):
    def put(self, request, *args, **kwargs):
        if not is_producer(request.user):
            return Response(
                {'success': False, 'message': 'Only producers can add batteries to stations'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        station = Station.objects.get(pk=kwargs["pk"])
        battery_id = request.data.get("newBattery")
        battery = Battery.objects.get(pk=battery_id)
        
        station.batteries.add(battery)
        station.save()
        
        # Broadcast battery added event via WebSocket
        broadcast_battery_added(station, battery)
        
        return Response(status=status.HTTP_200_OK, data={"success": True})

    # def get_queryset(self):
    #     stations = Station.objects.all()
    #     query_set = StationSerializer(stations, many=True)
    #     return query_set


class FindStations(views.APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        user = request.user
        
        # Check if user is a consumer
        if user.user_type != "consumer":
            return Response(
                data={"success": False, "message": "Only consumers can view stations", "stations": []},
                status=status.HTTP_403_FORBIDDEN,
            )
        
        # Get consumer profile
        try:
            consumer = Consumer.objects.get(user=user)
        except Consumer.DoesNotExist:
            return Response(
                data={"success": False, "message": "Consumer profile not found. Please complete your profile.", "stations": []},
                status=status.HTTP_404_NOT_FOUND,
            )
        
        # Get location parameters
        try:
            latitude = request.query_params.get("latitude", 10.0484417)
            longitude = request.query_params.get("longitude", 76.3310651)
            if latitude == "undefined":
                latitude = 10.0484417
            if longitude == "undefined":
                longitude = 76.3310651
            latitude = float(latitude)
            longitude = float(longitude)
        except (ValueError, TypeError):
            return Response(
                data={"success": False, "message": "Invalid location parameters", "stations": []},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        # Get all stations
        stations = Station.objects.all()
        
        # Filter stations by vehicle compatibility
        batteries = Battery.objects.filter(vehicle=consumer.vehicle)
        stations_data = []
        
        for station in stations:
            # Check if station has batteries compatible with user's vehicle
            if any(battery in batteries for battery in station.batteries.all()):
                stations_data.append(
                    get_station_data(station, latitude, longitude)
                )
        
        # Sort by distance
        stations_data.sort(key=lambda station: station["distance"])
        
        return Response(
            data={"success": True, "stations": stations_data},
            status=status.HTTP_200_OK,
        )



class GetStation(views.APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        try:
            station = Station.objects.get(pk=kwargs["pk"])
            return Response(
                data={
                    "success": True,
                    "station": get_station_data(
                        station,
                        float(request.query_params.get("latitude")),
                        float(request.query_params.get("longitude")),
                    ),
                },
                status=status.HTTP_200_OK,
            )
        except Station.DoesNotExist:
            return Response(
                data={"success": False},
                status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION,
            )


class Payments(views.APIView):
    def get(self, request, *args, **kwargs):
        return Response(data={})

    def post(self, request, *args, **kwargs):
        client = razorpay.Client(auth=(config.RAZORPAY_ID, config.RAZORPAY_SECRET))
        DATA = {
            "amount": int(request.data.get("amount")),
            "currency": "INR",
            "receipt": "receipt#1",
            "notes": {"vehicle": "Vehicle", "station": "Station"},
        }
        client.order.create(data=DATA)
        return Response(data={})


class ManageStation(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = StationSerializer
    queryset = Station.objects.all()
    
    def put(self, request, *args, **kwargs):
        if not is_producer(request.user):
            return Response(
                {'success': False, 'message': 'Only producers can update stations'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().put(request, *args, **kwargs)
    
    def patch(self, request, *args, **kwargs):
        if not is_producer(request.user):
            return Response(
                {'success': False, 'message': 'Only producers can update stations'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().patch(request, *args, **kwargs)
    
    def delete(self, request, *args, **kwargs):
        if not is_producer(request.user):
            return Response(
                {'success': False, 'message': 'Only producers can delete stations'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().delete(request, *args, **kwargs)



class MyStations(views.APIView):
    """Get all stations owned by the logged-in producer"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        if not is_producer(request.user):
            return Response(
                {'success': False, 'message': 'Only producers can access this'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            from producer.models import Producer
            producer = Producer.objects.get(user=request.user)
            stations = Station.objects.filter(owner=producer)
            
            data = []
            for station in stations:
                batteries = station.batteries.all()
                data.append({
                    'pk': station.pk,
                    'name': station.name,
                    'latitude': station.latitude,
                    'longitude': station.longitude,
                    'total_batteries': batteries.count(),
                    'available_batteries': batteries.count(),
                })
            
            return Response({
                'success': True,
                'stations': data,
                'total': len(data)
            })
        except Exception as e:
            return Response(
                {'success': False, 'message': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class MyStationBookings(views.APIView):
    """Get all bookings at producer's stations"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        if not is_producer(request.user):
            return Response(
                {'success': False, 'message': 'Only producers can access this'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            from producer.models import Producer
            from user.models import Order
            
            producer = Producer.objects.get(user=request.user)
            stations = Station.objects.filter(owner=producer)
            station_ids = stations.values_list('pk', flat=True)
            
            orders = Order.objects.filter(
                station__pk__in=station_ids
            ).select_related(
                'battery', 'battery__vehicle', 'battery__company', 'station'
            ).order_by('-booked_time')
            
            data = []
            for order in orders:
                data.append({
                    'pk': order.pk,
                    'station_name': order.station.name if order.station else None,
                    'battery_price': order.battery.price if order.battery else 0,
                    'vehicle': order.battery.vehicle.name if order.battery and order.battery.vehicle else None,
                    'is_paid': order.is_paid,
                    'is_collected': order.is_collected,
                    'booked_time': order.booked_time,
                })
            
            return Response({
                'success': True,
                'bookings': data,
                'total': len(data)
            })
        except Exception as e:
            return Response(
                {'success': False, 'message': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class MyStationStats(views.APIView):
    """Get analytics for producer's stations"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        if not is_producer(request.user):
            return Response(
                {'success': False, 'message': 'Only producers can access this'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            from producer.models import Producer
            from user.models import Order
            
            producer = Producer.objects.get(user=request.user)
            stations = Station.objects.filter(owner=producer)
            station_ids = stations.values_list('pk', flat=True)
            orders = Order.objects.filter(station__pk__in=station_ids)
            
            total_revenue = sum(
                o.battery.price for o in orders if o.battery and o.is_paid
            )
            
            return Response({
                'success': True,
                'stats': {
                    'total_stations': stations.count(),
                    'total_bookings': orders.count(),
                    'total_revenue': total_revenue,
                    'paid_bookings': orders.filter(is_paid=True).count(),
                    'collected_bookings': orders.filter(is_collected=True).count(),
                    'pending_bookings': orders.filter(is_collected=False).count(),
                }
            })
        except Exception as e:
            return Response(
                {'success': False, 'message': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
