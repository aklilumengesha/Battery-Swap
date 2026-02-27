"""
Script to add sample stations, companies, and batteries
Run with: Get-Content add_sample_data.py | python manage.py shell
"""
from battery.models import Vehicle, Battery, Station
from producer.models import Company

# Create sample companies
companies_data = [
    "Tesla Energy",
    "Panasonic",
    "LG Energy Solution",
    "CATL",
    "BYD",
]

print("Creating companies...")
for company_name in companies_data:
    company, created = Company.objects.get_or_create(name=company_name)
    if created:
        print(f"Created: {company_name}")
    else:
        print(f"Already exists: {company_name}")

# Create sample stations
stations_data = [
    {"name": "Downtown Charging Hub", "latitude": 10.0484417, "longitude": 76.3310651},
    {"name": "Airport Battery Station", "latitude": 10.1527, "longitude": 76.3934},
    {"name": "Mall Road Station", "latitude": 10.0261, "longitude": 76.3125},
    {"name": "Tech Park Swap Center", "latitude": 10.0889, "longitude": 76.3478},
    {"name": "Beach Side Station", "latitude": 9.9312, "longitude": 76.2673},
]

print("\nCreating stations...")
for station_data in stations_data:
    station, created = Station.objects.get_or_create(
        name=station_data["name"],
        defaults={
            "latitude": station_data["latitude"],
            "longitude": station_data["longitude"],
        }
    )
    if created:
        print(f"Created: {station_data['name']}")
    else:
        print(f"Already exists: {station_data['name']}")

# Create batteries for each vehicle and company combination
print("\nCreating batteries...")
vehicles = Vehicle.objects.all()
companies = Company.objects.all()
stations = Station.objects.all()

battery_count = 0
for vehicle in vehicles[:5]:  # First 5 vehicles
    for company in companies[:3]:  # First 3 companies
        battery, created = Battery.objects.get_or_create(
            vehicle=vehicle,
            company=company,
            defaults={"price": 500.0 + (battery_count * 50)}
        )
        if created:
            battery_count += 1
            # Add battery to random stations
            for station in stations[:3]:
                station.batteries.add(battery)
                station.save()
            print(f"Created: {company.name}'s battery for {vehicle.name}")

print(f"\nSummary:")
print(f"Total companies: {Company.objects.count()}")
print(f"Total stations: {Station.objects.count()}")
print(f"Total batteries: {Battery.objects.count()}")
print(f"Total vehicles: {Vehicle.objects.count()}")
