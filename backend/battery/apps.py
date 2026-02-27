from django.apps import AppConfig


class BatteryConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'battery'

    def ready(self):
        """
        Import signals when the app is ready.
        This ensures signals are registered when Django starts.
        """
        import battery.signals  # noqa
