from django.shortcuts import render, redirect
from django.http import HttpResponse, Http404, HttpRequest
from django.contrib.auth import authenticate, login, logout

from django.contrib import messages

from .forms import LoginForm, RegisterForm
from .models import User

# Create your views here.
def index(request: HttpRequest):
    return render(request, 'core/index.html')

def contact(request: HttpRequest):
    return render(request, 'core/contact.html')

def self_profile(request: HttpRequest):
    if request.user.is_authenticated:
        return redirect(f'profile/{request.user.username}')
    else:
        return redirect('login/', permanent=True)

def profile(request: HttpRequest, username: str):
    try:
        user = User.objects.get(username=username)
        return render(request, 'core/profile.html', {'user': user})
    except User.DoesNotExist:
        return render(request, 'core/profile_404.html')

def vw_login(request: HttpRequest):
    form = LoginForm

    if request.user.is_authenticated:
        messages.error(request, "Sie sind bereits eingeloggt")

    # If user has submitted the form
    elif request.method == "POST":
        form = LoginForm(request.POST)

        if form.is_valid():
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']

            user = authenticate(request, email=email, password=password)

            if user is None:
                messages.error(request, "E-Mail oder Passwort falsch")
            else:
                login(request, user)
                messages.success(request, "Login erfolgreich")
                form = LoginForm
        
        else:
            messages.error(request, str(form.errors))
    
    context = {'form': form}  # make a variable by the name of 'form' available to the login.html template; the LoginForm will be its value
    return render(request, 'core/login.html', context)


def vw_register(request: HttpRequest):
    form = RegisterForm

    if request.user.is_authenticated:
        messages.error(request, "Sie sind bereits eingeloggt")

    # If user has submitted the form
    if request.method == "POST":
        form = RegisterForm(request.POST)

        if form.is_valid():
            email = form.cleaned_data['email']
            username = form.cleaned_data['username']
            pw1 = form.cleaned_data['password']
            pw2 = form.cleaned_data['password2']

            # Further validation
            if pw1 != pw2:
                messages.error(request, "Passwörter stimmen nicht überein")

            try:
                User.objects.get(username=username)  # wirft DoesNotExist exception auf, wenn Nutzer mit Nutzernamen nicht gefunden wurde
                messages.error(request, "Nutzername ist bereits vergeben")
            except User.DoesNotExist:
                pass

            try:
                User.objects.get(email=email)  # wirft DoesNotExist exception auf, wenn Nutzer mit E-Mail nicht gefunden wurde
                messages.error(request, "E-Mail Addresse ist bereits registriert")
            except User.DoesNotExist:
                pass
            
            
            # If no errors, register
            if not messages.get_messages(request):
                try:
                    user = User(username=username, email=email)
                    user.set_password(pw1)
                    user.save()

                    messages.success(request, f"Erfolgreich registriert als {user.username}")

                except Exception as database_error:  # Just in case user.save() throws errors; i.e. if the DB server is down
                    messages.error(request, str(database_error))


        else:  # If form was filled out invalidly (i.e. max_length of username was exceeded)
            for field in form.errors:
                for error in form.errors[field]:
                    messages.error(request, f"{field}: {str(error)}")  # produces "username: maximum length is 20 characters" error message


    context = {'form': form}

    return render(request, 'core/register.html', context)