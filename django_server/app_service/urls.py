from django.urls import path
from . import views

urlpatterns = [
    path('save-token/', views.save_token, name='save-token'),
    path('delete-token/', views.delete_token, name='delete-token'),
]
