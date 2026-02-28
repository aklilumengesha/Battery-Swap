from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from battery.models import Vehicle
from consumer.models import Consumer
from user.models import User


class ManageConsumer(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        try:
            consumer = Consumer.objects.get(user=request.user)
            return Response(
                status=status.HTTP_200_OK,
                data={
                    "success": True,
                    "user": {
                        "name": consumer.user.name,
                        "phone": request.user.phone,
                        "vehicle": {
                            "pk": consumer.vehicle.pk,
                            "name": consumer.vehicle.name,
                        },
                    },
                },
            )
        except Consumer.DoesNotExist:
            return Response(
                status=status.HTTP_404_NOT_FOUND,
                data={
                    "success": False,
                    "message": "Consumer profile not found",
                },
            )

    def put(self, request, *args, **kwargs):
        try:
            consumer = Consumer.objects.get(user=request.user)
            user = User.objects.get(pk=request.user.pk)
            user.name = request.data.get("name")
            user.phone = request.data.get("phone")
            consumer.vehicle = Vehicle.objects.get(pk=request.data.get("vehicle"))
            user.save()
            consumer.save()
            return Response(status=status.HTTP_200_OK, data={"success": True})
        except Consumer.DoesNotExist:
            return Response(
                status=status.HTTP_404_NOT_FOUND,
                data={
                    "success": False,
                    "message": "Consumer profile not found",
                },
            )
        except Vehicle.DoesNotExist:
            return Response(
                status=status.HTTP_404_NOT_FOUND,
                data={
                    "success": False,
                    "message": "Vehicle not found",
                },
            )

    def delete(self, request, *args, **kwargs):
        try:
            consumer = Consumer.objects.get(user=request.user)
            user = User.objects.get(pk=request.user.pk)
            consumer.delete()
            user.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Consumer.DoesNotExist:
            return Response(
                status=status.HTTP_404_NOT_FOUND,
                data={
                    "success": False,
                    "message": "Consumer profile not found",
                },
            )
