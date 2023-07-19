import requests
import json


def send_push_message(to, title, body):
    print("sending push")
    headers = {
        'host': 'exp.host',
        'content-type': 'application/json',
        'accept': 'application/json',
        'accept-encoding': 'gzip, deflate',
        'user-agent': 'expo-server-sdk-python'
    }
    data = {
        "to": to,
        "title": title,
        "body": body,
        "sound": "default",
        "priority": "high",
        "_displayInForeground": True
    }
    response = requests.post('https://exp.host/--/api/v2/push/send', headers=headers, data=json.dumps(data))
    return response
