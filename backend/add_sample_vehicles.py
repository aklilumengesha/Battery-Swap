"""
Script to add sample vehicles to the database
Run with: python manage.py shell < add_sample_vehicles.py
"""
from battery.models import Vehicle

# Sample vehicles
vehicles = [
    "Tesla Model 3",
    "Tesla Model S",
    "Nissan Leaf",
    "Chevrolet Bolt",
    "BMW i3",
    "Hyundai Kona Electric",
    "Kia EV6",
    "Ford Mustang Mach-E",
    "Volkswagen ID.4",
    "Audi e-tron",
]

created_count = 0
for vehicle_name in vehicles:
    vehicle, created = Vehicle.objects.get_or_create(name=vehicle_name)
    if created:
        created_count += 1
        print(f"Created: {vehicle_name}")
    else:
        print(f"Already exists: {vehicle_name}")

print(f"\nTotal vehicles created: {created_count}")
print(f"Total vehicles in database: {Vehicle.objects.count()}")
