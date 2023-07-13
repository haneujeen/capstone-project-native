from django.conf import settings
from rest_framework.decorators import api_view
import requests
from rest_framework.response import Response
from urllib.parse import unquote

SEOUL_API_KEY = unquote(settings.SEOUL_API_KEY)

SWOPENAPI_KEY = unquote(settings.SWOPENAPI_KEY)


def _get_station_names(request, query):
    try:
        url = f"http://openapi.seoul.go.kr:8088/{SEOUL_API_KEY}/json/SearchSTNBySubwayLineInfo/1/1/%20/{query}/%20"
        response = requests.get(url)
        data = response.json()

        # WARN: API is not consistent in its response format
        if 'SearchSTNBySubwayLineInfo' in data:
            try:
                index = data['SearchSTNBySubwayLineInfo']['list_total_count']
                url = f"http://openapi.seoul.go.kr:8088/{SEOUL_API_KEY}/json/SearchSTNBySubwayLineInfo/1/{index}/%20/{query}/%20"
                response = requests.get(url)
                data = response.json()['SearchSTNBySubwayLineInfo']
                names = set()
                for item in data['row']:
                    names.add(item['STATION_NM'])

                return Response(names)

            except Exception as e:
                print(f"Exception occurred: {e}")
                return Response({"error": str(e)}, status=502)

        elif 'RESULT' in data:
            names = {
                'is_valid': False,
                'response_code': '202',
                'message': data['RESULT']['MESSAGE'],
            }
            return Response(names)

    except Exception as e:
        print(f"Exception occurred: {e}")
        return Response({"error": str(e)}, status=500)


@api_view(['GET'])
def get_stations(request, name):
    try:
        url = f"http://swopenapi.seoul.go.kr/api/subway/{SWOPENAPI_KEY}/json/realtimeStationArrival/0/1/{name}"
        response = requests.get(url)
        data = response.json()
        print(data)

        # WARN: API is not consistent in its response format
        if 'realtimeArrivalList' in data:
            try:
                index = data['errorMessage']['total']
                url = f"http://swopenapi.seoul.go.kr/api/subway/{SWOPENAPI_KEY}/json/realtimeStationArrival/0/{index}/{name}"
                response = requests.get(url)
                data = response.json()['realtimeArrivalList']

                stations = []
                for item in data:
                    station_item = {
                        'station': {
                            'id': item['statnId'],
                            'name': item['statnNm'],
                            'line': item['subwayId'],
                            'to': item['trainLineNm'].split(' - ')[1][:-2],  # 왕십리행 - 청량리방면
                            'type': 'subway',
                        },
                        'train': {
                            'number': item['btrainNo'],
                            'stations_left': item['ordkey'][2:5],
                            'stops_at': item['bstatnNm'],
                            'screen_message': item['arvlMsg2'],
                            'current_station': item['arvlMsg3'],
                            'is_arrived': item['arvlCd'], # 0:진입, 1:도착, 2:출발, 3:전역출발, 4:전역진입, 5:전역도착, 99:운행중
                            'type': 'subway',
                        },
                    }
                    stations.append(station_item)

                station_response = {
                    'is_valid': True,
                    'response_code': '0',
                    'message': response.json()['errorMessage']['message'],
                    'list': stations
                }
                return Response(station_response)

            except Exception as e:
                print(f"Exception occurred: {e}")
                return Response({"error": str(e)}, status=502)

        else:
            station_response = {
                'is_valid': False,
                'response_code': '202',
                'message': data['message'],
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
        print("getting train")

        # WARN: API is not consistent in its response format
        if 'realtimeArrivalList' in data:
            data = response.json()['realtimeArrivalList']
            message = response.json()['errorMessage']['message']
            print(f"Number of trains: {len(data)}")  # To check the number of trains

            train_response = {}
            for item in data:
                if item['btrainNo'] == str(number):  # Ensure both are strings for comparison
                    train_response = {
                        'number': number,
                        'current_station': item['arvlMsg3'],
                        'is_arrived': item['arvlCd'],  # 0:진입, 1:도착, 2:출발, 3:전역출발, 4:전역진입, 5:전역도착, 99:운행중
                        'stops_at': item['bstatnNm'],
                        'type': 'subway',
                        'is_valid': True,
                        'response_code': '0',
                        'message': message,
                    }
                    return Response(train_response)
                else:
                    pass

            train_response = {
                'is_valid': False,
                'response_code': '502',
                'message': message,
            }

            return Response(train_response)

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

