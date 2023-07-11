from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/bus/$', consumers.BusConsumer.as_asgi()),
    re_path(r'ws/train/$', consumers.TrainConsumer.as_asgi()),
]