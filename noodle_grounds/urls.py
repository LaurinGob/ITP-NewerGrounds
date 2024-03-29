"""
URL configuration for noodle_grounds project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from core.views import vw_login, vw_register, index, contact, self_profile, profile
from games.views import sampleGame  # Hier die Minispiel View von /games/views.py importieren
from games.views import rockinramen
from games.views import playerexample
from games.views import noodleJump
from games.views import flappyNoodle

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Core
    path('', index, name='index'),
    path('login/', vw_login, name="login"),
    path('register/', vw_register, name="register"),
    path('contact', contact, name="contact"),
    path('profile', self_profile, name="profile"),
    path('profile/<str:username>', profile, name="profile"),
    
    # Games; hier Pfad zur Minispiel View definieren
    path('sampleGame', sampleGame, name="sampleGame"),
    path('rockinramen', rockinramen, name="rockinramen"),
    path('playerexample', playerexample, name="playerexample"),
    path('noodleJump', noodleJump, name="noodleJump"),
    path('flappyNoodle', flappyNoodle, name="flappyNoodle"),

    # API
    path('api/', include('api.urls')),
]
