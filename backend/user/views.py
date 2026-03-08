import datetime
from rest_framework import views, status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

from django.contrib.auth import authenticate, login
from user.models import Order, User
from consumer.models import Consumer
from producer.models import Company, Producer
from battery.models import Battery, Station, Vehicle
from battery.websocket_utils import (
    broadcast_battery_booked,
    broadcast_battery_collected,
    notify_booking_ready,
)
from subscription.utils import can_create_order, get_subscription_status


from user.serializers import SignupSerializer, UserSerializer
from user.utils import generate_token_pairs, get_order_data


class ManageUsers(generics.ListCreateAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()


class ManageUser(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()


class SignInView(views.APIView):
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        data = request.data
        user = authenticate(
            username=data.get("email", None), password=data.get("password", None)
        )
        if user is not None:
            # if user.is_email_verified:
            login(request, user)
            meta_data = {}
            
            try:
                if user.user_type == "consumer":
                    consumer = Consumer.objects.get(user=user)
                    meta_data = {
                        "vehicle": {
                            "name": consumer.vehicle.name,
                            "pk": consumer.vehicle.pk,
                        }
                    }
                else:
                    producer = Producer.objects.get(user=user)
                    meta_data = {
                        "company": {
                            "name": producer.company.name,
                            "pk": producer.company.pk,
                        }
                    }
            except (Consumer.DoesNotExist, Producer.DoesNotExist):
                # Handle superuser or users without Consumer/Producer profile
                meta_data = {}
            
            return Response(
                data={
                    "success": True,
                    "message": f"Welcome back, {user.name}",
                    "tokens": generate_token_pairs(user),
                    "user": {
                        "pk": user.pk,
                        "user_type": user.user_type,
                        "meta_data": meta_data,
                    },
                },
                status=status.HTTP_201_CREATED,
            )
            # return Response(
            #     status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION,
            #     data={
            #         "msg": "A verification mail is send to your email address. Please verify your email address to Login."
            #     },
            # )
        return Response(
            data={
                "success": False,
                "message": "Invalid Credentials",
            },
            status=status.HTTP_401_UNAUTHORIZED,
        )



class SignUpView(views.APIView):
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        # try:
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            meta_data = {}
            
            try:
                if user.user_type == "consumer":
                    consumer = Consumer.objects.get(user=user)
                    meta_data = {
                        "vehicle": {
                            "name": consumer.vehicle.name,
                            "pk": consumer.vehicle.pk,
                        }
                    }
                else:
                    producer = Producer.objects.get(user=user)
                    meta_data = {
                        "company": {
                            "name": producer.company.name,
                            "pk": producer.company.pk,
                        }
                    }
            except (Consumer.DoesNotExist, Producer.DoesNotExist):
                # Handle users without Consumer/Producer profile
                meta_data = {}
            
            return Response(
                data={
                    "success": True,
                    "message": f"Welcome, {user.name}",
                    "tokens": generate_token_pairs(user),
                    "user": {
                        "pk": user.pk,
                        "user_type": user.user_type,
                        "meta_data": meta_data,
                    },
                },
                status=status.HTTP_201_CREATED,
            )
        msg = ""
        for err in serializer.errors.values():
            for val in err:
                if msg == "":
                    msg = val
        print(serializer.errors)
        return Response(
            data={
                "success": False,
                "message": msg,
                "error": serializer.errors,
            },
            status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION,
        )

    # except Exception as error:
    #     print(error)
    #     return Response(
    #         data={
    #             "success": False,
    #             "message": "Sever failure. Please try again later",
    #             "error": str(error),
    #         },
    #         status=status.HTTP_202_ACCEPTED,
    #     )



class Orders(views.APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        try:
            # Check subscription and swap limit BEFORE creating order
            can_create, error_message = can_create_order(request.user)
            
            if not can_create:
                return Response(
                    data={
                        "success": False,
                        "message": error_message,
                        "error_code": "SUBSCRIPTION_LIMIT_EXCEEDED"
                    },
                    status=status.HTTP_403_FORBIDDEN
                )
            
            print(request.data)
            battery = Battery.objects.get(pk=request.data.get("battery"))
            station = Station.objects.get(pk=request.data.get("station"))
            user = User.objects.get(pk=request.user.pk)

            station.batteries.remove(battery)
            station.booked_batteries.add(battery)
            station.save()

            order = Order.objects.create(
                battery=battery,
                station=station,
                expiry_time=datetime.datetime.now() + datetime.timedelta(days=1),
                is_paid=True,
            )
            order.save()

            user.orders.add(order)
            user.save()

            # Broadcast battery booked event via WebSocket
            broadcast_battery_booked(station, battery, user)
            
            # Get updated subscription status
            subscription_status = get_subscription_status(user)

            return Response(
                data={
                    "success": True,
                    "order_pk": order.pk,
                    "subscription_status": subscription_status
                },
                status=status.HTTP_200_OK
            )
        except Exception as e:
            print(e)
            return Response(
                data={"success": False},
                status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION,
            )

    def get(self, request, *args, **kwargs):
        try:
            orders_data = []
            for order in request.user.orders.all():
                orders_data.append(get_order_data(order))
            return Response(
                status=status.HTTP_200_OK, data={"success": True, "orders": orders_data}
            )
        except Exception as e:
            print(e)
            return Response(
                data={"success": False},
                status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION,
            )



class CollectOrder(views.APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        try:
            order = Order.objects.get(pk=kwargs["pk"])
            station = order.station
            battery = order.battery
            
            order.is_collected = True
            order.save()
            
            # Move battery from booked to available (or remove from station)
            station.booked_batteries.remove(battery)
            station.save()
            
            # Broadcast battery collected event via WebSocket
            broadcast_battery_collected(station, battery)
            
            return Response(data={"success": True}, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response(
                data={"success": False},
                status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION,
            )


class GetOrder(views.APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        try:
            order_data = {}
            found = False
            for order in request.user.orders.all():
                if order.pk == kwargs["pk"]:
                    found = True
                    order_data = get_order_data(order)
            if found:
                return Response(
                    status=status.HTTP_200_OK,
                    data={"success": True, "order": order_data},
                )
            else:
                return Response(
                    status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION,
                    data={"success": False},
                )
        except Exception as e:
            print(e)
            return Response(
                data={"success": False},
                status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION,
            )



# ============================================
# ADMIN VIEWS
# ============================================

def is_admin(user):
    return user.is_staff or \
           getattr(user, 'user_type', '') == 'admin'


class AdminDashboardStats(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if not is_admin(request.user):
            return Response(
                {'success': False, 'message': 'Admin access required'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            from battery.models import Station, Battery
            from producer.models import Producer
            
            total_users = User.objects.count()
            total_producers = Producer.objects.count()
            total_consumers = User.objects.filter(user_type='consumer').count()
            total_stations = Station.objects.count()
            total_batteries = Battery.objects.count()
            total_orders = Order.objects.count()
            paid_orders = Order.objects.filter(is_paid=True).count()
            total_revenue = sum(
                o.battery.price 
                for o in Order.objects.filter(is_paid=True).select_related('battery')
                if o.battery
            )
            
            return Response({
                'success': True,
                'stats': {
                    'total_users': total_users,
                    'total_producers': total_producers,
                    'total_consumers': total_consumers,
                    'total_stations': total_stations,
                    'total_batteries': total_batteries,
                    'total_orders': total_orders,
                    'paid_orders': paid_orders,
                    'total_revenue': total_revenue,
                }
            })
        except Exception as e:
            import traceback
            print(traceback.format_exc())
            return Response(
                {'success': False, 'message': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AdminListUsers(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if not is_admin(request.user):
            return Response(
                {'success': False, 'message': 'Admin access required'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            users = User.objects.all().order_by('-date_joined')
            data = []
            for u in users:
                data.append({
                    'pk': u.pk,
                    'name': u.name,
                    'email': u.email,
                    'user_type': u.user_type,
                    'date_joined': u.date_joined,
                    'is_active': u.is_active,
                })
            
            return Response({
                'success': True,
                'users': data,
                'total': len(data)
            })
        except Exception as e:
            return Response(
                {'success': False, 'message': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AdminToggleUser(APIView):
    permission_classes = [IsAuthenticated]
    
    def patch(self, request, pk):
        if not is_admin(request.user):
            return Response(
                {'success': False, 'message': 'Admin access required'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            user = User.objects.get(pk=pk)
            user.is_active = not user.is_active
            user.save()
            
            return Response({
                'success': True,
                'is_active': user.is_active,
                'message': f'User {"activated" if user.is_active else "deactivated"}'
            })
        except User.DoesNotExist:
            return Response(
                {'success': False, 'message': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class AdminListProducers(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if not is_admin(request.user):
            return Response(
                {'success': False, 'message': 'Admin access required'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            from producer.models import Producer
            from battery.models import Station
            
            producers = Producer.objects.select_related('user', 'company').all()
            data = []
            for p in producers:
                stations = Station.objects.filter(owner=p)
                orders = Order.objects.filter(station__in=stations)
                revenue = sum(
                    o.battery.price 
                    for o in orders.select_related('battery')
                    if o.battery and o.is_paid
                )
                
                data.append({
                    'pk': p.pk,
                    'name': p.user.name,
                    'email': p.user.email,
                    'company': p.company.name if p.company else '—',
                    'total_stations': stations.count(),
                    'total_bookings': orders.count(),
                    'total_revenue': revenue,
                    'is_active': p.user.is_active,
                    'date_joined': p.user.date_joined,
                })
            
            return Response({
                'success': True,
                'producers': data,
                'total': len(data)
            })
        except Exception as e:
            import traceback
            print(traceback.format_exc())
            return Response(
                {'success': False, 'message': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AdminListStations(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if not is_admin(request.user):
            return Response(
                {'success': False, 'message': 'Admin access required'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            from battery.models import Station
            
            stations = Station.objects.select_related(
                'owner__user', 'owner__company'
            ).prefetch_related('batteries').all()
            
            data = []
            for s in stations:
                data.append({
                    'pk': s.pk,
                    'name': s.name,
                    'latitude': s.latitude,
                    'longitude': s.longitude,
                    'total_batteries': s.batteries.count(),
                    'owner_name': s.owner.user.name if s.owner else '—',
                    'owner_company': s.owner.company.name if s.owner and s.owner.company else '—',
                })
            
            return Response({
                'success': True,
                'stations': data,
                'total': len(data)
            })
        except Exception as e:
            import traceback
            print(traceback.format_exc())
            return Response(
                {'success': False, 'message': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AdminListBookings(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if not is_admin(request.user):
            return Response(
                {'success': False, 'message': 'Admin access required'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            orders = Order.objects.select_related(
                'battery__vehicle',
                'battery__company',
                'station',
                'station__owner__user',
            ).order_by('-booked_time')[:100]
            
            data = []
            for o in orders:
                data.append({
                    'pk': o.pk,
                    'station_name': o.station.name if o.station else '—',
                    'producer_name': o.station.owner.user.name if o.station and o.station.owner else '—',
                    'vehicle': o.battery.vehicle.name if o.battery and o.battery.vehicle else '—',
                    'price': o.battery.price if o.battery else 0,
                    'is_paid': o.is_paid,
                    'is_collected': o.is_collected,
                    'booked_time': o.booked_time,
                })
            
            return Response({
                'success': True,
                'bookings': data,
                'total': len(data)
            })
        except Exception as e:
            import traceback
            print(traceback.format_exc())
            return Response(
                {'success': False, 'message': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
