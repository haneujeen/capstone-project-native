import requests
from django.core.management.base import BaseCommand
from django.conf import settings
from urllib.parse import unquote
from openapi_seoul_service.models import SubwayStation

SEOUL_API_KEY = unquote(settings.SEOUL_API_KEY)

class Command(BaseCommand):
    help = 'Update station facilities information'

    def handle(self, *args, **options):
        url = f"http://openapi.seoul.go.kr:8088/{SEOUL_API_KEY}/json/subwayTourInfo/1/457/"

        try:
            response = requests.get(url)
            data = response.json()

            if 'subwayTourInfo' in data:
                data = data['subwayTourInfo']['row']

                for item in data:
                    self.stdout.write(f"Adding info for {item['STATION']}")

                    accessibility_info = item['ELEVATER_TXT'].replace('\r\r\r\n\r\r\r\n', ' ') if item.get('ELEVATER_TXT') else 'No information provided'
                    poi_locator = item['EXIT_INFO'].replace(' ||', '').replace('||,', ' ').replace('||', '').replace('@', '(exit) ') if item.get('EXIT_INFO') else 'No locator information provided'

                    stations = SubwayStation.objects.filter(name__icontains=item['STATION'])
                    for station in stations:
                        station.accessibility_information = accessibility_info
                        station.POI_locator = poi_locator
                        station.save()

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error occurred: {e}'))
