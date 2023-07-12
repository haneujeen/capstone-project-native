from django.urls import path
from . import views

urlpatterns = [
    path('get_stations/<str:name>', views.get_stations),
    path('get_train/<int:number>', views.get_train),
]
