import datetime
from rest_framework import views, status, generics
from rest_framework.response import Response

from django.contrib.auth import authenticate, login
from user.models import Order, User
from consumer.models import Consumer
from producer.models import Company, Producer
from battery.models import Battery, Station, Vehicle


from user.serializers import SignupSerializer, UserSerializer
from user.utils import generate_token_pairs, get_order_data


class ManageUsers(generics.ListCreateAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()


class ManageUser(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()


class SignInView(views.APIView):
    def post(self, request, *args, **kwargs):
        data = request.data
        user = authenticate(
            username=data.get("email", None), password=data.get("password", None)
        )
        if user is not None:
            # if user.is_email_verified:
            login(request, user)
            meta_data = {}
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
