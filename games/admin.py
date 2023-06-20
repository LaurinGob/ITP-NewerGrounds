from django.contrib import admin
from .models import Game, Achievement

# Define how Achievement should be displayed in Admin panel 
class AchievementAdmin(admin.ModelAdmin):
    list_display = ["id", "title", "description", "game"] 


# Register your models here
admin.site.register(Game)
admin.site.register(Achievement, AchievementAdmin)