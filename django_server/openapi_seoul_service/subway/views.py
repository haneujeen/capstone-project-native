"""
NOTE: The API does not provide a consistent response format. The structure of the response may vary depending on whether
the API call was successful or not:

If serviceNameFromUrl is present in the data, the call was successful and response data consists of errorMessage and
serviceNameFromUrl objects:

    item = data['serviceNameUrl']
    response_status_data = data['errorMessage']

If serviceNameFromUrl is not in the data, this means the response indicates an error:

    response_status_data = data

Status Codes:
A status code of 200 is returned when the stations on the route are successfully retrieved.
A status code of 404 is returned when no stations are found on the route.
A status code of 202 is returned when there is an API error.
A status code of 500 is returned when an unexpected exception occurs.
"""
import requests
from django.conf import settings
from django.forms.models import model_to_dict
from rest_framework.decorators import api_view
from rest_framework.response import Response
from openapi_seoul_service.models import SubwayStation
from urllib.parse import unquote
from ..utils import populate_subway_stations

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

        names = set()
        for item in data['row']:
            names.add(item['STATION_NM'])

        return names

    elif 'RESULT' in data:
        raise Exception(data['RESULT']['MESSAGE'])

    else:
        raise Exception("Unexpected response")


def _build_response(is_valid, message, status_code, **kwargs):
    response = {
        'is_valid': is_valid,
        'message': message,
    }
    response.update(kwargs)
    return Response(response, status=status_code)


"""
Fetch data for all stations and the trains arriving at each station:
    - Retrieve stations based on provided search text from the db, if there's no station filtered, update the db.
    - For each station, request arrival data for the trains.
    - Return station data if available, an error response otherwise.
"""
@api_view(['GET'])
def get_stations(request, search_text):
    try:
        names = _get_station_names(search_text)
        station_arrivals = []
        for name in names:
            station_list = SubwayStation.objects.filter(name__icontains=name)
            if station_list:
                for station in station_list:
                    station_arrivals.append({
                        'station': model_to_dict(station),
                    })

        if not station_arrivals:
            populate_subway_stations()
            return _build_response(False, "Station data has been updated. Please try again.", 404,
                                   list=station_arrivals)

        for list_item in station_arrivals: # {'station': model_to_dict(station), 'train': {}}
            name = list_item['station']['name']
            url = f"{BASE_URL_SWOPENAPI}/realtimeStationArrival/0/1/{name}"
            response = requests.get(url)
            data = response.json()

            if 'realtimeArrivalList' in data:
                total = data['errorMessage']['total']
                message = data['errorMessage']['message']
                url = f"{BASE_URL_SWOPENAPI}/realtimeStationArrival/0/{total}/{name}"
                response = requests.get(url)
                arrivals_data = response.json()['realtimeArrivalList']

                for item in arrivals_data:
                    if item['statnId'] == str(list_item['station']['station_id']) \
                            and item['updnLine'] == list_item['station']['direction']:
                        list_item['train'] = {
                            'number': item['btrainNo'],
                            'stations_left': item['ordkey'][3:5],
                            'stops_at': item['bstatnNm'],
                            'screen_message_items': {
                                'to_where_in_which': item['trainLineNm'],
                                'message_item': item['arvlMsg2']
                            },
                            'current_station': item['arvlMsg3'],
                            'is_arrived': item['arvlCd'],
                            'type': 'subway',
                        }

                return _build_response(True, message, 200, list=station_arrivals)

            else:
                return _build_response(False, data['message'], 404, list=station_arrivals)

    except Exception as e:
        print(f"Exception occurred: {e}")
        return Response({"error": str(e)}, status=500)


def _get_initial_train(number, data):


def _fetch_previous_next_stations(train_response, data):


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

            train_response = {}
            for item in data:
                if item['btrainNo'] == str(number):
                    train_response = {
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

            if train_response:
                for item in data:
                    if item['statnNm'] == train_response['current_station']['name'] \
                            and item['subwayId'] == train_response['line'] \
                            and item['updnLine'] == train_response['direction']:
                        train_response['current_station']['id'] = item['statnId']
                        train_response['previous_station']['id'] = item['statnFid']
                        train_response['next_station']['id'] = item['statnTid']

                        try:
                            train_response['previous_station']['name'] = \
                                SubwayStation.objects.get(station_id=item['statnFid'], line=item['subwayId'], direction=item['updnLine']).name
                            train_response['next_station']['name'] = \
                                SubwayStation.objects.get(station_id=item['statnTid'], line=item['subwayId'], direction=item['updnLine']).name

                        except SubwayStation.DoesNotExist:
                            train_response['previous_station']['name'] = None
                            train_response['next_station']['name'] = None

            else:
                return _build_response(False, message, 404)

            return _build_response(True, message, 200, train=train_response)

        else:
            return _build_response(False, data['message'], 404)

    except Exception as e:
        print(f"Exception occurred: {e}")
        return Response({"error": str(e)}, status=500)


def _get_station_ids(start_name, line, direction, stops_at, data):


def _get_stations_on_route(station_ids, direction, data):


"""
Fetch all stations along a specific train's route from the originating station (name) to the final station (stops_at):
    - If 'realtimeArrivalList' exists in the data, retrieve a list of station IDs along the route. The direction of ID 
    increment or decrement depends on the train's heading.
    - Fetch data for each station on the route.
    - Return stations_on_route_response if it exists, an error response otherwise.
"""
@api_view(['GET'])
def get_stations_on_route(request, start_name, line, direction, stops_at):
    try:
        start_station = SubwayStation.objects.get(name=start_name, line=line, direction=direction)
        start_id = start_station.station_id

        end_station = SubwayStation.objects.get(name=stops_at, line=line, direction=direction)
        end_id = end_station.station_id

        if end_id > start_id:
            station_ids = list(range(start_id + 1, end_id + 1))  # Include end station
        else:
            station_ids = list(range(start_id - 1, end_id - 1, -1))  # Include end station

        stations_on_route = []
        for sid in station_ids:
            station = SubwayStation.objects.get(station_id=sid, direction=direction)
            stations_on_route.append({
                'station_id': station.station_id,
                'name': station.name,
                'line': station.line,
                'direction': station.direction,
            })

        if stations_on_route:
            return _build_response(True, '', 200, list=stations_on_route)
        else:
            return _build_response(False, 'No stations found on the route.', 404)

    except SubwayStation.DoesNotExist as e:
        return _build_response(False, str(e), 404)

    except Exception as e:
        return _build_response(False, str(e), 500)