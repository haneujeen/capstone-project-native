from rest_framework import serializers
from .models import SubwayStation

class SubwayStationSerializer(serializers.ModelSerializer):
    next_station = serializers.SerializerMethodField()  # Define a custom serializer method field

    class Meta:
        model = SubwayStation
        fields = ['id', 'station_id', 'name', 'direction', 'next_station', 'line', 'transfer_available']

    def get_next_station(self, obj):
        # Serialize the next_station field as a dictionary with id and name
        if obj.next_station:
            return {'id': obj.next_station.station_id, 'name': obj.next_station.name}
        return None
