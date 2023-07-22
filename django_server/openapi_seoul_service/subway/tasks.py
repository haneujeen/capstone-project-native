import httpx
import json
from django.conf import settings
from rest_framework.response import Response
from openapi_seoul_service.models import SubwayStation
from urllib.parse import unquote
from asgiref.sync import sync_to_async

SWOPENAPI_KEY = unquote(settings.SWOPENAPI_KEY)

BASE_URL_SWOPENAPI = f"http://swopenapi.seoul.go.kr/api/subway/{SWOPENAPI_KEY}/json"

async def get_train(number):
    url = "http://swopenAPI.seoul.go.kr/api/subway/6f455a4d7768616e36396770656573/json/realtimeStationArrival/ALL"
    get_subway_station = sync_to_async(SubwayStation.objects.get, thread_sensitive=True)

    async with httpx.AsyncClient() as client:
        response = await client.get(url)

        if response.is_redirect:
            url = response.headers["Location"]
            response = await client.get(url)
            data = response.json()
        if response.status_code != 200:
            print(f"Request failed with status code {response.status_code}")
            return None

    if 'realtimeArrivalList' in data:
        data = response.json()['realtimeArrivalList']

        train = {}
        for item in data:
            if item['btrainNo'] == str(number):
                train = {
                    'number': number,
                    'line': item['subwayId'],
                    'direction': item['updnLine'],
                    'current_station': {
                        'name': item['arvlMsg3'],
                    },
                    'previous_station': {},
                    'next_station': {},
                    'is_arrived': item['arvlCd'],
                    'stops_at': item['bstatnNm'],
                    'type': 'subway',
                }
        if train:
            for item in data:
                if item['statnNm'] == train['current_station']['name'] \
                        and item['subwayId'] == train['line'] \
                        and item['updnLine'] == train['direction']:
                    train['current_station']['id'] = item['statnId']
                    train['previous_station']['id'] = item['statnFid']
                    train['next_station']['id'] = item['statnTid']

                    try:
                        previous_station = await get_subway_station(station_id=item['statnFid'], line=item['subwayId'],
                                                                    direction=item['updnLine'])
                        next_station = await get_subway_station(station_id=item['statnTid'], line=item['subwayId'],
                                                                direction=item['updnLine'])

                        train['previous_station']['name'] = previous_station.name
                        train['next_station']['name'] = next_station.name
                    except SubwayStation.DoesNotExist:
                        train['previous_station']['name'] = None
                        train['next_station']['name'] = None

        print("sending train... ", train)
        return train

    else:
        print("Cannot detect any subway trains")
        return None

