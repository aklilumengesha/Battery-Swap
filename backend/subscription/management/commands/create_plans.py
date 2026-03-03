"""
Django management command to create subscription plans
Run with: python manage.py create_plans
"""

from django.core.management.base import BaseCommand
from subscription.models import SubscriptionPlan


class Command(BaseCommand):
    help = 'Create default subscription plans'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Creating subscription plans...'))
        
        # Create Basic Plan
        basic_plan, created = SubscriptionPlan.objects.get_or_create(
            name="Basic",
            defaults={
                'price': 9.99,
                'swap_limit_per_month': 10,
                'priority_support': False,
                'is_active': True
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f'✓ Created: {basic_plan}'))
        else:
            self.stdout.write(self.style.WARNING(f'Already exists: {basic_plan}'))

        # Create Standard Plan
        standard_plan, created = SubscriptionPlan.objects.get_or_create(
            name="Standard",
            defaults={
                'price': 19.99,
                'swap_limit_per_month': 30,
                'priority_support': False,
                'is_active': True
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f'✓ Created: {standard_plan}'))
        else:
            self.stdout.write(self.style.WARNING(f'Already exists: {standard_plan}'))

        # Create Premium Plan
        premium_plan, created = SubscriptionPlan.objects.get_or_create(
            name="Premium",
            defaults={
                'price': 39.99,
                'swap_limit_per_month': 100,
                'priority_support': True,
                'is_active': True
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f'✓ Created: {premium_plan}'))
        else:
            self.stdout.write(self.style.WARNING(f'Already exists: {premium_plan}'))

        # Create Unlimited Plan
        unlimited_plan, created = SubscriptionPlan.objects.get_or_create(
            name="Unlimited",
            defaults={
                'price': 99.99,
                'swap_limit_per_month': 999,
                'priority_support': True,
                'is_active': True
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f'✓ Created: {unlimited_plan}'))
        else:
            self.stdout.write(self.style.WARNING(f'Already exists: {unlimited_plan}'))

        total = SubscriptionPlan.objects.filter(is_active=True).count()
        self.stdout.write(self.style.SUCCESS(f'\n✅ Subscription plans setup complete!'))
        self.stdout.write(self.style.SUCCESS(f'Total active plans: {total}'))
