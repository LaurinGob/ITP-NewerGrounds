from django.contrib import admin
from .models import Game, Achievement, User_Has_Achievement

# Register your models here.
admin.site.register(Game)
admin.site.register(Achievement)
admin.site.register(User_Has_Achievement)