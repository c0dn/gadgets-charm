from django.db.models.signals import post_save, pre_delete, pre_save
from django.dispatch import receiver

from .models import Entry


@receiver(post_save, sender=Entry)
def update_cart_add(sender, instance, update_fields, created, **kwargs):
    if created:
        line_cost = instance.quantity * instance.product.unit_price
        instance.cart.total += line_cost
        instance.cart.count += instance.quantity
        instance.cart.save()
    elif update_fields is not None:
        line_cost = instance.quantity * instance.product.unit_price
        instance.cart.total += line_cost
        instance.cart.count += instance.quantity
        instance.cart.save()


@receiver(pre_save, sender=Entry)
def update_cart_update(sender, instance, **kwargs):
    if instance.pk is not None:
        old = Entry.objects.get(pk=instance.pk)
        if old.quantity > instance.quantity:
            diff_quantity = old.quantity - instance.quantity
            line_cost = diff_quantity * old.product.unit_price
            old.cart.total -= line_cost
            old.cart.count -= instance.quantity
            old.cart.save()
        else:
            line_cost = old.quantity * old.product.unit_price
            old.cart.total -= line_cost
            old.cart.count -= old.quantity
            old.cart.save()


@receiver(pre_delete, sender=Entry)
def update_cart_destroy(sender, instance, **kwargs):
    old = Entry.objects.get(pk=instance.pk)
    line_cost = old.quantity * old.product.unit_price
    instance.cart.total -= line_cost
    instance.cart.count -= old.quantity
    instance.cart.save()
