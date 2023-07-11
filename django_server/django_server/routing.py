from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
import app_service.websocket_service.routing

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": URLRouter(
        app_service.websocket_service.routing.websocket_urlpatterns
    ),
})
