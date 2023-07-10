from django.urls import path, include

urlpatterns = [
    path('bus/', include('openapi_seoul_service.bus.urls')),
    path('subway/', include('openapi_seoul_service.subway.urls')),
]