from django.urls import path, include

from .views import get_all_games, unlock_achievement

urlpatterns = [
    path('games/', get_all_games),
    path('unlock/<int:achievement_id>', unlock_achievement)
]