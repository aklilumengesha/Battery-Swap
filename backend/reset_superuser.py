"""
Script to delete existing superuser and create a new one
Run with: python manage.py shell < reset_superuser.py
"""
from user.models import CustomUser

# Delete all superusers
superusers = CustomUser.objects.filter(is_superuser=True)
count = superusers.count()
superusers.delete()
print(f"Deleted {count} superuser(s)")

# Create new superuser
email = input("Enter superuser email: ")
name = input("Enter superuser name: ")
password = input("Enter superuser password: ")

CustomUser.objects.create_superuser(name=name, email=email, password=password)
print(f"New superuser created: {email}")
