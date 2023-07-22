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
from urllib.parse import unquote
import httpx
from django.conf import settings


OGD_API_KEY = unquote(settings.OGD_API_KEY)
async def get_bus(id, route_id):
    try:
        location = await get_location(id)
        previous_station, this_station, next_station = await get_stations(location['lastStnId'], route_id)

        print("websocket sending bus")

        bus = {
            'id': id,
            'name': this_station.get('rtNm'),
            'longitude': location['tmX'],
            'latitude': location['tmY'],
            'previous_station': {
                'id': previous_station.get('stId'),
                'name': previous_station.get('stNm'),
            },
            'station': {
                'id': this_station.get('stId'),
                'name': this_station.get('stNm'),
            },
            'next_station': {
                'id': next_station.get('stId'),
                'name': next_station.get('stNm'),
            },
            'desc': {
                'bus_type': this_station.get('busType1'),
                'travel_time': this_station.get('traTime1'),
                'speed': this_station.get('traSpd1'),
                'is_last': this_station.get('isLast1'),
                'is_full': this_station.get('full1'),
                'plate_number': this_station.get('plainNo1'),
            },
        }

        print("Returning bus... ", bus['id'])

        return bus

    except Exception as e:
        return {'error': str(e)}


async def get_location(id):
    url = 'http://ws.bus.go.kr/api/rest/buspos/getBusPosByVehId'

    params = {
        'serviceKey': OGD_API_KEY,
        'vehId': id,
        'resultType': 'json'
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        data = response.json()

    index_station_id = data['msgBody']['itemList'][0]

    return index_station_id


async def get_stations(index_station_id, route_id):
    url = 'http://ws.bus.go.kr/api/rest/arrive/getArrInfoByRouteAll'

    params = {
        'serviceKey': OGD_API_KEY,
        'busRouteId': route_id,
        'resultType': 'json'
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        data = response.json()

    data = data['msgBody']['itemList']

    index = -1
    previous_station, this_station, next_station = None, None, None
    for i, item in enumerate(data):
        if item['stId'] == index_station_id:
            index = i
            previous_station = data[index]

    if previous_station is None:
        raise Exception('No matching station found')

    if index + 2 < len(data):
        this_station = data[index + 1]
        next_station = data[index + 2]
    else:
        raise Exception('No matching next station found')

    return previous_station, this_station, next_station
