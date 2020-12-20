from django import template

register = template.Library()


@register.simple_tag
def total_price(num1, num2):
    return num1 * num2


@register.simple_tag
def cart_total(cart):
    value = str(int(cart.total)) + "00"
    return int(value)
