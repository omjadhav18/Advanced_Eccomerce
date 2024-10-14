from django.urls import path
from userauths import views as userauths_view
from rest_framework_simplejwt.views import TokenRefreshView
from store import views as store_views
from customer import views as customer_views
from vendor import views as vendor_views


urlpatterns=[
    path('user/token/',userauths_view.MyTokenObtainPairView.as_view(),name='login'),
    path('user/register/',userauths_view.RegisterView.as_view(),name='register'),
    path('user/token/refresh/',TokenRefreshView.as_view()),
    path('user/password-reset/<email>/',userauths_view.PasswordResetEmailVerify.as_view(),name='password_reset'),
    path('user/password-change/',userauths_view.PasswordChangeView.as_view(),name='password_change'),
    path('user/profile/<user_id>/',userauths_view.ProfileView.as_view(),name='profile_view'),


    #store endpoints
    path('category/',store_views.CategoryListAPIView.as_view(),name='list_category'),
    path('product/',store_views.ProductListAPIView.as_view(),name='list_product'),
    path('product/<slug>/',store_views.ProductDetailAPIView.as_view(),name='detail_product'),
    path('cart-view/',store_views.CartAPIView.as_view(),name='cart_list_create'),
    path('cart-list/<str:cart_id>/<int:user_id>/',store_views.CartListAPIView.as_view(),name='cart_list'),
    path('cart-list/<str:cart_id>/',store_views.CartListAPIView.as_view(),name='cart_list'),
    path('cart-detail/<str:cart_id>/',store_views.CartDetailView.as_view(),name='cart_detail'),
    path('cart-detail/<str:cart_id>/<int:user_id>/',store_views.CartDetailView.as_view(),name='cart_detail'),
    path('cart-delete/<str:cart_id>/<int:item_id>/<int:user_id>/',store_views.CartItemDeleteAPIView.as_view(),name='cart_item_delet'),
    path('cart-delete/<str:cart_id>/<int:item_id>/',store_views.CartItemDeleteAPIView.as_view(),name='cart_item_delet'),
    path('create-order/',store_views.CreateOrderAPIView.as_view(),name='create-order'),
    path('checkout/<order_oid>/',store_views.CheckoutView.as_view(),name='checkout'),
    path('coupon/',store_views.CouponAPIView.as_view(),name='coupon'),
    path('reviews/<product_id>/',store_views.ReviewAPIView.as_view(),name='review'),
    path('search/',store_views.SearchProductAPIView.as_view(),name='search'),
    
    

    #payment Endpoints:
    path('stripe-checkout/<order_oid>/',store_views.StripeCheckoutView.as_view(),name='stripe-payment'),
    path('payment-success/<order_oid>/',store_views.PaymentSuccessView.as_view(),name='payment-success'),


    #Customer Endpoints

    path('customer/orders/<user_id>/',customer_views.OrderAPIView.as_view(),name='customer_order'),
    path('customer/order/<user_id>/<order_oid>/',customer_views.OrderDetailAPIView.as_view(),name='customer_detail_order'),
    path('customer/wishlist/<user_id>/',customer_views.WishlistAPIView.as_view(),name='customer-wishlist'),
    path('customer/notification/<user_id>/',customer_views.CustomerNotification.as_view(),name='customer-notification'),
    path('customer/notification/<user_id>/<noti_id>/',customer_views.MarkCustomerNotificationAsSeen.as_view(),name='customer-notification-seen'),

    # Vendor Dashboard Endpoints

    path('vendor/stats/<vendor_id>/',vendor_views.DashboardStatsAPIView.as_view(),name='stats'),
    path('vendor-orders-chart/<vendor_id>/',vendor_views.MonthlyOrderChartAPIView),
    path('vendor-products-chart/<vendor_id>/',vendor_views.MonthlyProductChartAPIView),
    path('vendor/products/<vendor_id>/',vendor_views.ProductAPIView.as_view()),
    path('vendor/orders/<vendor_id>/',vendor_views.OrderAPIView.as_view()),
    path('vendor/orders/<vendor_id>/<order_oid>/',vendor_views.OrderDetailAPIView.as_view()),
    path('vendor/orders/<int:vendor_id>/filter',vendor_views.FilterOrderAPIView.as_view()),
    path('vendor/revenue/<vendor_id>/',vendor_views.RevenueAPIView.as_view()),
    path('vendor-product-filter/<vendor_id>/',vendor_views.FilterProductAPIView.as_view()),
    path('vendor-earning/<vendor_id>/',vendor_views.EarningAPIView.as_view()),
    path('venodr-monthly-earning/<vendor_id>/',vendor_views.MonthlyEarningTracker),
    path('vendor-reviews/<vendor_id>/',vendor_views.ReviewListAPIView.as_view()),
    path('vendor-reviews/<vendor_id>/<review_id>/',vendor_views.ReviewDetailAPIView.as_view()),
    path('vendor-coupon-list/<vendor_id>/',vendor_views.CouponListCreateAPIView.as_view()),
    path('vendor-coupon-detail/<vendor_id>/<coupon_id>/',vendor_views.CouponDetailAPIView.as_view()),
    path('vendor-coupon-stats/<vendor_id>/',vendor_views.CouponStatsAPIView.as_view()),
    path('vendor-noti-list/<vendor_id>/',vendor_views.NotificationAPIView.as_view()),
    path('vendor-seen-noti/<vendor_id>/',vendor_views.NotificationSeenAPIView.as_view()),
    path('vendor-noti-summary/<vendor_id>/',vendor_views.NotificationSummaryApIView.as_view()),
    path('vendor-noti-mark-as-seen/<vendor_id>/<noti_id>/',vendor_views.NotificationVendorMarkAsSeen.as_view()),
    path('vendor-settings/<int:pk>/',vendor_views.VendorProfileUpdateView.as_view()),
    path('vendor-shop-settings/<int:pk>/',vendor_views.ShopUpdateView.as_view()),
    path('shop/<vendor_slug>/',vendor_views.ShopAPIView.as_view()),
    path('vendor-products/<vendor_slug>/',vendor_views.ShopProductAPIView.as_view()),
    path('vendor-create-product/',vendor_views.ProductCreateView.as_view()),
    path('vendor-update-product/<vendor_id>/<product_pid>/',vendor_views.ProductUpdateView.as_view()),
    path('vendor-delete-product/<vendor_id>/<product_pid>/',vendor_views.ProductDeleteAPIView.as_view()),

]   