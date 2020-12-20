from django.db import models
from django.contrib.auth.models import User


class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    count = models.PositiveIntegerField(default=0)
    total = models.DecimalField(default=0.00, max_digits=10, decimal_places=2)

    def __str__(self):
        return "User: %s has %d items in their cart. Their total is $%.2f" % (self.user, self.count, self.total)


class Entry(models.Model):
    product = models.ForeignKey("store.Product", null=True, on_delete=models.DO_NOTHING)
    cart = models.ForeignKey("Cart", null=True, on_delete=models.DO_NOTHING)
    quantity = models.PositiveIntegerField()

    def __init__(self, *args, **kwargs):
        super(Entry, self).__init__(*args, **kwargs)
        self.__original_quantity = self.quantity

    def __str__(self):
        return "This entry contains %s %s(s)." % (self.quantity, self.product.item)


class Order(models.Model):
    paid = models.BooleanField(default=False)
    cart = models.ForeignKey('Cart', on_delete=models.CASCADE, null=True, blank=True)
    entry = models.ForeignKey("Entry", on_delete=models.CASCADE, null=True, blank=True)
    user = models.ForeignKey(User, related_name="orders", on_delete=models.CASCADE)
