from django.conf import settings
from rest_framework.decorators import api_view
import requests
from rest_framework.response import Response
from urllib.parse import unquote

SEOUL_API_KEY = unquote(settings.SEOUL_API_KEY)

SWOPENAPI_KEY = unquote(settings.SWOPENAPI_KEY)


def _get_station_names(search_text):
    url = f"http://openapi.seoul.go.kr:8088/{SEOUL_API_KEY}/json/SearchSTNBySubwayLineInfo/1/1/%20/{search_text}/%20"
    response = requests.get(url)
    data = response.json()

    if 'SearchSTNBySubwayLineInfo' in data:
        index = data['SearchSTNBySubwayLineInfo']['list_total_count']
        url = f"http://openapi.seoul.go.kr:8088/{SEOUL_API_KEY}/json/SearchSTNBySubwayLineInfo/1/{index}/%20/{search_text}/%20"
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

@api_view(['GET'])
def get_stations(request, search_text):
    try:
        names = _get_station_names(search_text)
        stations_dict = {}

        for name_item in names:
            name = name_item['name']
            url = f"http://swopenapi.seoul.go.kr/api/subway/{SWOPENAPI_KEY}/json/realtimeStationArrival/0/1/{name}"
            response = requests.get(url)
            data = response.json()

            if 'realtimeArrivalList' in data:
                index = data['errorMessage']['total']
                url = f"http://swopenapi.seoul.go.kr/api/subway/{SWOPENAPI_KEY}/json/realtimeStationArrival/0/{index}/{name}"
                response = requests.get(url)
                data = response.json()['realtimeArrivalList']

                for item in data:
                    station_id = item['statnId']
                    next_station = item['trainLineNm'].split(' - ')[1][:-2]  # the next station
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

            else:
                station_response = {
                    'is_valid': False,
                    'response_code': '202',
                    'message': {
                        'message': data['message'],
                        'station_result': names,
                        'train_message': "This is the off-service hours. There are no trains arriving at the stations: ",
                        'station_message': f"There are no matching stations found from the endpoint {url}",
                    },
                }

                return Response(station_response)

        station_response = {
            'is_valid': True,
            'response_code': '0',
            'message': response.json()['errorMessage']['message'],
            'list': list(stations_dict.values())
        }
        return Response(station_response)

    except Exception as e:
        print(f"Exception occurred: {e}")
        return Response({"error": str(e)}, status=500)


@api_view(['GET'])
def get_train(request, number):
    url = f"http://swopenAPI.seoul.go.kr/api/subway/{SWOPENAPI_KEY}/json/realtimeStationArrival/ALL"
    print("get_train")
    try:
        response = requests.get(url)
        data = response.json()

        # WARN: API is not consistent in its response format
        if 'realtimeArrivalList' in data:
            data = response.json()['realtimeArrivalList']
            message = response.json()['errorMessage']['message']

            train_response = {}
            for item in data:
                if item['btrainNo'] == str(number):

                    print(item['updnLine'])
                    train_response = {
                        'number': number,
                        'line': item['subwayId'],
                        'direction': item['updnLine'],
                        'current_station': {
                            'name': item['arvlMsg3'],
                        },
                        'previous_station': {},
                        'next_station': {},
                        'is_arrived': item['arvlCd'],  # 0:진입, 1:도착, 2:출발, 3:전역출발, 4:전역진입, 5:전역도착, 99:운행중
                        'stops_at': item['bstatnNm'],
                        'type': 'subway',

                    }
                    break
                else:
                    pass

            print(train_response)

            for item in data:
                if item['statnNm'] == train_response['current_station']['name']\
                    and item['subwayId'] == train_response['line']\
                    and item['updnLine'] == train_response['direction']:
                    train_response['current_station']['id'] = item['statnId']
                    train_response['previous_station']['id'] = item['statnFid']
                    train_response['next_station']['id'] = item['statnTid']

            for item in data:
                if item['statnId'] == str(train_response['previous_station']['id']):
                    train_response['previous_station']['name'] = item['statnNm']

                if item['statnId'] == str(train_response['next_station']['id']):
                    train_response['next_station']['name'] = item['statnNm']

            if train_response:
                response = {
                    'is_valid': True,
                    'response_code': '0',
                    'message': message,
                    'train': train_response,
                }
                return Response(response)
            else:
                response = {
                    'is_valid': False,
                    'response_code': '502',
                    'message': message,
                }
                return Response(response)

        else:
            response = {
                'is_valid': False,
                'response_code': '202',
                'message': data['message'],
            }
            return Response(response)

    except Exception as e:
        print(f"Exception occurred: {e}")
        return Response({"error": str(e)}, status=500)


@api_view(['GET'])
def get_stations_on_route(request, name, line, direction, stops_at):
    url = f"http://swopenAPI.seoul.go.kr/api/subway/{SWOPENAPI_KEY}/json/realtimeStationArrival/ALL"
    print("get_train")
    try:
        response = requests.get(url)
        data = response.json()

        # WARN: API is not consistent in its response format
        if 'realtimeArrivalList' in data:
            data = response.json()['realtimeArrivalList']
            message = response.json()['errorMessage']['message']

            stations_on_route_response = []
            start_id, start_name = None, ''
            end_id, end_name = None, ''
            print(message)
            for item in data:
                if item['statnNm'] == name and item['subwayId'] == line \
                    and item['updnLine'] == direction:
                    start_id = item['statnId']
                    start_name = item['statnNm']

                if item['statnNm'] == stops_at and item['subwayId'] == line \
                    and item['updnLine'] == direction:
                    end_id = item['statnId']
                    end_name = item['statnNm']

            print(start_id, start_name, end_id, end_name)

            if start_id is not None and end_id is not None and int(end_id) > int(start_id):
                index = list(range(int(start_id) + 1, int(end_id)))
                print(index)
                i = 1
                for station_id in index:
                    for item in data:
                        if item['statnId'] == str(station_id) and item['updnLine'] == direction:
                            station_item = {
                                'index': i,
                                'id': station_id,
                                'name': item['statnNm']
                            }

                            print(station_item)
                            stations_on_route_response.append(station_item)
                            i += 1
                            break # The API returns several same entries with the same ID, name, and direction
                            # It's because entries are not only for the stations but also for the subway vehicles related somehow
                            # The original response's "trainLineNm" field might help to understand
            else:
                index = list(range(int(start_id) - 1, int(end_id), -1))
                i = 1
                for station_id in index:
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

            if stations_on_route_response:

                response = {
                    'is_valid': True,
                    'response_code': '0',
                    'message': message,
                    'list': stations_on_route_response,
                }

                return Response(response)

            response = {
                'is_valid': False,
                'response_code': '502',
                'message': "I did something wrong with the code",
            }

            return Response(response)

        else:
            response = {
                'is_valid': False,
                'response_code': '202',
                'message': data['message'],
            }

        return Response(response)

    except Exception as e:
        print(f"Exception occurred: {e}")
        return Response({"error": str(e)}, status=500)