from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from .models import Account
from captcha.fields import ReCaptchaField
from django.contrib.auth.forms import AuthenticationForm


class UserRegisterForm(UserCreationForm):
    email = forms.EmailField()
    captcha = ReCaptchaField()
    first_name = forms.CharField(max_length=15, label='First name')
    last_name = forms.CharField(max_length=15, label='Last name')

    class Meta:
        model = User
        fields = ["first_name", "last_name", "username", "email", "password1", "password2"]
        help_texts = {
            "username": None
        }


class UserLoginForm(AuthenticationForm):
    captcha = ReCaptchaField()


class UserUpdateForm(forms.ModelForm):
    email = forms.EmailField()

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'username', 'email']


class ProfileUpdateForm(forms.ModelForm):
    class Meta:
        model = Account
        fields = ["Zip_code", "street_address1", "street_address2", "city", "state", "phone"]


class ProfileImageForm(forms.ModelForm):
    class Meta:
        model = Account
        fields = ["image"]
