import asyncio
import json
from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer


class BusConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.id = self.scope['url_route']['kwargs']['id']
        self.route_id = self.scope['url_route']['kwargs']['route_id']

        await self.accept()
        print("Websocket connection started")

        self.update_task = asyncio.create_task(self.update())

    async def update(self):
        while True:
            # Import after the settings are configured to avoid:
            # ImproperlyConfigured: Requested setting OGD_API_KEY, but settings are not configure
            from openapi_seoul_service.bus.tasks import get_bus

            bus = await get_bus(self.id, self.route_id)
            await self.send(text_data=json.dumps(bus))

            await asyncio.sleep(30)

    async def disconnect(self, close_code):
        self.update_task.cancel()

    async def receive(self, text_data):
        async def receive(self, text_data):
            try:
                text_data_json = json.loads(text_data)
                message = text_data_json.get('message', 'No message key in JSON')

                if message == 'stop':
                    location = text_data_json['location']
                    device_id = text_data_json['deviceInfo']['id']
                    manufacturer = text_data_json['deviceInfo']['manufacturer']

            except json.JSONDecodeError:
                pass


class SubwayConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.number = self.scope['url_route']['kwargs']['number']

        await self.accept()
        print("Websocket connection started")

        # Import after the settings are configured to avoid:
        # ImproperlyConfigured: Requested setting OGD_API_KEY, but settings are not configure
        from openapi_seoul_service.subway.tasks import get_train

        initial_train = await get_train(self.number)
        await self.send(text_data=json.dumps(initial_train))

        self.update_task = asyncio.create_task(self.update())

    async def update(self):
        while True:
            from openapi_seoul_service.subway.tasks import get_train
            train = await get_train(self.number)
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
