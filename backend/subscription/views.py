from rest_framework import generics, views, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from subscription.models import SubscriptionPlan, UserSubscription
from subscription.serializers import (
    SubscriptionPlanSerializer,
    UserSubscriptionSerializer,
    SubscribeSerializer
)


class ListSubscriptionPlans(generics.ListAPIView):
    """
    GET /api/plans/
    List all active subscription plans
    """
    serializer_class = SubscriptionPlanSerializer
    queryset = SubscriptionPlan.objects.filter(is_active=True)
    permission_classes = []  # Public endpoint


class SubscribeView(views.APIView):
    """
    POST /api/subscribe/
    Create a new subscription for the authenticated user
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = SubscribeSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            subscription = serializer.save()
            response_serializer = UserSubscriptionSerializer(subscription)
            
            return Response(
                {
                    'success': True,
                    'message': 'Subscription created successfully',
                    'subscription': response_serializer.data
                },
                status=status.HTTP_201_CREATED
            )
        
        return Response(
            {
                'success': False,
                'message': 'Subscription creation failed',
                'errors': serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )


class MySubscriptionView(views.APIView):
    """
    GET /api/my-subscription/
    Get current user's active subscription
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            subscription = UserSubscription.objects.filter(
                user=request.user,
                is_active=True
            ).select_related('plan').first()

            if subscription:
                serializer = UserSubscriptionSerializer(subscription)
                return Response(
                    {
                        'success': True,
                        'subscription': serializer.data
                    },
                    status=status.HTTP_200_OK
                )
            
            return Response(
                {
                    'success': False,
                    'message': 'No active subscription found'
                },
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {
                    'success': False,
                    'message': str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
