import asyncio
import json
from channels.generic.websocket import AsyncWebsocketConsumer
import httpx
from urllib.parse import unquote
import math
from ..utils import send_push_notification


def _find_likely_bus(x, y, bus_list, threshold=0.00025):
    # Calculate the distance from a bus and a user for all the nearing buses in the list
    user_x = float(x)
    user_y = float(y)
    distances = []
    for bus in bus_list:
        bus_x = float(bus['x'])
        bus_y = float(bus['y'])
        distance = math.sqrt((bus_x - user_x) ** 2 + (bus_y - user_y) ** 2)
        distances.append(distance)

    min_index = distances.index(min(distances))

    # If the minimum distance is within the threshold, return the bus
    if min(distances) <= threshold:
        # the bus the user is most likely inside of
        likely_bus = bus_list[min_index]
        return likely_bus
    else:
        # If no bus is within the threshold, return None
        # return None
        likely_bus = bus_list[min_index]
        return likely_bus


def _get_traffic_info():
    import requests
    import xml.etree.ElementTree as ET
    from django.conf import settings
    import openai

    SEOUL_API_KEY = unquote(settings.SEOUL_API_KEY)
    WEATHER_API_KEY = unquote(settings.WEATHER_API_KEY)
    OPENAI_API_KEY = unquote(settings.OPENAI_API_KEY)

    link_ids = [1080008000, 1080009400]

    speeds = []

    for link_id in link_ids:
        url = f"http://openapi.seoul.go.kr:8088/{SEOUL_API_KEY}/xml/TrafficInfo/1/5/{link_id}/"
        response = requests.get(url)
        root = ET.fromstring(response.content)

        for row in root.iter('row'):
            prcs_spd = row.find('prcs_spd').text
            speeds.append(float(prcs_spd))

    average_speed = sum(speeds) / len(speeds)
    print(average_speed)

    def get_weather(api_key, location_key):
        base_url = f"http://dataservice.accuweather.com/currentconditions/v1/{location_key}"
        params = {
            "apikey": api_key,
            "language": "en-us",
            "details": True
        }
        response = requests.get(base_url, params=params)
        weather = response.json()

        return f"WeatherText: {weather[0]['WeatherText']}\n" \
               f"HasPrecipitation: {weather[0]['HasPrecipitation']}\n" \
               f"Temperature: {weather[0]['Temperature']}\n" \
               f"Visibility: {weather[0]['Visibility']}\n" \
               f"Wind Speed: {weather[0]['Wind']['Speed']}\n" \
               f"CloudCover: {weather[0]['CloudCover']}\n"

    api_key = WEATHER_API_KEY
    location_key = '226081'
    weather_information = get_weather(api_key, location_key)

    openai.api_key = OPENAI_API_KEY

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {
                "role": "system",
                "content": f"Here are the weather condition and the the average speed on major local roads."
                           f"You will write a helpful and friendly message for public bus passengers about the current driving condition in Korean."
                           f"You will include certain feature of the weather or road speed only when it's extremely deviated from the average."
                           f"If none of the features is outside the average, don't include them and simply create a general message might help."
                           f"The message will consist of 1 or 2 short sentences, and will not be longer than 2 sentences."
                           f"- The average speed on major local roads: {average_speed} km/h,"
                           f"- The weather information: {weather_information}"
            },
        ],
        max_tokens=160,
        frequency_penalty=0,
        presence_penalty=0
    )

    return response.choices[0].message.content


class BusConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.x = self.scope['url_route']['kwargs']['x']
        self.y = self.scope['url_route']['kwargs']['y']
        self.token = None

        await self.accept()
        print("Websocket connection started from ", self.x, self.y)

        self.task = asyncio.create_task(self.find_bus())

    async def find_bus(self):
        from django.conf import settings
        OGD_API_KEY = unquote(settings.OGD_API_KEY)

        # Search the stations nearby with the coordinates
        url = 'http://ws.bus.go.kr/api/rest/stationinfo/getStationByPos'

        params = {
            'serviceKey': OGD_API_KEY,
            'tmX': self.x,
            'tmY': self.y,
            'radius': 50,
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
                    'serviceKey': OGD_API_KEY,
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
                        'serviceKey': OGD_API_KEY,
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

            likely_bus = _find_likely_bus(self.x, self.y, bus_list)


            if likely_bus:
                traffic_info = _get_traffic_info()
                print(traffic_info)
                # start sending updates about the likely bus to the client
                self.update_task = asyncio.create_task(self.update(likely_bus['id'], likely_bus['route'], traffic_info))

                fake_app_url = "http://127.0.0.1:5001/receive_likely_bus"
                async with httpx.AsyncClient() as client:
                    response = await client.post(fake_app_url, json=likely_bus)
            else:
                print("Cannot detect any bus from the location in the request")
                asyncio.create_task(self.send(text_data=json.dumps(None)))

        else:
            print("Cannot detect any bus from the location in the request")
            asyncio.create_task(self.send(text_data=json.dumps(None)))

    async def update(self, id, route_id, traffic_info):
        while True:
            # Import after the settings are configured to avoid:
            # ImproperlyConfigured: Requested setting OGD_API_KEY, but settings are not configure
            from openapi_seoul_service.bus.tasks import get_bus

            bus = await get_bus(id, route_id, traffic_info)
            await self.send(text_data=json.dumps(bus))

            if self.token:
                send_push_notification(self.token, bus["station"]["name"])

            await asyncio.sleep(30)

    async def disconnect(self, close_code):
        self.task.cancel()

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            print(data)
            request = data.get('request', 'No message key in JSON')

            if request == 'stop':
                print("stop with ", data)

                fake_app_dashboard_url = "http://127.0.0.1:5001/receive_stop_request"
                async with httpx.AsyncClient() as client:
                    response = await client.post(fake_app_dashboard_url, json=data)

            if request == 'push':
                print("Do something with ", data)
                self.token = data.get("token", None)

        except json.JSONDecodeError:
            pass


class SubwayConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("ws created")
        self.id = self.scope['url_route']['kwargs']['id']

        await self.accept()
        print("Websocket connection started with id ", self.id)

        # Import after the settings are configured to avoid:
        # ImproperlyConfigured: Requested setting OGD_API_KEY, but settings are not configure
        from openapi_seoul_service.subway.tasks import get_train

        #initial_train = await get_train(self.id)
        #await self.send(text_data=json.dumps(initial_train))

        self.update_task = asyncio.create_task(self.update())

    async def update(self):
        while True:
            from openapi_seoul_service.subway.tasks import get_train
            train = await get_train(self.id)
            await self.send(text_data=json.dumps(train))
            await asyncio.sleep(60)

    async def disconnect(self, close_code):
        self.update_task.cancel()

    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            message = text_data_json.get('message', 'No message key in JSON')
        except json.JSONDecodeError:
            message = text_data
