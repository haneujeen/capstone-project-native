from django.db import models

# Create your models here.
class PushToken(models.Model):
    token = models.CharField(max_length=200, unique=True)

    def __str__(self):
        return self.token


class Device(models.Model):
    expo_token = models.CharField(max_length=200, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
