from django.urls import path
from . import views

urlpatterns = [
    path('get_stations/<str:search_text>', views.get_stations),
    path('get_train/<int:number>', views.get_train),
    path('get_stations_on_route/<str:start_name>/<str:line>/<str:direction>/<str:stops_at>/', views.get_stations_on_route),
    path('get_facilities/<str:station_name>/', views.get_facilities),
]
