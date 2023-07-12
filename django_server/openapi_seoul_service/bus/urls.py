from django.urls import path
from . import views

urlpatterns = [
    path('get_stations/<str:query>', views.get_stations),
    path('get_arrivals/<int:id>', views.get_arrivals),
    path('get_stations_on_route/<int:id>', views.get_stations_on_route),
]