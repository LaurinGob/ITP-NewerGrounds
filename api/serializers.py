from django.urls import reverse
from django.templatetags.static import static

from rest_framework import serializers

from games.models import Game

class GameSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField(read_only=True)
    description = serializers.CharField(read_only=True)
    url = serializers.SerializerMethodField()
    thumbnail = serializers.SerializerMethodField()

    def get_url(self, object: Game):
        return reverse(object.view_name)
    
    def get_thumbnail(self, object: Game):
        # Doing it this way sucks ass:
        return static('games/' + object.view_name + '/thumbnail.png') 
        

class AchievementSerializer(serializers.Serializer):
    title = serializers.CharField(read_only=True)
    description = serializers.CharField(read_only=True)