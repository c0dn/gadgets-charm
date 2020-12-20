from django.db import models
from PIL import Image


class Category(models.Model):
    title = models.CharField(max_length=255, verbose_name="Title")

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"
        ordering = ["title"]

    def __str__(self):
        return self.title


class Product(models.Model):
    item = models.CharField(max_length=50)
    id_name = models.CharField(max_length=50, default="None")
    brand = models.CharField(max_length=50, default="None")
    category = models.ForeignKey(Category, verbose_name="Category", on_delete=models.DO_NOTHING, blank=True, null=True)
    desc = models.TextField(max_length=600)
    html = models.TextField(max_length=2000, null=True, blank=True)
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=6, decimal_places=2)
    img1 = models.ImageField(upload_to="images/stuff")
    img2 = models.ImageField(null=True, blank=True, upload_to="images/stuff")
    img3 = models.ImageField(null=True, blank=True, upload_to="images/stuff")
    img4 = models.ImageField(null=True, blank=True, upload_to="images/stuff")

    def __str__(self):
        return self.item

    def save(self, *args, **kwargs):
        super(Product, self).save(*args, **kwargs)
        image = Image.open(self.img1.path)
        if image.height > 600 or image.width > 600:
            output_size = (600, 600)
            image.thumbnail(output_size)
            image.save(self.img1.path)
        if self.img2 != None:
            image = Image.open(self.img2.path)
            if image.height > 600 or image.width > 600:
                output_size = (600, 600)
                image.thumbnail(output_size)
                image.save(self.img2.path)
        if self.img3 != None:
            image = Image.open(self.img3.path)
            if image.height > 600 or image.width > 600:
                output_size = (600, 600)
                image.thumbnail(output_size)
                image.save(self.img3.path)
        if self.img4 != None:
            image = Image.open(self.img4.path)
            if image.height > 600 or image.width > 600:
                output_size = (600, 600)
                image.thumbnail(output_size)
                image.save(self.img4.path)
