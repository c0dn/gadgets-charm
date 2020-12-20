import json

import requests
import stripe
from django.conf import settings
from django.http.response import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt

from cart.models import Cart, Entry
from store.models import Product


@csrf_exempt
def cart_api(request):
    if not request.user.is_authenticated:
        return HttpResponse(status=403)
    else:
        if request.method == "GET":
            cart_id = Cart.objects.get(user=request.user.id).id
            cart_data = Entry.objects.filter(cart=cart_id).distinct().values_list("product", flat=True)
            entry_ids = Entry.objects.filter(cart=cart_id).distinct().values_list("id", flat=True)
            cart_list = list(cart_data)
            entry_list = list(entry_ids)
            count = 0
            data_dict = {
                "Total": Cart.objects.get(user=request.user.id).total,
                "items": []
            }
            for x in cart_list:
                if x == None:
                    return JsonResponse(data_dict)
                else:
                    product = Product.objects.get(pk=x)
                    product_dict = {
                        "id": product.pk,
                        "item": product.item,
                        "img": product.img1.url,
                        "unit_price": float(product.unit_price),
                        "max_quantity": product.quantity,
                        "quantity": Entry.objects.get(id=entry_list[count]).quantity
                    }
                    count += 1
                    data_dict["items"].append(product_dict)
            return JsonResponse(data_dict)
        elif request.method == "POST":
            post_data = json.loads(request.body)
            if post_data["type"] == "UPDATE":
                field_data = post_data["items"]
                for y in field_data:
                    cart = Cart.objects.get(user=request.user.id)
                    product = Product.objects.get(id=int(y["id"]))
                    old_quantity = Entry.objects.get(product=product).quantity
                    old = Entry.objects.get(product=product)
                    old.quantity = int(y["quantity"])
                    if int(y["quantity"]) > old_quantity:
                        old.save(update_fields=['quantity'])
                    else:
                        old.save()
                data_dict = {
                    "status": "OK",
                    "Total": Cart.objects.get(user=request.user.id).total,
                    "items": []
                }
                cart_id = Cart.objects.get(user=request.user.id).id
                cart_data = Entry.objects.filter(cart=cart_id).distinct().values_list("product", flat=True)
                entry_ids = Entry.objects.filter(cart=cart_id).distinct().values_list("id", flat=True)
                cart_list = list(cart_data)
                entry_list = list(entry_ids)
                count = 0
                for x in cart_list:
                    if x == None:
                        return JsonResponse(data_dict)
                    else:
                        product = Product.objects.get(pk=x)
                        product_dict = {
                            "id": product.pk,
                            "item": product.item,
                            "img": product.img1.url,
                            "unit_price": float(product.unit_price),
                            "max_quantity": product.quantity,
                            "quantity": Entry.objects.get(id=entry_list[count]).quantity
                        }
                        count += 1
                        data_dict["items"].append(product_dict)
                return JsonResponse(data_dict)
            elif post_data["type"] == "CREATE":
                field_data = post_data["items"]
                for y in field_data:
                    cart = Cart.objects.get(user=request.user.id)
                    product = Product.objects.get(id=int(y["id"]))
                    Entry.objects.create(cart=cart, product=product, quantity=int(y["quantity"]))
                data_dict = {
                    "status": "OK",
                    "Total": Cart.objects.get(user=request.user.id).total,
                    "items": []
                }
                cart_id = Cart.objects.get(user=request.user.id).id
                cart_data = Entry.objects.filter(cart=cart_id).distinct().values_list("product", flat=True)
                entry_ids = Entry.objects.filter(cart=cart_id).distinct().values_list("id", flat=True)
                cart_list = list(cart_data)
                entry_list = list(entry_ids)
                count = 0
                for x in cart_list:
                    if x == None:
                        return JsonResponse(data_dict)
                    else:
                        product = Product.objects.get(pk=x)
                        product_dict = {
                            "id": product.pk,
                            "item": product.item,
                            "img": product.img1.url,
                            "unit_price": float(product.unit_price),
                            "max_quantity": product.quantity,
                            "quantity": Entry.objects.get(id=entry_list[count]).quantity
                        }
                        count += 1
                        data_dict["items"].append(product_dict)
                return JsonResponse(data_dict)
            elif post_data["type"] == "DELETE":
                field_data = post_data["items"]
                for y in field_data:
                    cart = Cart.objects.get(user=request.user.id)
                    product = Product.objects.get(id=int(y["id"]))
                    Entry.objects.get(cart=cart, product=product).delete()
                data_dict = {
                    "status": "OK",
                    "Total": Cart.objects.get(user=request.user.id).total,
                    "items": []
                }
                cart_id = Cart.objects.get(user=request.user.id).id
                cart_data = Entry.objects.filter(cart=cart_id).distinct().values_list("product", flat=True)
                entry_ids = Entry.objects.filter(cart=cart_id).distinct().values_list("id", flat=True)
                cart_list = list(cart_data)
                entry_list = list(entry_ids)
                count = 0
                for x in cart_list:
                    if x == None:
                        return JsonResponse(data_dict)
                    else:
                        product = Product.objects.get(pk=x)
                        product_dict = {
                            "id": product.pk,
                            "item": product.item,
                            "img": product.img1.url,
                            "unit_price": float(product.unit_price),
                            "max_quantity": product.quantity,
                            "quantity": Entry.objects.get(id=entry_list[count]).quantity
                        }
                        count += 1
                        data_dict["items"].append(product_dict)
                return JsonResponse(data_dict)
            else:
                return HttpResponse(status=405)
        else:
            return HttpResponse(status=405)


