from django import forms

class LoginForm(forms.Form):
    email = forms.EmailField(max_length=255,
                             widget=forms.EmailInput(attrs={'class': 'form-control', 
                                                            'placeholder': 'E-Mail'}))

    password = forms.CharField(max_length=255,
                               widget=forms.PasswordInput(attrs={'class': 'form-control', 
                                                                 'placeholder': 'Passwort'}))


class RegisterForm(LoginForm):
    username = forms.CharField(max_length=20,
                               widget=forms.TextInput(attrs={'class': 'form-text', 
                                                             'placeholder': 'Nutzername'}))

    password2 = forms.CharField(max_length=255,
                               widget=forms.PasswordInput(attrs={'class': 'form-text', 
                                                                 'placeholder': 'Passwort wiederholen'}))