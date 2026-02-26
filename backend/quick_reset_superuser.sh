#!/bin/bash
# Quick script to reset superuser

echo "Deleting existing superusers..."
python manage.py shell -c "from user.models import User; User.objects.filter(is_superuser=True).delete(); print('Superusers deleted')"

echo "Creating new superuser..."
python manage.py createsuperuser
