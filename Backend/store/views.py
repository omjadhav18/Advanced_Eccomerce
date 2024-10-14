from django.shortcuts import render,redirect
from userauths.models import User
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string


from .models import Product,Category,Cart,Tax,CartOrder,CartOrderItem,Coupon,Notification,Review
from .serializers import ProductSerializer,CategorySerializer,CartSerializer,CartOrderSerializer,CouponSerializer,NotificationSerializer,ReviewSerializer
from rest_framework import generics,status
from rest_framework.permissions import AllowAny,IsAuthenticated
from decimal import Decimal
from rest_framework.response import Response
import stripe

stripe.api_key = settings.STRIPE_SECRET_KEY

def send_notification(user=None,vendor=None,order=None,order_item=None):
    Notification.objects.create(
        user=user,
        vendor=vendor,
        order=order,
        order_item=order_item,
    )


class CategoryListAPIView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny,]

class ProductListAPIView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny,]

class ProductDetailAPIView(generics.RetrieveAPIView):
    serializer_class = ProductSerializer
    permission_classes=[AllowAny,]

    def get_object(self):
        slug = self.kwargs['slug']
        return Product.objects.get(slug=slug)


class CartAPIView(generics.ListCreateAPIView):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes =[AllowAny]

    def create(self,request,*args,**kwargs):
        payload  = request.data
        
        product_id=payload['product_id']
        user_id = payload['user_id']
        qty = payload['qty']
        price = payload['price']
        shipping_amount = payload['shipping_amount']
        country = payload['country']
        size = payload['size']
        color = payload['color']
        cart_id = payload['cart_id']

        product = Product.objects.get(id=product_id)
        # user = User.objects.get(id=user_id)
        if user_id != "undefined":
            user = User.objects.get(id=user_id)
        else:
            user = None

        tax = Tax.objects.filter(country=country).first()

        if tax:
            tax_rate = tax.rate/100
        else:
            tax_rate = 0
        
        
        cart = Cart.objects.filter(cart_id=cart_id,product=product,user=user).first()

        
        if cart:
            cart.product = product
            cart.user = user
            cart.qty = qty
            cart.price = price
            cart.sub_total = Decimal(price)*int(qty)
            cart.shipping_amount = Decimal(shipping_amount) * int(qty)
            cart.tax_fee = Decimal(tax_rate) * int(qty)
            cart.color = color
            cart.size = size
            cart.country = country
            cart.cart_id = cart_id

            service_fee_percentage = 10/100
            cart.service_fee = Decimal(service_fee_percentage) * cart.sub_total
            
            cart.total = cart.sub_total + cart.shipping_amount + cart.service_fee + cart.tax_fee
            cart.save()

            return Response({'message':"Cart Updated  successfully"},status=status.HTTP_200_OK)
        
        else:
            cart = Cart()
            cart.product = product
            cart.user = user
            cart.qty = qty
            cart.price = price
            cart.sub_total = Decimal(price)*int(qty)
            cart.shipping_amount = Decimal(shipping_amount) * int(qty)
            cart.tax_fee = Decimal(tax_rate) * int(qty)
            cart.color = color
            cart.size = size
            cart.country = country
            cart.cart_id = cart_id

            service_fee_percentage = 10/100
            cart.service_fee = Decimal(service_fee_percentage) * cart.sub_total
            
            cart.total = cart.sub_total + cart.shipping_amount + cart.service_fee + cart.tax_fee
            cart.save()

            return Response({'message':'Cart Created Successfully'},status=status.HTTP_201_CREATED)

class CartListAPIView(generics.ListAPIView):
    queryset=Cart.objects.all()
    permission_classes=[AllowAny]
    serializer_class=CartSerializer

    def get_queryset(self):
        cart_id=self.kwargs['cart_id']
        user_id=self.kwargs.get('user_id')

        if user_id is not None:
            user = User.objects.get(id=user_id)
            queryset = Cart.objects.filter(user=user,cart_id=cart_id)
        else:
            queryset = Cart.objects.filter(cart_id=cart_id)
        
        return queryset
    

class CartDetailView(generics.RetrieveAPIView):
    serializer_class = CartSerializer
    permission_classes = [AllowAny]
    lookup_field = "cart_id"

    def get_queryset(self):
        cart_id = self.kwargs['cart_id']
        user_id = self.kwargs.get('user_id')

        if user_id is not None:
            user = User.objects.get(id=user_id)
            queryset = Cart.objects.filter(user=user,cart_id=cart_id)

        else:
            queryset = Cart.objects.filter(cart_id=cart_id)

        return queryset

    def get(self,request, *args,**kwargs):
        queryset = self.get_queryset()

        total_shipping = 0.0
        total_tax = 0.0
        total_service_fee = 0.0
        total_sub_total = 0.0
        total_total = 0.0

        for cart_item in queryset:
            total_shipping += float(self.calculate_shipping(cart_item))
            total_tax += float(self.calculate_tax(cart_item))
            total_service_fee += float(self.calculate_service_fee(cart_item))
            total_sub_total += float(self.calculate_sub_total(cart_item))
            total_total += float(self.calculate_total(cart_item))
        
        data = {
            'shipping':total_shipping,
            'tax':total_tax,
            'service_fee':total_service_fee,
            'sub_total':total_sub_total,
            'total':total_total,
        }

        return Response(data)


    def calculate_shipping(self,cart_item):
        return cart_item.shipping_amount

    def calculate_tax(self,cart_item):
        return cart_item.tax_fee
    
    def calculate_service_fee(self,cart_item):
        return cart_item.service_fee
    
    def calculate_sub_total(self,cart_item):
        return cart_item.sub_total
    
    def calculate_total(self,cart_item):
        return cart_item.total
    
    
