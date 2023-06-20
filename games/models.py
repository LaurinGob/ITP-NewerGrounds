from django.db import models

# Create your models here.
class Game(models.Model):
    title = models.CharField(max_length=255)
    description = models.CharField(max_length=1023)

    # Should be the same as templates/games/<gamefolder> *and* the same as what's in urls.py after name=
    internal_name = models.CharField(max_length=255, unique=True,
                                     help_text='<b>Beispiel:</b> Wenn in urls.py name="noodle_jump" und der static Ordner für noodle_jump="/games/static/games/noodle_jump/", dann ist internal_name als "noodle_jump" zu wählen')  
    
    def __str__(self):
        return self.title


class Achievement(models.Model):
    title = models.CharField('achievement title', max_length=50)
    description = models.CharField('achievement description', max_length=255)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)

    def __str__(self):
        return self.game.title + ': ' + self.title