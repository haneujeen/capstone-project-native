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

async def get_bus(id, route_id):
    try:

        bus = {
            'id': id,
            'name': ,
            'previous_station':,
            'station':,
            'next_station':,
            'desc': {
                'travel_time':,
                'speed':,
                'is_las':,
                'plate_number':,
            },
        }

        return bus

    except Exception as e:
        return {'error': str(e)}
