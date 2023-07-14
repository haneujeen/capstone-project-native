from django.db import models

# Create your models here.
class SubwayStation(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    name = models.CharField(max_length=100)
    direction = models.CharField(max_length=50)
    line = models.CharField(max_length=50)
    transfer_available = models.JSONField()  # This field will store a list of lines

    def __str__(self):
        return self.name