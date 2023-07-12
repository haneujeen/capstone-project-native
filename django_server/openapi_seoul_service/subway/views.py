from django.conf import settings
from rest_framework.decorators import api_view
import requests
from rest_framework.response import Response
from urllib.parse import unquote

SEOUL_API_KEY = unquote(settings.SEOUL_API_KEY)


@api_view(['GET'])
def get_stations(request, query):
    try:
        url = f"http://openapi.seoul.go.kr:8088/{SEOUL_API_KEY}/json/SearchSTNBySubwayLineInfo/1/1/%20/{query}/%20"
        response = requests.get(url)
        data = response.json()
        print(data)
        print("Trying")

        # WARN: API is not consistent in its response format
        if 'SearchSTNBySubwayLineInfo' in data:
            if data['SearchSTNBySubwayLineInfo']['RESULT']['CODE'] == 'INFO-000':
                print("before trying")
                try:
                    print("still trying")
                    index = data['SearchSTNBySubwayLineInfo']['list_total_count']
                    url = f"http://openapi.seoul.go.kr:8088/{SEOUL_API_KEY}/json/SearchSTNBySubwayLineInfo/1/{index}/%20/{query}/%20"
                    response = requests.get(url)
                    data = response.json()['SearchSTNBySubwayLineInfo']
                    stations = []
                    for item in data['row']:
                        station_item = {
                            'id': item['STATION_CD'],
                            'name': item['STATION_NM'],
                            'line': item['LINE_NUM'],
                            'type': 'subway',
                        }
                        stations.append(station_item)

                    station_response = {
                        'is_valid': True,
                        'response_code': '0',
                        'message': data['RESULT']['MESSAGE'],
                        'list': stations
                    }

                    return Response(station_response)

                except Exception as e:
                    print(f"Exception occurred: {e}")
                    return Response({"error": str(e)}, status=502)

        elif 'RESULT' in data:
            station_response = {
                'is_valid': False,
                'response_code': '202',
                'message': data['RESULT']['MESSAGE'],
            }
            return Response(station_response)

    except Exception as e:
        print(f"Exception occurred: {e}")
        return Response({"error": str(e)}, status=500)
