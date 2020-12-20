from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .forms import UserRegisterForm, UserUpdateForm, ProfileUpdateForm, ProfileImageForm
from django.contrib.messages.views import SuccessMessageMixin
from django.urls import reverse_lazy
from django.views import generic
from django.contrib import messages
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.forms import PasswordChangeForm
from django.http.response import HttpResponse
from django.contrib.auth import logout


class SignUpView(SuccessMessageMixin, generic.CreateView):
    form_class = UserRegisterForm
    template_name = "account/register.html"
    success_message = "Sign up succeeded. You can now Log in."
    success_url = reverse_lazy("login")
@login_required
def account(request):
    u_form = UserUpdateForm(instance=request.user)
    a_form = ProfileUpdateForm(instance=request.user.account)
    i_form = ProfileImageForm(instance=request.user.account)
    context = {
        "u_form": u_form,
        "a_form": a_form,
        "i_form": i_form,
    }
    return render(request, "account/account.html", context)
@login_required
def change_password(request):
    if request.method == "POST":
        p_form = PasswordChangeForm(request.user, request.POST)
        if p_form.is_valid():
            user = p_form.save()
            update_session_auth_hash(request, user)
            return redirect("account-info")
    else:
        return HttpResponse(status=405)
@login_required
def change_address(request):
    if request.method == "POST":
        a_form = ProfileUpdateForm(request.POST, instance=request.user.account)
        if a_form.is_valid():
            a_form.save()
            return redirect("account-info")
    else:
        return HttpResponse(status=405)
@login_required
def change_profile(request):
    if request.method == "POST":
        u_form = UserUpdateForm(request.POST, instance=request.user)
        if u_form.is_valid():
            u_form.save()
            return redirect("account-info")
    else:
        return HttpResponse(status=405)
@login_required
def change_image(request):
    if request.method == "POST":
        i_form = ProfileImageForm(request.POST, request.FILES, instance=request.user.account)
        if i_form.is_valid():
            i_form.save()
            return redirect("account-info")
    else:
        return HttpResponse(status=405)
