# Generated by Django 4.1.5 on 2023-06-20 21:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('games', '0003_rename_folder_name_game_internal_name'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='achievement',
            name='user',
        ),
        migrations.AlterField(
            model_name='game',
            name='internal_name',
            field=models.CharField(help_text='<b>Beispiel:</b> Wenn in urls.py name="noodle_jump" und der static Ordner für noodle_jump="/games/static/games/noodle_jump/", dann ist internal_name als "noodle_jump" zu wählen', max_length=255, unique=True),
        ),
        migrations.DeleteModel(
            name='User_Has_Achievement',
        ),
    ]
