from rest_framework import serializers
from django.utils import timezone
from dateutil.relativedelta import relativedelta
from subscription.models import SubscriptionPlan, UserSubscription


class SubscriptionPlanSerializer(serializers.ModelSerializer):
    """
    Serializer for subscription plans
    """
    class Meta:
        model = SubscriptionPlan
        fields = [
            'id',
            'name',
            'price',
            'swap_limit_per_month',
            'priority_support',
            'is_active',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class UserSubscriptionSerializer(serializers.ModelSerializer):
    """
    Serializer for user subscriptions
    """
    plan_details = SubscriptionPlanSerializer(source='plan', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    is_expired = serializers.SerializerMethodField()

    class Meta:
        model = UserSubscription
        fields = [
            'id',
            'user',
            'user_email',
            'plan',
            'plan_details',
            'start_date',
            'end_date',
            'is_active',
            'is_expired',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'user', 'start_date', 'end_date', 'created_at', 'updated_at']

    def get_is_expired(self, obj):
        return obj.is_expired()


class SubscribeSerializer(serializers.Serializer):
    """
    Serializer for subscription creation
    """
    plan_id = serializers.IntegerField(required=True)
    duration_months = serializers.IntegerField(
        default=1,
        min_value=1,
        max_value=12,
        help_text="Subscription duration in months (1-12)"
    )

    def validate_plan_id(self, value):
        """Validate that plan exists and is active"""
        try:
            plan = SubscriptionPlan.objects.get(id=value)
            if not plan.is_active:
                raise serializers.ValidationError("This subscription plan is not currently available")
            return value
        except SubscriptionPlan.DoesNotExist:
            raise serializers.ValidationError("Subscription plan not found")

    def create(self, validated_data):
        """Create a new user subscription"""
        user = self.context['request'].user
        plan_id = validated_data['plan_id']
        duration_months = validated_data.get('duration_months', 1)

        # Deactivate any existing active subscriptions
        UserSubscription.objects.filter(
            user=user,
            is_active=True
        ).update(is_active=False)

        # Create new subscription
        plan = SubscriptionPlan.objects.get(id=plan_id)
        start_date = timezone.now()
        end_date = start_date + relativedelta(months=duration_months)

        subscription = UserSubscription.objects.create(
            user=user,
            plan=plan,
            start_date=start_date,
            end_date=end_date,
            is_active=True
        )

        return subscription
