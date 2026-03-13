from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from .managers import CustomUserManager


class User(AbstractUser):
    """
    Custom User model extending Django's AbstractUser.
    Keeps all existing fields and adds avatar and last_active.
    """
    USER_TYPE_CHOICES = [
        ("consumer", "Consumer"),
        ("producer", "Producer"),
        ("admin", "Admin"),
    ]

    # Existing fields from initial migration (already in database)
    name = models.CharField("Name", max_length=100)
    email = models.EmailField("Email", max_length=100, unique=True)
    username = models.CharField("Username", max_length=100, unique=True)
    phone = models.CharField("Phone", max_length=11, null=True)
    user_type = models.CharField("User Type", max_length=10)
    is_active = models.BooleanField(default=True)
    is_email_verified = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    orders = models.ManyToManyField(
        "Order", related_name="Orders", blank=True
    )
    
    # NEW fields to be added by migration
    avatar = models.ImageField(
        upload_to="avatars/",
        blank=True,
        null=True,
        verbose_name="profile picture",
    )
    last_active = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="last active",
    )

    # Use email as username field
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]
    
    # Override with custom manager
    objects = CustomUserManager()

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"

    def __str__(self):
        return self.email

    def get_full_name(self):
        return self.name

    def get_short_name(self):
        return self.name.split()[0] if self.name else self.email


# Alias for backwards compatibility
CustomUser = User


class Order(models.Model):
    battery = models.ForeignKey("battery.Battery", on_delete=models.CASCADE)
    station = models.ForeignKey("battery.Station", on_delete=models.CASCADE)
    is_paid = models.BooleanField("Is paid by user", default=False)
    is_collected = models.BooleanField("Is collected by user", default=False)
    booked_time = models.DateTimeField("Order booked at", auto_now_add=True)
    expiry_time = models.DateTimeField("Order expires on")

    class Meta:
        verbose_name = "Order"
        verbose_name_plural = "Orders"

    def __str__(self):
        return f"{self.battery} from {self.station.name}"
