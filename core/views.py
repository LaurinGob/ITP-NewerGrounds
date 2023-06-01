from django.shortcuts import render
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

def vw_login(request: HttpRequest):
    # If user is requesting site    
    if request.method == "GET":
        form = LoginForm

    # If user has submitted the form
    elif request.method == "POST":
        form = LoginForm(request.POST)
        context = {}

        if form.is_valid():
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']

            user = authenticate(request, email=email, password=password)

            if user is not None:
                login(request, user)
                context['message'] = "Login erfolgreich"
            else:
                context['message'] = "E-Mail oder Passwort falsch"
        
        else:
            context['message'] = "Login fehlgeschlagen"
            context['errors'] = str(form.errors)
    
    context = {'form': form}  # make a variable by the name of 'form' available to the login.html template; the LoginForm will be its value
    return render(request, 'core/login.html', context)


def vw_register(request: HttpRequest):
    has_error_messages = False
    has_success_messages = False

    # If user is requesting site
    if request.method == "GET":
        form = RegisterForm

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
            
            
            
            if messages.get_messages(request):
                # if error messages:
                has_error_messages = True
            else:  
                # if no errors, save user to DB:
                try:
                    user = User(username=username, email=email)
                    user.set_password(pw1)
                    user.save()

                    messages.success(request, f"Erfolgreich registriert als {user.username}")
                    has_success_messages = True

                except Exception as database_error:  # Just in case user.save() throws errors; i.e. if the DB server is down
                    messages.error(request, str(database_error))
                    has_error_messages = True

        else:
            # Print issues if form was filled out incorrectly 
            # typically triggered when front-end checks (i.e. max_length HTML attribute) are bypassed by user
            has_error_messages = True
            for field in form.errors:
                for error in form.errors[field]:
                    messages.error(request, f"{field}: {str(error)}")  # produces "username: maximum length is 20 characters" error message


    context = {'form': form,
               'has_error_messages': has_error_messages,
               'has_success_messages': has_success_messages}

    return render(request, 'core/register.html', context)