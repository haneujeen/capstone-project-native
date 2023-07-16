from django.db import models

# Create your models here.
class SubwayStation(models.Model):
    station_id = models.IntegerField()
    name = models.CharField(max_length=100)
    direction = models.CharField(max_length=50)
    next_station = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL)
    line = models.IntegerField()
    transfer_available = models.JSONField(default=list)

    class Meta:
        unique_together = [('station_id', 'direction')]

    def __str__(self):
        return f'{self.name}-{self.station_id}-{self.direction}'
