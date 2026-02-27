from rest_framework import serializers
from django.contrib.auth import get_user_model

from battery.models import Vehicle
from producer.models import Company, Producer
from consumer.models import Consumer


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ["name", "email", "user_type", "pk"]


class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    vehicle = serializers.IntegerField(required=False, allow_null=True)
    company = serializers.IntegerField(required=False, allow_null=True)

    def create(self, validated_data, *args):
        print(args)
        user_data = {}
        user_data["name"] = validated_data["name"].title()
        user_data["username"] = validated_data["email"]
        user_data["email"] = validated_data["email"]
        user_data["user_type"] = validated_data["user_type"]
        user_data["password"] = validated_data["password"]
        user_data["is_active"] = True
        user = super().create(user_data)
        user.set_password(user.password)
        user.save()
        if validated_data["user_type"] == "consumer":
            try:
                vehicle_id = validated_data.get("vehicle")
                if not vehicle_id:
                    raise serializers.ValidationError({"vehicle": "Vehicle is required for consumers"})
                consumer = Consumer.objects.create(user=user)
                consumer.vehicle = Vehicle.objects.get(pk=vehicle_id)
                consumer.save()
            except Exception as e:
                print(e)
        elif validated_data["user_type"] == "producer":
            try:
                company_id = validated_data.get("company")
                if not company_id:
                    raise serializers.ValidationError({"company": "Company is required for producers"})
                producer = Producer.objects.create(user=user)
                producer.company = Company.objects.get(pk=company_id)
                producer.save()
            except Exception as e:
                print(e)
        return user

    class Meta:
        model = get_user_model()
        fields = ["name", "email", "vehicle", "company", "password", "user_type"]
