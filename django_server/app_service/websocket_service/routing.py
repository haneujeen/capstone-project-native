from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/bus/(?P<id>\w+)/(?P<route_id>\w+)/(?P<token>\w+)/$',
            consumers.BusConsumer.as_asgi(), kwargs={'token': 'default'}),
    re_path(r'ws/subway/(?P<number>\w+)/(?P<token>\w+)/$',
            consumers.SubwayConsumer.as_asgi(), kwargs={'token': 'default'}),
]