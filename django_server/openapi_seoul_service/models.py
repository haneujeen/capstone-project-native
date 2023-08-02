from django.db import models

# Create your models here.
class SubwayStation(models.Model):
    station_id = models.IntegerField()
    name = models.CharField(max_length=100)
    direction = models.CharField(max_length=50)
    next_station = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL)
    line = models.IntegerField()
    transfer_available = models.JSONField(default=list)
    accessibility_information = models.TextField(null=True, blank=True)
    POI_locator = models.TextField(null=True, blank=True)
    accessibility_information_text = models.TextField(null=True, blank=True)
    POI_locator_text = models.TextField(null=True, blank=True)

    class Meta:
        unique_together = [('station_id', 'direction')]

    def __str__(self):
        return f'{self.name}-{self.station_id}-{self.direction}'

class SubwayStationInformation(models.Model):
    name = models.CharField(max_length=50)
    accessibility_information = models.TextField(null=True, blank=True)
    POI_locator = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.name}-information text"
