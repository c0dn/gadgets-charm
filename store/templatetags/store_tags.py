from django import template
from store.models import Product

register = template.Library()

@register.simple_tag
def get_cat_name(item_pk):
  return Product.objects.get(pk=item_pk).category.title

@register.simple_tag
def get_cat_url(item_pk):
  cat_id = str(Product.objects.get(pk=item_pk).category.id)
  url = "/?search=&cat="+cat_id
  return url