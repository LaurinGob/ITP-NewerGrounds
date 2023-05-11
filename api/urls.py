from django.urls import path, include

from .views import get_all_games

urlpatterns = [
    path('games/', get_all_games),
]