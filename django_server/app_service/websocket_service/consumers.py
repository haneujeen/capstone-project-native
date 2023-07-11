import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
import json


class BusConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.id = self.scope['url_route']['kwargs']['id']
        self.route_id = self.scope['url_route']['kwargs']['route_id']

        await self.accept()

        # Import after the settings are configured to avoid:
        # ImproperlyConfigured: Requested setting OGD_API_KEY, but settings are not configure
        from openapi_seoul_service.bus.tasks import get_bus

        initial_bus = await get_bus(self.id, self.route_id)
        await self.send(text_data=json.dumps(initial_bus))

        self.update_task = asyncio.create_task(self.update())

    async def update(self):
        while True:
            from openapi_seoul_service.bus.tasks import get_bus
            bus = await get_bus(self.id, self.route_id)
            await self.send(text_data=json.dumps(bus))
            await asyncio.sleep(10)

    async def disconnect(self, close_code):
        self.update_task.cancel()

    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            message = text_data_json.get('message', 'No message key in JSON')
        except json.JSONDecodeError:
            message = text_data


class TrainConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Do something with the message
