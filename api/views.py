from django.shortcuts import render
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.utils import timezone

from rest_framework.decorators import api_view

from games.models import Game, Achievement
from .serializers import GameSerializer

# Create your views here.
@api_view(["GET"])
def get_all_games(request: HttpRequest):
    games = Game.objects.all()
    serializer = GameSerializer(games, many=True)

    return JsonResponse(serializer.data, safe=False)    


@api_view(["GET"])
def unlock_achievement(request: HttpRequest, achievement_id: int):
    # Check that user exists
    if not request.user.is_authenticated:
        return HttpResponse(content="Must be logged in", status=403)  # Forbidden
    
    # Find achievement; error out if achievement doesn't exist
    try:
        achievement = Achievement.objects.get(pk=achievement_id)
    except Achievement.DoesNotExist:
        return HttpResponse(content="No such achievement ID exists", status=400)  # Bad Request

    # Save achievement to user
    request.user.achievements.add(achievement)

    return HttpResponse(status=200)  # Success

