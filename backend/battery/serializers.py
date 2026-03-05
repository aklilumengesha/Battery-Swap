from rest_framework import serializers
from battery.models import Battery, Station, Vehicle


class BatteryDetailSerializer(serializers.ModelSerializer):
    vehicle = serializers.SerializerMethodField()
    company = serializers.SerializerMethodField()
    
    class Meta:
        model = Battery
        fields = ['pk', 'vehicle', 'company', 'price']
    
    def get_vehicle(self, obj):
        if obj.vehicle:
            return {
                'pk': obj.vehicle.pk,
                'name': obj.vehicle.name
            }
        return None
    
    def get_company(self, obj):
        if obj.company:
            return {
                'pk': obj.company.pk,
                'name': obj.company.name
            }
        return None


class StationSerializer(serializers.ModelSerializer):
    batteries = BatteryDetailSerializer(many=True, read_only=True)
    
    class Meta:
        model = Station
        fields = ['pk', 'name', 'latitude', 'longitude', 'batteries', 'owner']
        read_only_fields = ['owner']


class FindStationSerializer(serializers.ModelSerializer):
    distance = serializers.SerializerMethodField()
    # distance = serializers.FloatField()
    # time = serializers.IntegerField()

    def get_distance(self, obj):
        return "89"

    class Meta:
        model = Station
        fields = ["pk", "name", "distance"]


class NewBatteriesSerializer(serializers.Serializer):
    class Meta:
        model = Station
        fields = ["batteries"]


class BatterySerializer(serializers.ModelSerializer):
    class Meta:
        model = Battery
        fields = ["pk", "vehicle", "company", "price"]


class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = ["pk", "name"]
