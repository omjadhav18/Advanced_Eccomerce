from django.contrib import admin
from .models import Category,Product,Gallery,Specification,Size,Color,Cart,CartOrder,CartOrderItem,ProductFaq,Review,Notification,Coupon,Wishlist,Tax

class GalleryInline(admin.TabularInline):
    model= Gallery
    extra=0

class SpecificatonInline(admin.TabularInline):
    model= Specification

class SizeInline(admin.TabularInline):
    model= Size

class ColorInline(admin.TabularInline):
    model= Color

class ProductAdmin(admin.ModelAdmin):
    list_display=('title','price','shipping_amount','stock_qty','in_stock','vendor','featured')
    list_editable=['stock_qty','in_stock','featured']
    inlines = [GalleryInline, SpecificatonInline, SizeInline, ColorInline]

class CartOrderAdmin(admin.ModelAdmin):
    list_display=('oid','payment_status','total',)

admin.site.register(Category)
admin.site.register(Product,ProductAdmin)
admin.site.register(Cart)
admin.site.register(CartOrder,CartOrderAdmin)
admin.site.register(CartOrderItem)
admin.site.register(ProductFaq)
admin.site.register(Review)
admin.site.register(Notification)
admin.site.register(Coupon)
admin.site.register(Wishlist)
admin.site.register(Tax)

