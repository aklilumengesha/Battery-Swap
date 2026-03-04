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
            user = request.user
            
            # Update name if provided
            name = request.data.get("name")
            if name is not None:
                user.name = name
            
            # Update phone if provided
            phone = request.data.get("phone")
            if phone is not None:
                user.phone = phone
            
            user.save()
            
            # Update vehicle only if provided
            vehicle_id = request.data.get("vehicle")
            if vehicle_id is not None:
                try:
                    consumer = Consumer.objects.get(user=user)
                    consumer.vehicle = Vehicle.objects.get(pk=vehicle_id)
                    consumer.save()
                except (Consumer.DoesNotExist, Vehicle.DoesNotExist):
                    pass  # Skip vehicle update silently
            
            return Response(
                {
                    "success": True,
                    "message": "Profile updated successfully",
                    "user": {
                        "name": user.name,
                        "email": user.email,
                        "phone": user.phone,
                        "user_type": user.user_type,
                    }
                },
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {
                    "success": False,
                    "message": str(e)
                },
                status=status.HTTP_400_BAD_REQUEST
            )

    def patch(self, request, *args, **kwargs):
        return self.put(request, *args, **kwargs)

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