@csrf_exempt
def locate_api(request):
    if request.method == "POST":
        referer_allow = ["https://gadgetscharm.com/account/", "https://127.0.0.1:8000/account/"]
        print(request.headers)
        if request.headers.get("Referer") in referer_allow:
            post_data = json.loads(request.body)
            google_url = "https://maps.googleapis.com/maps/api/geocode/json"
            params = {
                "latlng": str(post_data["lat"]) + "," + str(post_data["lng"]),
                "key": "AIzaSyCJeCgCVHJ2CBFy8zzmAxKdku0TOKRju6E"
            }
            location = requests.get(google_url, params=params)
            return HttpResponse(location.text)
        else:
            HttpResponse(status=403)
    else:
        return HttpResponse(status=405)


def items_api(request):
    if request.method == "GET":
        products = Product.objects.all()
        data_dict = {
            "items": []
        }
        for x in products:
            product_dict = {
                "id": x.id,
                "item": x.item,
                "desc": x.desc,
                "category": x.category.title,
                "max": x.quantity,
                "price": x.unit_price,
                "img1": x.img1.url,
            }
            if x.img2:
                product_dict["img2"] = x.img2.url
            elif x.img3:
                product_dict["img3"] = x.img3.url
            elif x.img4:
                product_dict["img4"] = x.img4.url
            data_dict["items"].append(product_dict)
        return JsonResponse(data_dict)
    else:
        return HttpResponse(status=405)


@csrf_exempt
def charge(request):
    domain_name = "https://127.0.0.1:8000"
    stripe.api_key = settings.STRIPE_SECRET_KEY
    stripe_items = []
    if request.method == "POST":
        if not request.user.is_authenticated:
            return HttpResponse(status=403)
        else:
            post_data = json.loads(request.body)
            for x in post_data["items"]:
                item_data = Product.objects.get(id=int(x["id"]))
                item_img_list = []
                img_url = domain_name + item_data.img1.url
                item_img_list.append(img_url)
                item_price = int(item_data.unit_price * 100)
                item_dict = {
                    "name": item_data.item,
                    "description": item_data.desc[:100],
                    "images": item_img_list,
                    "amount": item_price,
                    "currency": "sgd",
                    "quantity": int(x["quantity"])
                }
                stripe_items.append(item_dict)
            session = stripe.checkout.Session.create(
                payment_method_types=["card"],
                line_items=stripe_items,
                success_url=domain_name + "/checkout/charge/success/",
                cancel_url=domain_name + "/checkout/charge/cancel/",
            )
            json_response = {
                "status": "ok",
                "id": session["id"]
            }
            return JsonResponse(json_response)
    else:
        return HttpResponse(status=405)


@csrf_exempt
def clearCart(request):
    if request.method == "POST":
        if not request.user.is_authenticated:
            return HttpResponse(status=403)
        else:
            Cart.objects.get(user=request.user.id).total = 0
            Cart.objects.get(user=request.user.id).count = 0
            Cart.objects.get(user=request.user.id).save()
            entry_ids = Entry.objects.filter(cart=Cart.objects.get(user=request.user.id).id).distinct().values_list(
                "id", flat=True)
            entry_list = list(entry_ids)
            Entry.objects.filter(id__in=tuple(entry_list)).delete()
            res = {
                "status": "OK"
            }
            return JsonResponse(res)
    else:
        return HttpResponse(status=405)


@csrf_exempt
def crack_api(request):
    return HttpResponse("0")
