"""
NOTE: The API does not provide a consistent response format. The structure of the response may vary depending on whether
the API call was successful or not:

If serviceNameFromUrl is present in the data, the call was successful and response data consists of errorMessage and
serviceNameFromUrl objects:

    item = data['serviceNameUrl']
    response_status_data = data['errorMessage']

If serviceNameFromUrl is not in the data, this means the response indicates an error:

    response_status_data = data

NOTE: The API used in the `get_stations` view does not return station data the station data when there are no trains
arriving at the station. `_build_error_response()` helper function is used in order to handle the given the constraints
of the API during off-service hours.
"""
from django.conf import settings
from rest_framework.decorators import api_view
import requests
from rest_framework.response import Response
from urllib.parse import unquote

SEOUL_API_KEY = unquote(settings.SEOUL_API_KEY)
SWOPENAPI_KEY = unquote(settings.SWOPENAPI_KEY)

BASE_URL_SEOUL = f"http://openapi.seoul.go.kr:8088/{SEOUL_API_KEY}/json"
BASE_URL_SWOPENAPI = f"http://swopenapi.seoul.go.kr/api/subway/{SWOPENAPI_KEY}/json"


def _get_station_names(search_text):
    url = f"{BASE_URL_SEOUL}/SearchSTNBySubwayLineInfo/1/1/%20/{search_text}/%20"
    response = requests.get(url)
    data = response.json()

    if 'SearchSTNBySubwayLineInfo' in data:
        index = data['SearchSTNBySubwayLineInfo']['list_total_count']
        url = f"{BASE_URL_SEOUL}/SearchSTNBySubwayLineInfo/1/{index}/%20/{search_text}/%20"
        response = requests.get(url)
        data = response.json()['SearchSTNBySubwayLineInfo']

        names = []
        for item in data['row']:
            name_item = {
                'name': item['STATION_NM'],
                'line': {
                    'name': item['LINE_NUM'],
                },
                'fr_code': item['FR_CODE'],
            }
            names.append(name_item)

        return names

    elif 'RESULT' in data:
        raise Exception(data['RESULT']['MESSAGE'])

    else:
        raise Exception("Unexpected response")


def _get_station_arrivals(stations_dict, item):
    station_id = item['statnId']
    next_station = item['trainLineNm'].split(' - ')[1][:-2]
    key = (station_id, next_station)

    if key not in stations_dict:
        stations_dict[key] = {
            'station': {
                'id': station_id,
                'name': item['statnNm'],
                'line': item['subwayId'],
                'next_station': next_station,
                'type': 'subway',
            },
            'train': [],
        }

    train_item = {
        'number': item['btrainNo'],
        'stations_left': item['ordkey'][2:5],
        'stops_at': item['bstatnNm'],
        'screen_message': item['arvlMsg2'],
        'current_station': item['arvlMsg3'],
        'is_arrived': item['arvlCd'],
        'type': 'subway',
    }

    stations_dict[key]['train'].append(train_item)
    return stations_dict


def _build_error_response(names, message, url):
    station_response = {
        'is_valid': False,
        'response_code': '202',
        'message': {
            'message': message,
            'station_result': names,
            'train_message': "This is the off-service hours. There are no trains arriving at the stations: ",
            'station_message': f"There are no matching stations found from the endpoint {url}",
        },
    }
    return station_response


def _build_station_response(stations_dict, message):
    station_response = {
        'is_valid': True,
        'response_code': '0',
        'message': message,
        'list': list(stations_dict.values())
    }
    return station_response


def _build_response(is_valid, response_code, message, **kwargs):
    response = {
        'is_valid': is_valid,
        'response_code': response_code,
        'message': message,
    }
    response.update(kwargs)
    return Response(response)


"""
Fetch data for all stations and the trains arriving at each station:
    - Retrieve stations based on provided search text.
    - For each station, request arrival data for the trains.
    - Return station data if available, an error response otherwise.
"""
@api_view(['GET'])
def get_stations(request, search_text):
    try:
        names = _get_station_names(search_text)
        stations_dict = {}

        for name_item in names:
            name = name_item['name']
            url = f"{BASE_URL_SWOPENAPI}/realtimeStationArrival/0/1/{name}"
            response = requests.get(url)
            data = response.json()

            if 'realtimeArrivalList' in data:
                total = data['errorMessage']['total']
                message = data['errorMessage']['message']
                url = f"{BASE_URL_SWOPENAPI}/realtimeStationArrival/0/{total}/{name}"
                response = requests.get(url)
                station_arrivals = response.json()['realtimeArrivalList']

                for item in station_arrivals:
                    stations_dict = _get_station_arrivals(stations_dict, item)

                return _build_response(True, '0', message, list=list(stations_dict.values()))

            else:
                return _build_error_response(names, data['message'], url)

    except Exception as e:
        print(f"Exception occurred: {e}")
        return Response({"error": str(e)}, status=500)


