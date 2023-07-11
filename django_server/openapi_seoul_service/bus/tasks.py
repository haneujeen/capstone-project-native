"""
app_service/websocket_service/consumers/BusConsumer.update:

class BusConsumer(AsyncWebsocketConsumer):
    # ...

    async def update(self):
        while True:
            bus = await get_bus(self.id, self.route_id)
            await self.send(text_data=json.dumps(bus))
            await asyncio.sleep(10)
"""

async def update_bus(id, route_id):
    try:

        bus = {
            'id': id,
            'name': this_station['rtNm'],
            'previous_station': {
                'id': previous_station['stId'],
                'name': previous_station['stNm'],
            },
            'station': {
                'id': this_station['stId'],
                'name': this_station['stNm'],
            },
            'next_station': {
                'id': next_station['stId'],
                'name': next_station['stNm'],
            },
            'desc': {
                'bus_type': this_station['busType1'],
                'travel_time': this_station['traTime1'],
                'speed': this_station['traSpd1'],
                'is_last': this_station['isLast1'],
                'is_full': this_station['isFull1Flag'],
                'plate_number': ,
            },
        }

        return bus

    except Exception as e:
        return {'error': str(e)}

from django.conf import settings
from urllib.parse import unquote
import requests

OGD_API_KEY = unquote(settings.OGD_API_KEY)

async def get_description(id):
    url = 'http://ws.bus.go.kr/api/rest/buspos/getBusPosByVehId'

    params = {
        'serviceKey': OGD_API_KEY,
        'vehId': id,
        'resultType': 'json'
    }

    response = requests.get(url, params=params)

    index_station_id = response['msgBody']['itemList'][0]['lastStnId']
    plate_number = response['msgBody']['itemList'][0]['plainNo']

    return index_station_id, plate_number


async def get_information(index_station_id, route_id):
    url = 'http://ws.bus.go.kr/api/rest/arrive/getArrInfoByRouteAll'

    params = {
        'serviceKey': OGD_API_KEY,
        'busRouteId': route_id,
        'resultType': 'json'
    }
    response = requests.get(url, params=params)

    data = response['msgBody']['itemList']

    previous_station_index = 0
    this_station_index = 0
    next_station_index = 0
    for i, item in data:
        if item['stId'] == index_station_id:
            previous_station_index = i
            this_station_index = i + 1
            next_station_index = i + 2

    previous_station = data[previous_station_index]
    this_station = data[this_station_index]
    next_station = data[next_station_index]

    return previous_station, this_station, next_station


