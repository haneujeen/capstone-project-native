from django.http import JsonResponse
import requests

def send_push_notification(token, station_name):
    headers = {
        'Accept': 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
    }

    message = {
        'to': token,
        'sound': 'default',
        'title': 'Original Title',
        'body': f'And here is the body? {station_name}',
        'data': {'someData': 'goes here'},
    }

    response = requests.post('https://exp.host/--/api/v2/push/send', json=message, headers=headers)

    return JsonResponse({'success': response.status_code == 200})
