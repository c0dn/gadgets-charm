from django.shortcuts import render
from django.views.generic.detail import DetailView

from .models import Product


def StoreView(request):
    context = {}
    if request.GET.get("search"):
        if request.GET.get("cat") and request.GET.get("cat") != "null":
            cat_filter = Product.objects.filter(category=request.GET.get("cat"))
            search_q = request.GET.get("search")
            item_results = cat_filter.filter(item__contains=search_q)
            brand_results = cat_filter.filter(brand=search_q.capitalize())
            context["products"] = brand_results | item_results
            context["search"] = search_q
            context["cat"] = request.GET.get("cat")
        else:
            brand_results = Product.objects.filter(brand=request.GET.get("search").capitalize())
            item_results = Product.objects.filter(item__contains=request.GET.get("search"))
            context["products"] = item_results | brand_results
            context["search"] = request.GET.get("search")
        return render(request, "storefront/search.html", context=context)
    elif request.GET.get("brand"):
        context["products"] = Product.objects.filter(brand=request.GET.get("brand").capitalize())
        context["branded"] = request.GET.get("brand").capitalize()
        return render(request, "storefront/search.html", context=context)
    elif request.GET.get("cat") and request.GET.get("cat") != "null":
        context["products"] = Product.objects.filter(category=request.GET.get("cat"))
        context["category"] = request.GET.get("cat")
        return render(request, "storefront/search.html", context=context)
    elif request.GET.get("from") == "search":
        context["products"] = Product.objects.all()
        context["all"] = True
        return render(request, "storefront/search.html", context=context)
    else:
        context["products"] = Product.objects.all()
    return render(request, "storefront/index.html", context=context)


class ProductDetail(DetailView):
    model = Product
    template_name = "storefront/item.html"
    context_object_name = "product"


def faq(request):
    return render(request, "storefront/faq.html")


def contact(request):
    return render(request, "storefront/contact-us.html")
