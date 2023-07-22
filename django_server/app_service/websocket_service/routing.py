from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/bus/(?P<x>[-+]?[0-9]*\.?[0-9]+)/(?P<y>[-+]?[0-9]*\.?[0-9]+)/$',
            consumers.BusConsumer.as_asgi()),
    re_path(r'ws/subway/(?P<id>[-+]?[0-9]*\.?[0-9]+)/$',
            consumers.SubwayConsumer.as_asgi()),
    re_path(r'ws/bus/(?P<id>\w+)/(?P<route_id>\w+)/(?P<token>\w+)/$',
            consumers.BusConsumer.as_asgi(), kwargs={'token': 'default'}),
    re_path(r'ws/subway/(?P<number>\w+)/(?P<token>\w+)/$',
            consumers.SubwayConsumer.as_asgi(), kwargs={'token': 'default'}),
]