#!/bin/bash
# Comprehensive setup script for admin and sample data

echo "========================================="
echo "Battery Swap Admin & Data Setup"
echo "========================================="
echo ""

# Step 1: Delete existing superusers
echo "Step 1: Removing existing superusers..."
python manage.py shell -c "from user.models import User; count = User.objects.filter(is_superuser=True).count(); User.objects.filter(is_superuser=True).delete(); print(f'Deleted {count} superuser(s)')"
echo ""

# Step 2: Create new superuser
echo "Step 2: Creating new superuser..."
echo "Please enter the following details:"
python manage.py createsuperuser
echo ""

# Step 3: Add sample vehicles
echo "Step 3: Adding sample vehicles..."
python manage.py shell < add_sample_vehicles.py
echo ""

echo "========================================="
echo "Setup Complete!"
echo "========================================="
echo "You can now:"
echo "1. Login to admin panel at: http://localhost:8000/admin"
echo "2. Add batteries and stations through the admin panel"
echo "3. Test the frontend signup with available vehicles"
