import asyncio
import json
from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
import httpx
from urllib.parse import unquote
import math

class BusConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.x = self.scope['url_route']['kwargs']['x']
        self.y = self.scope['url_route']['kwargs']['y']

        await self.accept()
        print("Websocket connection started from ", self.x, self.y)

        self.task = asyncio.create_task(self.find_bus())

    async def find_bus(self):
        key = unquote("GMDNZxLlo35v0mYu1b%2BEExd5aIdZ93RCUBhUBo2w73LWCtz%2Ft%2F%2FKdGfzDVUdcyqljjwvNa5Dtd56uELhovFZRw%3D%3D")
        # Search the stations nearby with the coords
        url = 'http://ws.bus.go.kr/api/rest/stationinfo/getStationByPos'

        params = {
            'serviceKey': key,
            'tmX': self.x,
            'tmY': self.y,
            'radius': 60,
            'resultType': 'json',
        }

        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params)
            data = response.json()

        if data['msgBody']['itemList']:    # If the response is valid
            id_data = data['msgBody']['itemList']
            station_ids = []
            for item in id_data:
                station_ids.append(item['arsId'])
            print(station_ids)
            # Get buses with the station's 5 digits id
            url = 'http://ws.bus.go.kr/api/rest/stationinfo/getStationByUid'

            bus_list = []
            for id in station_ids:
                bus_ids = []
                print("making request for id ", id)
                params = {
                    'serviceKey': key,
                    'arsId': id,
                    'resultType': 'json',
                }

                async with httpx.AsyncClient() as client:
                    response = await client.get(url, params=params)
                    data = response.json()

                id_data = data['msgBody']['itemList']

                for item in id_data:
                    if item['vehId1'] != '0':
                        bus_ids.append(
                            {
                                'id': item['vehId1'],
                                'route': item['busRouteId'],
                                'name': item['busRouteAbrv']
                            }
                        )
                print("Bus IDs: ", bus_ids, "for station id: ", id)

                # Get each bus's current coordinates
                url_pos = 'http://ws.bus.go.kr/api/rest/buspos/getBusPosByVehId'
                for bus_id in bus_ids:
                    print("Getiing bus ", bus_id, "'s current coordinates")
                    params = {
                        'serviceKey': key,
                        'vehId': bus_id['id'],
                        'resultType': 'json',
                    }

                    async with httpx.AsyncClient() as client:
                        response = await client.get(url_pos, params=params)
                        data = response.json()

                    bus_data = data['msgBody']['itemList'][0]
                    bus_longitude = bus_data['tmX']
                    bus_latitude = bus_data['tmY']
                    print(bus_id['id'], bus_id['route'], bus_id['name'], bus_longitude, bus_latitude)
                    bus_list.append(
                        {
                            'id': bus_id['id'],
                            'route': bus_id['route'],
                            'name': bus_id['name'],
                            'x': bus_longitude,
                            'y': bus_latitude
                        }
                    )

            print("Buses: ", bus_list)
            print(self.x, self.y)  # Requested coords
            # Calculate the distance from a bus and a user for all the nearing buses in the list
            user_x = float(self.x)
            user_y = float(self.y)
            distances = []
            for bus in bus_list:
                bus_x = float(bus['x'])
                bus_y = float(bus['y'])
                distance = math.sqrt((bus_x - user_x) ** 2 + (bus_y - user_y) ** 2)
                distances.append(distance)

            min_index = distances.index(min(distances))

            # the bus the user is most likely inside of
            likely_bus = bus_list[min_index]

            print("likely bus: ", likely_bus)

            # start sending updates about the likely bus to the client
            self.update_task = asyncio.create_task(self.update(likely_bus['id'], likely_bus['route']))
            print("send_task added")
        else:
            print("Cannot detect any bus from the location in the request")


    async def update(self, id, route_id):
        while True:
            # Import after the settings are configured to avoid:
            # ImproperlyConfigured: Requested setting OGD_API_KEY, but settings are not configure
            from openapi_seoul_service.bus.tasks import get_bus

            bus = await get_bus(id, route_id)
            await self.send(text_data=json.dumps(bus))

            await asyncio.sleep(30)

    async def disconnect(self, close_code):
        self.task.cancel()

    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            message = text_data_json.get('message', 'No message key in JSON')

            if message == 'stop':
                print("stop")

        except json.JSONDecodeError:
            pass


class SubwayConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.id = self.scope['url_route']['kwargs']['id']

        await self.accept()
        print("Websocket connection started with id ", self.id)

        # Import after the settings are configured to avoid:
        # ImproperlyConfigured: Requested setting OGD_API_KEY, but settings are not configure
        from openapi_seoul_service.subway.tasks import get_train

        initial_train = await get_train(self.id)
        await self.send(text_data=json.dumps(initial_train))

        self.update_task = asyncio.create_task(self.update())

    async def update(self):
        while True:
            from openapi_seoul_service.subway.tasks import get_train
            train = await get_train(self.id)
            await self.send(text_data=json.dumps(train))
            await asyncio.sleep(30)

    async def disconnect(self, close_code):
        self.update_task.cancel()

    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            message = text_data_json.get('message', 'No message key in JSON')
        except json.JSONDecodeError:
            message = text_data
