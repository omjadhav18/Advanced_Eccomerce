from rest_framework import serializers
from .models import Category,Product,Gallery,Specification,Size,Color,Cart,CartOrder,CartOrderItem,ProductFaq,Review,Wishlist,Notification,Coupon
from vendor.models import Vendor
from userauths.serializers import ProfileSerializer


class CategorySerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Category
        fields= "__all__"

class GallerySerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Gallery
        fields= "__all__"

class SpecificationSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Specification
        fields= "__all__"

class SizeSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Size
        fields= "__all__"
    
class ColorSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Color
        fields= "__all__"


class ProductSerializer(serializers.ModelSerializer):
    gallery = GallerySerializer(many=True,read_only=True)
    color = ColorSerializer(many=True,read_only=True)
    specification = SpecificationSerializer(many=True,read_only=True)
    size = SizeSerializer(many=True,read_only=True)

    class Meta:
        model = Product
        fields = [ 
            'id',
            'title',
            'image',
            'description',
            'category',
            'price',
            'old_price',
            'shipping_amount',
            'stock_qty',
            'in_stock',
            'status',
            'featured',
            'views',
            'vendor',
            'gallery',
            'color',
            'orders',
            'specification',
            'size',
            'product_rating',
            'rating_count',
            'pid',
            'slug',
            'date',
        ]

    def __init__(self,*args,**kwargs):
        super(ProductSerializer,self).__init__(*args,**kwargs)
        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3

    
class CartSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Cart
        fields= "__all__"
    
    def __init__(self,*args,**kwargs):
        super(CartSerializer,self).__init__(*args,**kwargs)
        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3
            
class CartOrderSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = CartOrder
        fields= "__all__"
    
    def __init__(self,*args,**kwargs):
        super(CartOrderSerializer,self).__init__(*args,**kwargs)
        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3

class CartOrderItemSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = CartOrderItem
        fields= "__all__"
    
    def __init__(self,*args,**kwargs):
        super(CartOrderItemSerializer,self).__init__(*args,**kwargs)
        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3


class ProductFaqSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = ProductFaq
        fields= "__all__"
    
    def __init__(self,*args,**kwargs):
        super(ProductFaqSerializer,self).__init__(*args,**kwargs)
        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3

class VendorSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Vendor
        fields= "__all__"
    
    def __init__(self,*args,**kwargs):
        super(VendorSerializer,self).__init__(*args,**kwargs)
        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3

class ReviewSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()
    class Meta:
        model = Review
        fields= ["id","review","rating","product","reply","profile","date"]
    
    def __init__(self,*args,**kwargs):
        super(ReviewSerializer,self).__init__(*args,**kwargs)
        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3

class WishlistSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Wishlist
        fields= "__all__"
    
    def __init__(self,*args,**kwargs):
        super(WishlistSerializer,self).__init__(*args,**kwargs)
        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3

class CouponSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Coupon
        fields= "__all__"
    
    def __init__(self,*args,**kwargs):
        super(CouponSerializer,self).__init__(*args,**kwargs)
        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3

class NotificationSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Notification
        fields= "__all__"
    
    def __init__(self,*args,**kwargs):
        super(NotificationSerializer,self).__init__(*args,**kwargs)
        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3


class SummarySerializer(serializers.Serializer):
    products = serializers.IntegerField()
    orders = serializers.IntegerField()
    revenue = serializers.DecimalField(max_digits=12,decimal_places=2)
    
class EaningSerializer(serializers.Serializer):
    monthly_revenue = serializers.DecimalField(max_digits=12,decimal_places=2)
    total_revenue = serializers.DecimalField(max_digits=12,decimal_places=2)
    

class CouponSummarySerializer(serializers.Serializer):
    total_coupons = serializers.IntegerField(default=0)
    active_coupons = serializers.IntegerField(default=0)


class NotificationSummarySerializer(serializers.Serializer):
    un_read_noti = serializers.IntegerField()
    read_noti = serializers.IntegerField()
    all_noti = serializers.IntegerField()