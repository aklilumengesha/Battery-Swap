from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone
from .managers import CustomUserManager


class CustomUser(AbstractBaseUser, PermissionsMixin):
    USER_TYPE_CHOICES = [
        ("consumer", "Consumer"),
        ("producer", "Producer"),
        ("admin", "Admin"),
    ]

    email = models.EmailField(
        unique=True,
        verbose_name="email address",
    )
    name = models.CharField(
        max_length=150,
        verbose_name="full name",
    )
    phone = models.CharField(
        max_length=20,
        blank=True,
        verbose_name="phone number",
    )
    avatar = models.ImageField(
        upload_to="avatars/",
        blank=True,
        null=True,
        verbose_name="profile picture",
    )
    user_type = models.CharField(
        max_length=20,
        choices=USER_TYPE_CHOICES,
        default="consumer",
        verbose_name="user type",
    )
    is_active = models.BooleanField(default=True, verbose_name="active")
    is_staff = models.BooleanField(default=False, verbose_name="staff status")
    date_joined = models.DateTimeField(default=timezone.now, verbose_name="date joined")
    last_active = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="last active",
    )

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]

    class Meta:
        verbose_name = "user"
        verbose_name_plural = "users"
        db_table = "users"

    def __str__(self):
        return self.email

    def get_full_name(self):
        return self.name

    def get_short_name(self):
        return self.name.split()[0] if self.name else self.email


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
