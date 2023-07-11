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
        index = data['SearchSTNBySubwayLineInfo']['list_total_count']

        url = f"http://openapi.seoul.go.kr:8088/{SEOUL_API_KEY}/json/SearchSTNBySubwayLineInfo/1/{index}/%20/{query}/%20"

        response = requests.get(url)
        data = response.json()['SearchSTNBySubwayLineInfo']

        return Response(data)
    except Exception as e:
        return Response({"error": str(e)}, status=500)