from django.conf import settings
from rest_framework.decorators import api_view
import requests
from rest_framework.response import Response
from openai_api_service import api
from urllib.parse import unquote

OGD_API_KEY = unquote(settings.OGD_API_KEY)


@api_view(['GET'])
def get_stations(request, query):
    url = 'http://ws.bus.go.kr/api/rest/stationinfo/getStationByName'

    params = {
        'serviceKey': OGD_API_KEY,
        'stSrch': query,
        'resultType': 'json'
    }
    response = requests.get(url, params=params)

    if response.json()['msgHeader']['headerCd'] == '4':
        print("No station found, try processing natural language")
        text = api.process_query(query)
        params['stSrch'] = text
        response = requests.get(url, params=params)

    if response.json()['msgHeader']['headerCd'] == '0':
        data = response.json()['msgBody']['itemList']

        stations = []

        for item in data:
            station_item = {
                'id': item['stId'],
                'name': item['stNm'],
                'ars_id': item['arsId'],
                'type': 'bus',
            }
            stations.append(station_item)

        station_response = {
            'is_valid': True,
            'response_code': response.json()['msgHeader']['headerCd'],
            'message': response.json()['msgHeader']['headerMsg'],
            'list': stations
        }
    else:
        station_response = {
            'is_valid': False,
            'response_code': '202',
            'message': response.json()['msgHeader']['headerMsg'],
        }

    return Response(station_response)


@api_view(['GET'])
def get_bus_arrivals(request, id):
    url = 'http://ws.bus.go.kr/api/rest/stationinfo/getStationByUid'

    params = {
        'serviceKey': OGD_API_KEY,
        'arsId': id,
        'resultType': 'json'
    }
    response = requests.get(url, params=params)

    data = response.json()['msgBody']['itemList']

    if response.json()['msgHeader']['headerCd'] == '0':
        arrivals = []

        for item in data:
            arrival_item = {
                'id': item['vehId1'],
                'route_id': item['busRouteId'],
                'name': item['busRouteAbrv'],
                'screen_message': item['arrmsg1'],
                'car_type': 'bus',
            }
            arrivals.append(arrival_item)

        arrival_response = {
            'is_valid': True,
            'response_code': response.json()['msgHeader']['headerCd'],
            'message': response.json()['msgHeader']['headerMsg'],
            'list': arrivals
        }
    else:
        arrival_response = {
            'is_valid': False,
            'response_code': response.json()['msgHeader']['headerCd'],
            'message': response.json()['msgHeader']['headerMsg'],
        }

    return Response(arrival_response)


@api_view(['GET'])
def get_stations_on_route(request, id):
    url = 'http://ws.bus.go.kr/api/rest/arrive/getArrInfoByRouteAll'

    params = {
        'serviceKey': OGD_API_KEY,
        'busRouteId': id,
        'resultType': 'json'
    }
    response = requests.get(url, params=params)

    if response.json()['msgHeader']['headerCd'] == '0':
        data = response.json()['msgBody']['itemList']

        stations = []

        for item in data:
            station_item = {
                'id': item['stId'],
                'name': item['stNm'],
                'number': item['arsId'],
                'type': 'bus',
            }
            stations.append(station_item)

        station_response = {
            'is_valid': True,
            'response_code': response.json()['msgHeader']['headerCd'],
            'message': response.json()['msgHeader']['headerMsg'],
            'list': stations
        }
    else:
        station_response = {
            'is_valid': False,
            'response_code': response.json()['msgHeader']['headerCd'],
            'message': response.json()['msgHeader']['headerMsg'],
        }

    return Response(station_response)



