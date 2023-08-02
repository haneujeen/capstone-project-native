import requests
from django.core.management.base import BaseCommand
from django.conf import settings
from urllib.parse import unquote
from openapi_seoul_service.models import SubwayStation, SubwayStationInformation
import openai
import json

SEOUL_API_KEY = unquote(settings.SEOUL_API_KEY)

class Command(BaseCommand):
    help = 'Update station facilities information'

    def generate_text(self, accessibility_info, poi_locator):
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo-16k",
            messages=[
                {
                    "role": "system",
                    "content": f"""
                        You're a friendly AI providing helpful and easy-to-understand information about the facilities 
                        available at each subway station and the instrunction to the subway users in Seoul 
                        with the given details:
                        Accessibility information: {accessibility_info}
                        POI locator: {poi_locator}
                    """
                },
                {
                    "role": "system",
                    "content": f"""
                        Include the following:
                        - A detailed paragraph explaining the accessibility information
                        - A sentence highlighting the most commonly visited POIs or most recognized places near the station the user might look for
                        - A detailed paragraph explaining the POI locator information, including all exits and nearby places
                    """
                },
                {
                    "role": "system",
                    "content": "User's device language is set to Korean."
                },
                {
                    "role": "system",
                    "content": """
                        Generate the message in the format of: 
                        {accessibility_information: "", POI_locator: {sentence: "", paragraph: ""}}
                    """
                },
                {
                    "role": "system",
                    "content": """
                        If Accessibility information or POI locator doesn't exist, leave corresponding value empty: 
                        {accessibility_information: "", POI_locator: {sentence: "", paragraph: ""}}
                    """
                },
            ],
            top_p=0.8,
            max_tokens=1200,
            frequency_penalty=0,
            presence_penalty=0
        )

        response_text = response.choices[0].message.content
        response_dict = json.loads(response_text)

        return response_dict

    def handle(self, *args, **options):
        stations = SubwayStation.objects.all()
        unique_station_names = set(station.name for station in stations)

        for station_name in unique_station_names:
            example_station = stations.filter(name=station_name).first()

            if example_station:
                if example_station.accessibility_information or example_station.POI_locator:
                    if not example_station.accessibility_information_text or not example_station.POI_locator_text:
                        print(f"Generating text for station: {station_name}")
                        response_dict = self.generate_text(example_station.accessibility_information,
                                                           example_station.POI_locator)

                        print(f"Updating text for all {station_name} stations")
                        stations_with_same_name = stations.filter(name=station_name)
                        for station in stations_with_same_name:
                            station.accessibility_information_text = response_dict['accessibility_information']
                            station.POI_locator_text = response_dict['POI_locator']
                            station.save()
                else:
                    print(f"No detail has been provided for station {station_name}")
                    pass
