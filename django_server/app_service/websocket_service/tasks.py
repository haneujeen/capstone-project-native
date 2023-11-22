import openai
from django.conf import settings
from urllib.parse import unquote

OPENAI_API_KEY = unquote(settings.OPENAI_API_KEY)

openai.api_key = OPENAI_API_KEY

def get_audio(station, route):
    response = openai.Audio.speech.create(
        model="tts-1-hd",
        voice="alloy",
        input=f"탑승하신 버스 {route}의 이번 정거장은 {station}입니다."
    )

    return response.data.url