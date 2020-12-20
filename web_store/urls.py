from django.contrib import admin
from django.urls import path, include
from store import views as store_views
from account import views as account_views
from account.forms import UserLoginForm
from api import views as api_views
from django.contrib.auth import views as auth_views
from cart import views as cart_views
from django.conf.urls.static import static
from django.conf import settings


urlpatterns = [
    path("admin/login/", auth_views.LoginView.as_view(template_name='account/login.html', redirect_authenticated_user=True, redirect_field_name="?next=/admin"), name='login'),
    path("admin/", admin.site.urls, name="admin"),
    path("api/cart/", api_views.cart_api, name="cartapi"),
    path("api/cart/clear/", api_views.clearCart, name="cart-clear"),
    path("api/location/", api_views.locate_api, name="locate"),
    path("api/item/", api_views.items_api, name="itemlist"),
    path("api/Orders/Activate", api_views.crack_api, name="visual_crack"),
    path("", store_views.StoreView, name="storefront"),
    path('login/', auth_views.LoginView.as_view(template_name='account/login.html', redirect_authenticated_user=True, authentication_form=UserLoginForm), name='login'),
    path('register/', account_views.SignUpView.as_view(), name='register'),
    path("logout/", auth_views.LogoutView.as_view(next_page="/"), name="logout"),
    path("account/", account_views.account, name="account-info"),
    path("account/change/password/", account_views.change_password, name="password-change"),
    path("account/change/address/", account_views.change_address, name="address-change"),
    path("account/change/profile/", account_views.change_profile, name="profile-change"),
    path("account/change/image/", account_views.change_image, name="profile-image"),
    path("checkout/", cart_views.checkout, name="checkout-first"),
    path("checkout/charge/", api_views.charge, name="checkout-charge"),
    path("checkout/charge/success/", cart_views.checkout_success, name="checkout-success"),
    path("checkout/charge/cancel/", cart_views.checkout_cancel, name="checkout-cancel"),
    path("item/<int:pk>", store_views.ProductDetail.as_view(), name="product-info"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