class CartItemDeleteAPIView(generics.DestroyAPIView):
    serializer_class = CartSerializer
    lookup_field = 'cart_id'

    def get_object(self):
        cart_id = self.kwargs['cart_id']
        item_id = self.kwargs['item_id']
        user_id = self.kwargs.get('user_id')

        if user_id:
            user = User.objects.get(id=user_id)
            cart = Cart.objects.get(id=item_id,cart_id=cart_id,user=user)
        else:
            cart = Cart.objects.get(id=item_id,cart_id=cart_id)
        
        return cart
    

class CreateOrderAPIView(generics.CreateAPIView):
    serializer_class = CartOrderSerializer
    queryset = CartOrder.objects.all()
    permission_classes = [AllowAny]

    def create(self,request):
        payload = request.data

        full_name = payload['full_name']
        email = payload['email']
        mobile = payload['mobile']
        address = payload['address']
        city = payload['city']
        state = payload['state']
        country = payload['country']
        cart_id = payload['cart_id']
        user_id = payload['user_id']

        try:
            user = User.objects.get(id=user_id)
        except:
            user = None
        
        cart_items = Cart.objects.filter(cart_id=cart_id)

        total_shipping = Decimal(0.00)
        total_tax = Decimal(0.00)
        total_service_fee = Decimal(0.00)
        total_sub_total = Decimal(0.00)
        total_initial_total = Decimal(0.00)
        total_total = Decimal(0.00)

        order = CartOrder.objects.create(
            buyer = user,
            full_name=full_name,
            email = email,
            mobile = mobile,
            address = address,
            city = city,
            state = state,
            country = country,
        )

        for c in cart_items:
            CartOrderItem.objects.create(
                order = order,
                product = c.product,
                vendor = c.product.vendor,
                # qty = c.qty,
                color = c.color,
                size = c.size, 
                price = c.price,
                sub_total = c.sub_total,
                shipping_amount = c.shipping_amount,
                service_fee = c.service_fee,
                tax_fee = c.tax_fee,
                total = c.total,
                intial_total = c.total,
            )
            
            total_shipping += Decimal(c.shipping_amount)
            total_tax += Decimal(c.tax_fee)
            total_service_fee += Decimal(c.service_fee)
            total_sub_total += Decimal(c.sub_total)
            total_initial_total += Decimal(c.total)
            total_total += Decimal(c.total)

            order.vendor.add(c.product.vendor)

       

        order.sub_total = total_sub_total
        order.shipping_amount = total_shipping
        order.tax_fee = total_tax
        order.service_fee = total_service_fee
        order.intial_total = total_initial_total
        order.total = total_total

        order.save()

        return Response({"message":"Order Created Succesfully","order_id":order.oid},status = status.HTTP_201_CREATED)


class CheckoutView(generics.RetrieveAPIView):
    serializer_class = CartOrderSerializer
    permission_classes=[AllowAny]
    lookup_field = 'order_oid'

    def get_object(self):
        order_oid = self.kwargs['order_oid']
        print(order_oid)
        order = CartOrder.objects.get(oid=order_oid)
        return order
    

class CouponAPIView(generics.CreateAPIView):
    serializer_class = CouponSerializer
    queryset = Coupon.objects.all()
    permission_classes=[AllowAny]

    def create(self,request):
        payload = request.data

        order_oid = payload['order_oid']
        coupon_code = payload['coupon_code']

        order = CartOrder.objects.get(oid=order_oid)
        coupon = Coupon.objects.filter(code = coupon_code).first()

        if coupon:
            order_items = CartOrderItem.objects.filter(order=order,vendor=coupon.vendor)
            if order_items:
                for i in order_items:
                    if not coupon in i.coupon.all():
                        discount = i.total * coupon.discount/100

                        i.total -= discount
                        i.sub_total -= discount
                        i.coupon.add(coupon)
                        i.saved += discount

                        order.total -= discount
                        order.sub_total -= discount
                        order.saved += discount

                        i.save()
                        order.save()

                        return Response({"message":"Coupon Activated","icon":"success"},status=status.HTTP_200_OK)
                    else:
                        return Response({"message":"Coupon Already Activate","icon":"warning"},status=status.HTTP_200_OK)
            else:
                return Response({"message":"Order Item Does Not exists","icon":"error"},status=status.HTTP_200_OK)
        else:
            return Response({"message":"Coupon Not Exists","icon":"error"},status=status.HTTP_200_OK)
            

