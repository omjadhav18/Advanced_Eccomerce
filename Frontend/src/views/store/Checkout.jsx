import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiInstance from "../../utils/axios";
import Swal from "sweetalert2";
import { SERVER_URL } from "../../utils/constants";

function Checkout() {
  const [order, setOrder] = useState([]);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const param = useParams();

  const fetchData = () => {
    apiInstance.get(`checkout/${param.order_oid}/`).then((res) => {
      setOrder(res.data);
    });
  };

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
  const csrftoken = getCookie('csrftoken');

  useEffect(() => {
    fetchData();
  }, []);

  const applyCoupon = async () => {
    const formdata = new FormData();
    formdata.append("order_oid", order.oid);
    formdata.append("coupon_code", couponCode);

    try {
      const response = await apiInstance.post("coupon/", formdata);
      Swal.fire({
        icon: response.data.icon,
        text: response.data.message,
      });
      fetchData();
    } catch (error) {}
  };

  const payWithStripe = (event) => {
    setPaymentLoading(true);
    event.target.form.submit();
  };

  return (
    <div>
      <main>
        <main className="mb-4 mt-4">
          <div className="container">
            <section className="">
              <div className="row gx-lg-5">
                <div className="col-lg-8 mb-4 mb-md-0">
                  <section className="">
                    <div className="alert alert-warning">
                      <strong>Review Your Shipping &amp; Order Details </strong>
                    </div>
                    <form>
                      <h5 className="mb-4 mt-4">Shipping address</h5>
                      <div className="row mb-4">
                        <div className="col-lg-12">
                          <div className="form-outline">
                            <label
                              className="form-label"
                              htmlFor="form6Example2"
                            >
                              Full Name
                            </label>
                            <input
                              type="text"
                              readOnly
                              className="form-control"
                              value={order.full_name}
                            />
                          </div>
                        </div>

                        <div className="col-lg-6 mt-4">
                          <div className="form-outline">
                            <label
                              className="form-label"
                              htmlFor="form6Example2"
                            >
                              Email
                            </label>
                            <input
                              type="text"
                              readOnly
                              className="form-control"
                              value={order.email}
                            />
                          </div>
                        </div>

                        <div className="col-lg-6 mt-4">
                          <div className="form-outline">
                            <label
                              className="form-label"
                              htmlFor="form6Example2"
                            >
                              Mobile
                            </label>
                            <input
                              type="text"
                              readOnly
                              className="form-control"
                              value={order.mobile}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 mt-4">
                          <div className="form-outline">
                            <label
                              className="form-label"
                              htmlFor="form6Example2"
                            >
                              Address
                            </label>
                            <input
                              type="text"
                              readOnly
                              className="form-control"
                              value={order.address}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 mt-4">
                          <div className="form-outline">
                            <label
                              className="form-label"
                              htmlFor="form6Example2"
                            >
                              City
                            </label>
                            <input
                              type="text"
                              readOnly
                              className="form-control"
                              value={order.city}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 mt-4">
                          <div className="form-outline">
                            <label
                              className="form-label"
                              htmlFor="form6Example2"
                            >
                              State
                            </label>
                            <input
                              type="text"
                              readOnly
                              className="form-control"
                              value={order.state}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 mt-4">
                          <div className="form-outline">
                            <label
                              className="form-label"
                              htmlFor="form6Example2"
                            >
                              Country
                            </label>
                            <input
                              type="text"
                              readOnly
                              className="form-control"
                              value={order.country}
                            />
                          </div>
                        </div>
                      </div>

                      <h5 className="mb-4 mt-4">Billing address</h5>
                      <div className="form-check mb-2">
                        <input
                          className="form-check-input me-2"
                          type="checkbox"
                          defaultValue=""
                          id="form6Example8"
                          defaultChecked=""
                        />
                        <label
                          className="form-check-label"
                          htmlFor="form6Example8"
                        >
                          Same as shipping address
                        </label>
                      </div>
                    </form>
                  </section>
                  {/* Section: Biling details */}
                </div>
                <div className="col-lg-4 mb-4 mb-md-0">
                  {/* Section: Summary */}
                  <section className="shadow-4 p-4 rounded-5 mb-4">
                    <h5 className="mb-3">Cart Summary</h5>
                    <div className="d-flex justify-content-between mb-3">
                      <span>Subtotal </span>
                      <span>{order.sub_total}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Shipping </span>
                      <span>{order.shipping_amount}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Tax </span>
                      <span>{order.tax_fee}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Servive Fee </span>
                      <span>{order.service_fee}</span>
                    </div>
                    {order.saved !== "0.00" && (
                      <div className="d-flex justify-content-between">
                        <span>Discount</span>
                        <span>{order.saved}</span>
                      </div>
                    )}

                    <hr className="my-4" />
                    <div className="d-flex justify-content-between fw-bold mb-5">
                      <span>Total </span>
                      <span>{order.total}</span>
                    </div>

                    <div className="shadow p-3 d-flex mt-4 mb-4">
                      <input
                        onChange={(e) => {
                          setCouponCode(e.target.value);
                        }}
                        name="couponCode"
                        type="text"
                        className="form-control"
                        style={{ border: "dashed 1px gray" }}
                        placeholder="Enter Coupon Code"
                        id=""
                      />
                      <button
                        onClick={applyCoupon}
                        className="btn btn-success ms-1"
                      >
                        <i className="fas fa-check-circle"></i>
                      </button>
                    </div>
                    {paymentLoading === true && (
                      <form
                        action={`${SERVER_URL}api/v1/stripe-checkout/${order?.oid}/`} method="POST"
                      >
                        <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />
                        <button
                          type="submit"
                          onClick={payWithStripe}
                          disabled
                          className="btn btn-primary btn-rounded w-100 mt-2"
                          style={{ backgroundColor: "#635BFF" }}
                        >
                          Processing...
                        </button>
                      </form>
                    )}
                    {paymentLoading === false && (
                      <form
                        action={`${SERVER_URL}api/v1/stripe-checkout/${order?.oid}/`} method='POST'
                      >
                        <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />
                        <button
                          type="submit"
                          onClick={payWithStripe}
                          className="btn btn-primary btn-rounded w-100 mt-2"
                          style={{ backgroundColor: "#635BFF" }}
                        >
                          Pay With Stipe
                        </button>
                      </form>
                    )}

                    {/* <button type="button" className="btn btn-primary btn-rounded w-100 mt-2">Pay Now (Flutterwave)</button>
                                <button type="button" className="btn btn-primary btn-rounded w-100 mt-2">Pay Now (Paystack)</button>
                                <button type="button" className="btn btn-primary btn-rounded w-100 mt-2">Pay Now (Paypal)</button> */}
                  </section>
                </div>
              </div>
            </section>
          </div>
        </main>
      </main>
    </div>
  );
}

export default Checkout;
