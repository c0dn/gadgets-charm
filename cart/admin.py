from django.contrib import admin
from .models import Cart, Order, Entry


class EntryAdmin(admin.ModelAdmin):

    def save_model(self, request, obj, form, change):
        update_fields = []
        print("Test")
        if change:
            old = Entry.objects.get(pk=obj.pk)
            print("True")
            if obj.quantity < old.quantity:
                print("more")
                update_fields.append("less")
            else:
                print("less")
                update_fields.append("more")
            return super(EntryAdmin, self).save_model(request, obj, form, change)


admin.site.register(Cart)
admin.site.register(Order)
admin.site.register(Entry)
