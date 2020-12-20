from django.conf import settings
from django.shortcuts import render

from .models import Cart, Entry


def checkout(request):
    if request.user.is_authenticated:
        cart_id = Cart.objects.get(user=request.user.id).id
        entry_ids = Entry.objects.filter(cart=cart_id).distinct().values_list("id", flat=True)
        entry_list = list(entry_ids)
        entry_ids = []
        for x in entry_list:
            entry_ids.append(x)
        context = {
            "cart": Cart.objects.get(user=request.user.id),
            "stripe_key": settings.STRIPE_PUBLISHABLE_KEY,
            "entries": Entry.objects.filter(id__in=tuple(entry_ids))
        }
    else:
        context = {}
    return render(request, "cart/checkout.html", context=context)


def checkout_success(request):
    return render(request, "cart/success.html")


def checkout_cancel(request):
    return render(request, "cart/cancel.html")
