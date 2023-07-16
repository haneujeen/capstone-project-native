import requests
from django.conf import settings
from urllib.parse import unquote
from .models import SubwayStation

SWOPENAPI_KEY = unquote(settings.SWOPENAPI_KEY)


def populate_subway_stations():
    url = f"http://swopenAPI.seoul.go.kr/api/subway/{SWOPENAPI_KEY}/json/realtimeStationArrival/ALL"
    try:
        response = requests.get(url)
        data = response.json()

        if 'realtimeArrivalList' in data:
            data = response.json()['realtimeArrivalList']

            current_count = SubwayStation.objects.all().count()

            # Create the stations
            for item in data:
                SubwayStation.objects.update_or_create(
                    station_id=item['statnId'],
                    direction=item['updnLine'],
                    defaults={
                        'name': item['statnNm'],
                        'line': item['subwayId'],
                        'transfer_available': [int(i) for i in item['subwayList'].split(',')]
                    }
                )

            # Set the next_station
            for item in data:
                try:
                    next_station = SubwayStation.objects.get(station_id=item['statnTid'], direction=item['updnLine'],
                                                             line=item['subwayId'])
                except SubwayStation.DoesNotExist:
                    next_station = None

                if next_station:
                    station = SubwayStation.objects.get(station_id=item['statnId'], direction=item['updnLine'])
                    station.next_station = next_station
                    station.save()

            count = SubwayStation.objects.all().count()
            return f'{count - current_count} SubwayStation object(s) added.'

    except Exception as e:
        return f'Error occurred: {e}'
