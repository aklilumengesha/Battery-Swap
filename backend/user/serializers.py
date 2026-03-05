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
    company_name = serializers.CharField(required=False, allow_null=True, allow_blank=True)

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
        
        # Create user type-specific profiles
        if validated_data["user_type"] == "consumer":
            vehicle_id = validated_data.get("vehicle")
            if vehicle_id:
                try:
                    vehicle = Vehicle.objects.get(pk=vehicle_id)
                    Consumer.objects.get_or_create(
                        user=user,
                        defaults={'vehicle': vehicle}
                    )
                except Vehicle.DoesNotExist:
                    print(f"Vehicle with pk={vehicle_id} does not exist")
                except Exception as e:
                    print(f"Error creating consumer profile: {e}")
            else:
                print("Warning: Consumer signup without vehicle")
        
        elif validated_data["user_type"] == "producer":
            # Handle company_name (string) or company (ID)
            company_name = validated_data.get("company_name")
            company_id = validated_data.get("company")
            
            try:
                if company_name:
                    # Create or get company by name
                    company, _ = Company.objects.get_or_create(
                        name=company_name.strip()
                    )
                elif company_id:
                    # Use existing company ID
                    company = Company.objects.get(pk=company_id)
                else:
                    # Default company if neither provided
                    company, _ = Company.objects.get_or_create(name="My Company")
                
                # Use get_or_create to avoid duplicates
                Producer.objects.get_or_create(
                    user=user,
                    defaults={'company': company}
                )
            except Exception as e:
                print(f"Error creating producer profile: {e}")
        
        return user

    class Meta:
        model = get_user_model()
        fields = ["name", "email", "vehicle", "company", "company_name", "password", "user_type"]
