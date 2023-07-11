from django.urls import path
from . import views

urlpatterns = [
    path('get_stations/<str:query>', views.get_stations),
]
