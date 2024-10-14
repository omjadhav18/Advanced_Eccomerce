import React, { useState, useEffect } from "react";
import apiInstance from "../../utils/axios";
import { useParams } from "react-router-dom";

function PaymentSuccess() {
  const [order, setOrder] = useState([]);
  const [status, setStatus] = useState("veryfying");

  const param = useParams();

  const urlParam = new URLSearchParams(window.location.search);
  const sessionId = urlParam.get("session_id");

  useEffect(() => {
    apiInstance.get(`checkout/${param.order_oid}/`).then((res) => {
      setOrder(res.data);
    });
  }, [param]);

  useEffect(() => {
    const formdata = new FormData();
    formdata.append("order_oid", param?.order_oid);
    formdata.append("session_id", sessionId);
    apiInstance
      .post(`payment-success/${param.order_oid}/`, formdata)
      .then((res) => {
        if(res.data.message=="payment successful"){
          setStatus("payment successful")
        }
        if(res.data.message=="Already paid"){
          setStatus("Already paid")
        }
        if(res.data.message== "your invoice is unpaid"){
          setStatus("your invoice is unpaid")
        }
        if(res.data.message== "your invoice is cancelled"){
          setStatus("your invoice is cancelled")
        }
        if(res.data.message== "An error Occured try again"){
          setStatus("An error Occured try again")
        }

      });
  },[param?.order_oid]);

  return (
    <div>
      <main className="mb-4 mt-4 h-100">
        <div className="container">
          {/* Section: Checkout form */}
          <section className="">
            <div className="gx-lg-5">
              <div className="row pb50">
                <div className="col-lg-12">
                  <div className="dashboard_title_area">
                    <h4 className="fw-bold text-center mb-4 mt-4">
                      Checkout Successfull <i className="fas fa-check-circle" />{" "}
                    </h4>
                    {/* <p class="para">Lorem ipsum dolor sit amet, consectetur.</p> */}
                  </div>
                </div>
              </div>
              {status == "veryfying" && (
                <div className="row">
                  <div className="col-xl-12">
                    <div className="application_statics">
                      <div className="account_user_deails dashboard_page">
                        <div className="d-flex justify-content-center align-items-center">
                          <div className="col-lg-12">
                            <div className="border border-3 border-success" />
                            <div className="card bg-white shadow p-5">
                              <div className="mb-4 text-center">
                                <i
                                  className="fas fa-check-circle text-success"
                                  style={{ fontSize: 100, color: "green" }}
                                />
                              </div>
                              <div className="text-center">
                              <h1>Payment Verifying <i className="fas fa-spinner fa-spin"></i></h1>
                                <p>  
                                  <b>Please Hold On while we verify Your payment</b>
                                  <br/>
                                  <b className="text-danger">Note:Do not leave or reload the site</b>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {status == "Already paid" && (
                <div className="row">
                  <div className="col-xl-12">
                    <div className="application_statics">
                      <div className="account_user_deails dashboard_page">
                        <div className="d-flex justify-content-center align-items-center">
                          <div className="col-lg-12">
                            <div className="border border-3 border-success" />
                            <div className="card bg-white shadow p-5">
                              <div className="mb-4 text-center">
                                <i
                                  className="fas fa-check-circle text-success"
                                  style={{ fontSize: 100, color: "green" }}
                                />
                              </div>
                              <div className="text-center">
                              <h1>Already paid  <i className="fas fa-che"/></h1>
                                <p>  
                                  You already Paid for this order.
                                </p>
                                <button
                                  className="btn btn-success mt-3"
                                  data-bs-toggle="modal"
                                  data-bs-target="#exampleModal"
                                >
                                  View Order <i className="fas fa-eye" />{" "}
                                </button>
                                <a
                                  href="/"
                                  className="btn btn-primary mt-3 ms-2"
                                >
                                  Download Invoice{" "}
                                  <i className="fas fa-file-invoice" />{" "}
                                </a>
                                <a className="btn btn-secondary mt-3 ms-2">
                                  Go Home <i className="fas fa-fa-arrow-left" />{" "}
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* {status == "your invoice is unpaid" && (
                <div className="row">
                  <div className="col-xl-12">
                    <div className="application_statics">
                      <div className="account_user_deails dashboard_page">
                        <div className="d-flex justify-content-center align-items-center">
                          <div className="col-lg-12">
                            <div className="border border-3 border-success" />
                            <div className="card bg-white shadow p-5">
                              <div className="mb-4 text-center">
                                <i
                                  className="fas fa-check-circle text-success"
                                  style={{ fontSize: 100, color: "green" }}
                                />
                              </div>
                              <div className="text-center">
                              <h1>your invoice is unpaid<i className="fas fa-ban"></i></h1>
                                <p>  
                                  You invoice is unpaid
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )} */}
              {/* {status == "your invoice is cancelled" && (
                <div className="row">
                  <div className="col-xl-12">
                    <div className="application_statics">
                      <div className="account_user_deails dashboard_page">
                        <div className="d-flex justify-content-center align-items-center">
                          <div className="col-lg-12">
                            <div className="border border-3 border-success" />
                            <div className="card bg-white shadow p-5">
                              <div className="mb-4 text-center">
                                <i
                                  className="fas fa-check-circle text-success"
                                  style={{ fontSize: 100, color: "green" }}
                                />
                              </div>
                              <div className="text-center">
                              <h1>your invoice is cancelled<i className="fas fa-error"></i></h1>
                                <p>  
                                  You invoice is unpaid
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )} */}
              {status == "payment successful" && (
                <div className="row">
                  <div className="col-xl-12">
                    <div className="application_statics">
                      <div className="account_user_deails dashboard_page">
                        <div className="d-flex justify-content-center align-items-center">
                          <div className="col-lg-12">
                            <div className="border border-3 border-success" />
                            <div className="card bg-white shadow p-5">
                              <div className="mb-4 text-center">
                                <i
                                  className="fas fa-check-circle text-success"
                                  style={{ fontSize: 100, color: "green" }}
                                />
                              </div>
                              <div className="text-center">
                                <h1>Thank You !</h1>
                                <p>
                                  Your checkout was successfull, we have sent
                                  the order detail to your email{" "}
                                </p>
                                <button
                                  className="btn btn-success mt-3"
                                  data-bs-toggle="modal"
                                  data-bs-target="#exampleModal"
                                >
                                  View Order <i className="fas fa-eye" />{" "}
                                </button>
                                <a
                                  href="/"
                                  className="btn btn-primary mt-3 ms-2"
                                >
                                  Download Invoice{" "}
                                  <i className="fas fa-file-invoice" />{" "}
                                </a>
                                <a className="btn btn-secondary mt-3 ms-2">
                                  Go Home <i className="fas fa-fa-arrow-left" />{" "}
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Order Summary
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div className="modal-body text-start text-black p-4">
                <h5
                  className="modal-title text-uppercase "
                  id="exampleModalLabel"
                >
                  {order.full_name}
                </h5>
                <h6>{order.email}</h6>
                <h6 className="mb-5">{order.address}</h6>
                <p className="mb-0" style={{ color: "#35558a" }}>
                  Payment summary
                </p>
                <hr
                  className="mt-2 mb-4"
                  style={{
                    height: 0,
                    backgroundColor: "transparent",
                    opacity: ".75",
                    borderTop: "2px dashed #9e9e9e",
                  }}
                />
                <div className="d-flex justify-content-between">
                  <p className="fw-bold mb-0">Subtotal</p>
                  <p className="text-muted mb-0">{order.sub_total}</p>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="small mb-0">Shipping Fee</p>
                  <p className="small mb-0">{order.shipping_amount}</p>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="small mb-0">Service Fee</p>
                  <p className="small mb-0">{order.service_fee}</p>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="small mb-0">Tax</p>
                  <p className="small mb-0">{order.tax_fee}</p>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="small mb-0">Discount</p>
                  <p className="small mb-0">{order.saved}</p>
                </div>
                <div className="d-flex justify-content-between mt-4">
                  <p className="fw-bold">Total</p>
                  <p className="fw-bold" style={{ color: "#35558a" }}>
                    {order.total}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
