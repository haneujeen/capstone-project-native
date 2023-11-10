from django.conf import settings
from rest_framework.decorators import api_view
import requests
from rest_framework.response import Response
from urllib.parse import unquote

OGD_API_KEY = unquote(settings.OGD_API_KEY)

def _build_response(is_valid, message, status_code, **kwargs):
    response = {
        'is_valid': is_valid,
        'message': message,
    }
    response.update(kwargs)
    return Response(response, status=status_code)

@api_view(['GET'])
def get_stations(request, query):
    url = 'http://ws.bus.go.kr/api/rest/stationinfo/getStationByName'

    params = {
        'serviceKey': OGD_API_KEY,
        'stSrch': query,
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
                'ars_id': item['arsId'],
                'type': 'bus',
            }
            stations.append(station_item)

        ## fetching direction from other api
        url = 'http://ws.bus.go.kr/api/rest/stationinfo/getStationByUid'
        for station in stations:
            ars_id = station['ars_id']
            params = {
                'serviceKey': OGD_API_KEY,
                'arsId': ars_id,
                'resultType': 'json'
            }
            response = requests.get(url, params=params)
            data = response.json()['msgBody']['itemList']

            if response.json()['msgHeader']['headerCd'] == '0':
                station['direction'] = data[0]['nxtStn']

        return _build_response(True, response.json()['msgHeader']['headerMsg'], 200, list=stations)
    else:
        station_response = {
            'is_valid': False,
            'response_code': '202',
            'message': response.json()['msgHeader']['headerMsg'],
        }
        return _build_response(False, response.json()['msgHeader']['headerMsg'], 202)


@api_view(['GET'])
def get_arrivals(request, id):
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
                'current_station': item['stationNm1'],
                'screen_message': item['arrmsg1'],
                'is_last': item['isLast1'],
                'is_full': item['isFullFlag1'],
                'color': item['busType1'],
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

        return _build_response(True, response.json()['msgHeader']['headerMsg'], 200, list=stations)
    else:
        station_response = {
            'is_valid': False,
            'response_code': response.json()['msgHeader']['headerCd'],
            'message': response.json()['msgHeader']['headerMsg'],
        }
        return _build_response(False, response.json()['msgHeader']['headerMsg'], 404)

    return Response(station_response)