class StripeCheckoutView(generics.CreateAPIView):
    serializer_class = CartOrderSerializer
    permission_classes=[AllowAny]
    queryset = CartOrder.objects.all()


    def create(self,*args,**kwargs):
        order_oid = self.kwargs['order_oid']
        order = CartOrder.objects.get(oid=order_oid)

        if not order:
            return Response({"message":"Order Not Found"},status=status.HTTP_404_NOT_FOUND)
        
        try:
            checkout_session = stripe.checkout.Session.create(
                customer_email=order.email,
                payment_method_types = ['card'],
                line_items=[
                    {
                        'price_data':{
                            'currency':'INR',
                            'product_data':{
                                'name':order.full_name,
                            },
                            'unit_amount':int(order.total * 100)
                        },
                        'quantity':1,
                    }
                ],
                shipping_address_collection={
                    'allowed_countries': ['IN'],  # Specify allowed countries
                },
                mode='payment',
                success_url = f'http://localhost:5173/payment-success/{str(order.oid)}?session_id={{CHECKOUT_SESSION_ID}}',
                cancel_url='http://localhost:5173/payment-failed/?session_id={CHECKOUT_SESSION_ID}'
            )
            order.stripe_session_id = checkout_session.id
            order.save()
            return redirect(checkout_session.url)

        except stripe.error.StripeError as e:
            return Response({"error":f'something went wrong while creating checkout session:{str(e)}'})

class PaymentSuccessView(generics.CreateAPIView):
    serializer_class = CartOrderSerializer
    permission_classes = [AllowAny]
    queryset = CartOrder.objects.all()

    def create(self,request,*args,**kwargs):
        payload = request.data

        order_oid = payload['order_oid']
        session_id = payload['session_id']

        order = CartOrder.objects.get(oid=order_oid)
        order_items = CartOrderItem.objects.filter(order=order)

        if session_id != "null":
            session = stripe.checkout.Session.retrieve(session_id)

            if session.payment_status =="paid":
                if order.payment_status =="pending":
                    order.payment_status = "paid"
                    order.save()

                    #send Notification to buyer
                    if order.buyer !=None:
                        send_notification(user=order.buyer,order=order)

                    #send Notifiacation to Vendor
                    for o in order_items:
                        send_notification(vendor=o.vendor,order=order,order_item=o)
                

                    #send email to buyer

                    context = {
                        'order':order,
                        'order_items':order_items,
                    }
                    subject = "Order Placed Successfully"
                    text_body = render_to_string("email/customer_order_confirmation.txt",context)
                    html_body = render_to_string("email/customer_order_confirmation.html",context)

                    msg=EmailMultiAlternatives(
                        subject=subject,
                        from_email=settings.FROM_EMAIL,
                        to=[order.email],
                        body=text_body,

                    )

                    msg.attach_alternative(html_body,"text/html")
                    msg.send()


                    #send email to vendors
                    for o in order_items:
                        send_notification(vendor=o.vendor,order=order,order_item=o)
                    context = {
                        'order':order,
                        'order_items':order_items,
                        'vendor':o.vendor,
                    }
                    subject = "New Sale!"
                    text_body = render_to_string("email/vendor_sale.txt",context)
                    html_body = render_to_string("email/vendor_sale.html",context)

                    msg=EmailMultiAlternatives(
                        subject=subject,
                        from_email=settings.FROM_EMAIL,
                        to=[o.vendor.user.email],
                        body=text_body,

                    )

                    msg.attach_alternative(html_body,"text/html")
                    msg.send()

                    return Response({"message":"Payment Successful"})
                else:
                    return Response({"message":"Already paid"})
                
            elif session.payment_status =="unpaid":
                return Response({"message":"your invoice is unpaid"})
            
            elif session.payment_status=="cancelled":
                return Response({"message":"your invoice is cancelled"})
            else:
                return Response({"message":"An error Occured try again"})

        else:
            session = None       



class ReviewAPIView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        product_id = self.kwargs['product_id']
        product = Product.objects.get(id=product_id)
        reviews = Review.objects.filter(product=product)
        return reviews
    
    def create(self,request,*args,**kwargs):
        payload = request.data

        user_id = payload['user_id']
        product_id = payload['product_id']
        rating = payload['rating']
        review = payload['review']

        user = User.objects.get(id=user_id)
        product = Product.objects.get(id=product_id)

        Review.objects.create(
            user=user,
            product=product,
            rating=rating,
            review=review,
        )

        return Response({"message":"Review Created Successfully"},status=status.HTTP_200_OK)

class SearchProductAPIView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        query = self.request.GET.get("query")
        products = Product.objects.filter(title__icontains=query)
        return products