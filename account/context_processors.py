def include_user_forms(request):
    from account.forms import UserRegisterForm, UserLoginForm
    return {"s_form": UserRegisterForm, "l_form": UserLoginForm}