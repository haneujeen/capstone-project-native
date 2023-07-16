from django.core.management.base import BaseCommand
from ...utils import populate_subway_stations


class Command(BaseCommand):
    help = 'Populate subway stations from the API'

    def handle(self, *args, **options):
        result = populate_subway_stations()
        if "Error occurred" in result:
            self.stdout.write(self.style.ERROR(result))
        else:
            self.stdout.write(self.style.SUCCESS(result))
