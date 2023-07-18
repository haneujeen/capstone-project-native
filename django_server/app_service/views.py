from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import PushToken

# Create your views here.
@csrf_exempt
def save_token(request):
    if request.method == 'POST':
        token = request.POST.get('token')
        if token:
            PushToken.objects.get_or_create(token=token)
            return JsonResponse({'status': 'ok'})
        else:
            return JsonResponse({'status': 'error', 'message': 'No token provided'}, status=400)

@csrf_exempt
def delete_token(request):
    if request.method == 'POST':
        token = request.POST.get('token')
        if token:
            try:
                push_token = PushToken.objects.get(token=token)
                push_token.delete()
                return JsonResponse({'status': 'ok'})
            except PushToken.DoesNotExist:
                return JsonResponse({'status': 'error', 'message': 'Token does not exist'}, status=400)
        else:
            return JsonResponse({'status': 'error', 'message': 'No token provided'}, status=400)
