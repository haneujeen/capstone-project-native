from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/bus/(?P<x>[-+]?[0-9]*\.?[0-9]+)/(?P<y>[-+]?[0-9]*\.?[0-9]+)/$',
            consumers.BusConsumer.as_asgi()),
    re_path(r'ws/subway/(?P<id>\d{4})/$', consumers.SubwayConsumer.as_asgi()),
]