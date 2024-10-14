import { useEffect, useState } from 'react'
// import './App.css'
import {BrowserRouter , Routes , Route} from 'react-router-dom';
import Login from './views/auth/Login.jsx';
import Register from './views/auth/Register.jsx';
// import Dashboard from './views/auth/Dashboard.jsx';
import Logout from './views/auth/Logout.jsx';
import ForgotPassword from './views/auth/ForgotPassword.jsx';
import CreatePassword from './views/auth/CreatePassword.jsx';
import StoreHeader from './views/base/StoreHeader.jsx';
import StoreFooter from './views/base/StoreFooter.jsx';
import Product from './views/store/Product.jsx';
import ProductDetail from './views/store/ProductDetail.jsx';
import Cart from './views/store/Cart.jsx';
import Checkout from './views/store/Checkout.jsx';
import PaymentSuccess from './views/store/PaymentSuccess.jsx';
import Search from './views/store/Search.jsx';
import { CartContext } from './views/plugin/Context.jsx';
import CartID from './views/plugin/CartId.jsx';
import UserData from './views/plugin/UserData.jsx';
import apiInstance from './utils/axios.js';
import Account from './views/customer/Account.jsx';
import Orders from './views/customer/Orders.jsx';
import OrderDetail from './views/customer/OrderDetail.jsx';
import Wishlist from './views/customer/Wishlist.jsx';
import CustomerNotification from './views/customer/CustomerNotification.jsx';
import Settings from './views/customer/Settings.jsx';
import Invoice from './views/customer/Invoice.jsx';
import Dashboard from './views/vendor/Dashboard.jsx'
import VendorProduct from './views/vendor/Product.jsx'
import VendorOrders from './views/vendor/Orders.jsx'
import VedorOrderDetail from './views/vendor/OrderDetail.jsx'
import Earning from './views/vendor/Earning.jsx';
import Reviews from './views/vendor/Reviews.jsx';
import ReviewDetail from './views/vendor/ReviewDetail.jsx';
import Coupon from './views/vendor/Coupon.jsx';
import EditCoupon from './views/vendor/EditCoupon.jsx';
import Notification from './views/vendor/Notification.jsx';
import VendorSettings from './views/vendor/VendorSettings.jsx';
import Shop from './views/vendor/Shop.jsx';
import AddProduct from './views/vendor/AddProduct.jsx';
import UpdateProduct from './views/vendor/UpdateProduct.jsx';
// import PrivateRoute from './layout/PrivateRoute.jsx';
// import MainWrapper from './layout/MainWrapper.jsx'



function App() {
  const [cartCount,setCartCount] = useState()

  const cart_id= CartID()
  const userData = UserData()

  useEffect(()=>{
    const url = userData?.user_id ? `cart-list/${cart_id}/${userData?.user_id}/`: `cart-list/${cart_id}/`
    apiInstance.get(url).then((res)=>{
      setCartCount(res.data.length)
    })
  })

  return (
    <CartContext.Provider value={[cartCount,setCartCount]}>

    <BrowserRouter>
    <StoreHeader />
    <Routes>
      <Route path='/login' element={<Login/>} />
      <Route path='/register' element={<Register/>}/>
      <Route path='/logout' element={<Logout/>}/>
      <Route path='/forgot-password' element={<ForgotPassword/>}/>
      <Route path='/create-new-password' element={<CreatePassword/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/' element={<Product/>}/>
      <Route path='/detail/:slug/' element={<ProductDetail/>}/>
      <Route path='/cart' element={<Cart/>}/>
      <Route path='/checkout/:order_oid' element={<Checkout/>}/>
      <Route path='/payment-success/:order_oid/' element={<PaymentSuccess/>}/>
      <Route path='/search/' element={<Search/>}/>

      {/* customer Routes */}
      <Route path='/customer/account/' element={<Account/>}/>
      <Route path='/customer/orders/' element={<Orders/>}/>
      <Route path='/customer/orders/:order_oid/' element={<OrderDetail/>}/>
      <Route path='/customer/wishlist/' element={<Wishlist/>} />
      <Route path='/customer/notifications/' element={<CustomerNotification/>} />
      <Route path='/customer/settings/' element={<Settings/>} />
      <Route path='/customer/invoice/:order_oid/' element={<Invoice/>} />
      <Route path='/vendor/dashboard/' element={<Dashboard/>} />
      <Route path='/vendor/products/' element={<VendorProduct/>} />
      <Route path='/vendor/orders/' element={<VendorOrders/>}/>
      <Route path='/vendor/orders/:order_oid/' element={<VedorOrderDetail/>}/>
      <Route path='/vendor/earning/' element={<Earning />}/>
      <Route path='/vendor/reviews/' element={<Reviews />}/>
      <Route path='/vendor/reviews/:review_id/' element={<ReviewDetail/>}/>
      <Route path='/vendor/coupon/' element={<Coupon/>}/>
      <Route path='/vendor/coupon/:coupon_id/' element={<EditCoupon/>}/>
      <Route path='/vendor/coupon/:coupon_id/' element={<EditCoupon/>}/>
      <Route path='/vendor/notifications/' element={<Notification/>}/>
      <Route path='/vendor/settings/' element={<VendorSettings/>}/>
      <Route path='/vendor/:slug/' element={<Shop/>}/>
      <Route path='/vendor/add-product/' element={<AddProduct/>}/>
      <Route path='/vendor/product/update/:pid/' element={<UpdateProduct/>}/>

    </Routes>
    <StoreFooter/>
    </BrowserRouter>
    </CartContext.Provider>
  )
}

export default App
