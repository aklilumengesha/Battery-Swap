"""
Script to check database data
Run with: Get-Content check_data.py | python manage.py shell
"""
from battery.models import Vehicle, Battery, Station
from producer.models import Company
from user.models import User
from consumer.models import Consumer

print("=== DATABASE SUMMARY ===\n")
print(f"Vehicles: {Vehicle.objects.count()}")
for v in Vehicle.objects.all():
    print(f"  - {v.name}")

print(f"\nCompanies: {Company.objects.count()}")
for c in Company.objects.all():
    print(f"  - {c.name}")

print(f"\nStations: {Station.objects.count()}")
for s in Station.objects.all():
    print(f"  - {s.name} ({s.batteries.count()} batteries)")

print(f"\nBatteries: {Battery.objects.count()}")

print(f"\nUsers: {User.objects.count()}")
for u in User.objects.all():
    print(f"  - {u.email} ({u.user_type})")

print(f"\nConsumers: {Consumer.objects.count()}")
