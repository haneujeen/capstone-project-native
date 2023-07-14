import requests
from django.conf import settings
from django.core.management.base import BaseCommand
from openapi_seoul_service.models import SubwayStation
from urllib.parse import unquote

SWOPENAPI_KEY = unquote(settings.SWOPENAPI_KEY)

class Command(BaseCommand):
    help = 'Populate subway stations from the API'

    def handle(self, *args, **options):
        url = f"http://swopenAPI.seoul.go.kr/api/subway/{SWOPENAPI_KEY}/json/realtimeStationArrival/ALL"

        try:
            response = requests.get(url)
            data = response.json()

            if 'realtimeArrivalList' in data:
                data = response.json()['realtimeArrivalList']

                for item in data:
                    SubwayStation.objects.update_or_create(
                        id=item['statnId'],
                        defaults={
                            'name': item['statnNm'],
                            'direction': item['updnLine'],
                            'line': item['subwayId'],
                            'transfer_available': item['subwayList'].split(',')
                        }
                    )
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error occurred: {e}'))

