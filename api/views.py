from django.shortcuts import render
from django.http import HttpRequest, JsonResponse

from rest_framework.decorators import api_view

from games.models import Game
from .serializers import GameSerializer

# Create your views here.
@api_view(["GET"])
def get_all_games(request: HttpRequest):
    games = Game.objects.all()
    serializer = GameSerializer(games, many=True)

    return JsonResponse(serializer.data, safe=False)    