def _get_initial_train(number, data):
    # `is_arrived` == 0:진입, 1:도착, 2:출발, 99:운행중
    for item in data:
        if item['btrainNo'] == str(number):
            return {
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
    return None


def _fetch_previous_next_stations(train_response, data):
    if train_response is None:
        return

    for item in data:
        if item['statnNm'] == train_response['current_station']['name'] \
                and item['subwayId'] == train_response['line'] \
                and item['updnLine'] == train_response['direction']:
            train_response['current_station']['id'] = item['statnId']
            train_response['previous_station']['id'] = item['statnFid']
            train_response['next_station']['id'] = item['statnTid']

    for item in data:
        if item['statnId'] == str(train_response['previous_station']['id']):
            train_response['previous_station']['name'] = item['statnNm']

        if item['statnId'] == str(train_response['next_station']['id']):
            train_response['next_station']['name'] = item['statnNm']


"""
Fetch data for a specific train and its current location::
    - If the realtimeArrivalList exists in the data, find a specific train and and populate `train_response` with the 
    train's data.
    - Find IDs for the current, previous, and next stations.
    - Retrieve the names of the previous and next stations.
    - Return train_response if it exists, an error response otherwise.
"""
@api_view(['GET'])
def get_train(request, number):
    url = f"{BASE_URL_SWOPENAPI}/realtimeStationArrival/ALL"
    try:
        response = requests.get(url)
        data = response.json()

        if 'realtimeArrivalList' in data:
            data = response.json()['realtimeArrivalList']
            message = response.json()['errorMessage']['message']

            train_response = _get_initial_train(number, data)

            if train_response:
                _fetch_previous_next_stations(train_response, data)
                return _build_response(True, '0', message, train=train_response)
            else:
                return _build_response(False, '502', message)

        else:
            return _build_response(False, '202', data['message'])

    except Exception as e:
        print(f"Exception occurred: {e}")
        return Response({"error": str(e)}, status=500)


def _get_station_ids(name, line, direction, stops_at, data):
    start_id, start_name, end_id, end_name = None, '', None, ''
    for item in data:
        if item['statnNm'] == name and item['subwayId'] == line \
                and item['updnLine'] == direction:
            start_id, start_name = item['statnId'], item['statnNm']

        if item['statnNm'] == stops_at and item['subwayId'] == line \
                and item['updnLine'] == direction:
            end_id, end_name = item['statnId'], item['statnNm']

        return start_id, start_name, end_id, end_name
    return list(range(int(start_id) + 1, int(end_id))) if int(end_id) > int(start_id) else list(range(int(start_id) - 1, int(end_id), -1))


def _get_stations_on_route(station_ids, direction, data):
    # The API returns several same entries with the same ID, name, and direction
    # It's because entries are not only for the stations but also for the subway vehicles related somehow
    # The original response's "trainLineNm" field might help to understand
    stations_on_route_response = []
    i = 1
    for station_id in station_ids:
        for item in data:
            if item['statnId'] == str(station_id) and item['updnLine'] == direction:
                station_item = {
                    'index': i,
                    'id': station_id,
                    'name': item['statnNm']
                }
                stations_on_route_response.append(station_item)
                i += 1
                break
    return stations_on_route_response


"""
Fetch all stations along a specific train's route from the originating station (name) to the final station (stops_at):
    - If 'realtimeArrivalList' exists in the data, retrieve a list of station IDs along the route. The direction of ID 
    increment or decrement depends on the train's heading.
    - Fetch data for each station on the route.
    - Return stations_on_route_response if it exists, an error response otherwise.
"""
@api_view(['GET'])
def get_stations_on_route(request, name, line, direction, stops_at):
    url = f"{BASE_URL_SWOPENAPI}/realtimeStationArrival/ALL"

    try:
        response = requests.get(url)
        data = response.json()

        # WARN: API is not consistent in its response format
        if 'realtimeArrivalList' in data:
            data = response.json()['realtimeArrivalList']
            message = response.json()['errorMessage']['message']

            station_ids = _get_station_ids(name, line, direction, stops_at, data)
            stations_on_route_response = _get_stations_on_route(station_ids, direction, data)

            if stations_on_route_response:
                return _build_response(True, '0', message, list=stations_on_route_response)
            else:
                return _build_response(False, '502', 'I did something wrong with the code')

        else:
            return _build_response(False, '202', data['message'])

    except Exception as e:
        print(f"Exception occurred: {e}")
        return Response({"error": str(e)}, status=500)