import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import UserData from "../plugin/UserData";
import apiInstance from "../../utils/axios";
import { Link } from "react-router-dom";
import moment from "moment";
import Swal from "sweetalert2";

function Coupon() {
  const [stats, setStats] = useState([]);
  const [coupons, setCoupons] = useState([]);

  const [createCoupon, setCreateCoupon] = useState({
    code: "",
    discount: "",
    active: true,
  });

  const fetchCouponData = async () => {
    await apiInstance
      .get(`vendor-coupon-stats/${UserData()?.vendor_id}/`)
      .then((response) => {
        setStats(response.data[[0]]);
      });
    await apiInstance
      .get(`vendor-coupon-list/${UserData()?.vendor_id}/`)
      .then((response) => {
        setCoupons(response.data);
      });
  };

  useEffect(() => {
    fetchCouponData();
  }, []);

  const handleDeleteCoupon = async (couponId) => {
    await apiInstance.delete(
      `vendor-coupon-detail/${UserData()?.vendor_id}/${couponId}/`
    );
    Swal.fire({
      text: "Deleted successfully",
      icon: "success",
    });
    fetchCouponData();
  };

  const handleCouponChange = (event) => {
    setCreateCoupon({
      ...createCoupon,
      [event.target.name]:
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value,
    });
  };

  const handleCreateCoupon = async (e) =>{
    e.preventDefault()
    const formdata = new FormData()
    formdata.append("vendor_id",UserData()?.vendor_id)
    formdata.append("code",createCoupon.code)
    formdata.append("discount",createCoupon.discount)
    formdata.append("active",createCoupon.active)

    await apiInstance.post(`vendor-coupon-list/${UserData()?.vendor_id}/`,formdata).then((response)=>{
    })
    fetchCouponData();
  }

  return (
    <div className="container-fluid" id="main">
      <div className="row row-offcanvas row-offcanvas-left h-100">
        <Sidebar />

        <div className="col-md-9 col-lg-10 main mt-4">
          <div className="row mb-3">
            <div className="col-xl-6 col-lg-6 mb-2">
              <div className="card card-inverse card-success">
                <div className="card-block bg-success p-3">
                  <div className="rotate">
                    <i className="bi bi-currency-dollar fa-5x" />
                  </div>
                  <h6 className="text-uppercase">Total Coupons</h6>
                  <h1 className="display-1">{stats.total_coupons}</h1>
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 mb-2">
              <div className="card card-inverse card-danger">
                <div className="card-block bg-danger p-3">
                  <div className="rotate">
                    <i className="bi bi-currency-dollar fa-5x" />
                  </div>
                  <h6 className="text-uppercase">Active Coupons</h6>
                  <h1 className="display-1">{stats.active_coupons}</h1>
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div className="row  container">
            <div className="col-lg-12">
              <h4 className="mt-3 mb-4">Revenue Tracker</h4>
              <table className="table">
                <thead className="table-dark">
                  <tr>
                    <th scope="col">Code</th>
                    <th scope="col">Type</th>
                    <th scope="col">Discount</th>
                    <th scope="col">Status</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons?.map((coupon, index) => (
                    <tr key={index}>
                      <td>{coupon?.code}</td>
                      <td>Percentage</td>
                      <td>{coupon?.discount}</td>
                      <td>
                        {coupon?.active === true ? "Active" : "In-active"}
                      </td>
                      <td>
                        <Link to={`${coupon.id}/`} className="btn btn-primary mb-1">
                          <i className="fas fa-edit" />
                        </Link>
                        <a
                          onClick={() => {
                            handleDeleteCoupon(coupon.id);
                          }}
                          href="#"
                          className="btn btn-danger mb-1"
                        >
                          <i className="fas fa-trash" />
                        </a>
                      </td>
                    </tr>
                  ))}
                  {coupons.length < 1 && <h5>No Coupons yet </h5>}

                  <button
                    type="button"
                    class="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                  >
                    <i className="fas fa-plus bg-primary color-white"></i>{" "}
                    Create Coupon
                  </button>

                  <div
                    class="modal fade"
                    id="exampleModal"
                    tabindex="-1"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                  >
                    <div class="modal-dialog">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h1 class="modal-title fs-5" id="exampleModalLabel">
                            Modal title
                          </h1>
                          <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                        <div class="modal-body">
                          <form onSubmit={handleCreateCoupon}>
                            <div class="mb-3">
                              <label
                                for="code"
                                class="form-label"
                              >
                                Code
                              </label>
                              <input
                                type="text"
                                class="form-control"
                                name="code"
                                onChange={handleCouponChange}
                                value={createCoupon.code}
                                placeholder="Enter Coupon Code"
                                id="code"
                                aria-describedby="emailHelp"
                              />
                            </div>
                            <div class="mb-3">
                              <label
                                for="discount"
                                class="form-label"
                              >
                                Discount
                              </label>
                              <input
                                type="text"
                                name="discount"
                                onChange={handleCouponChange}
                                value={createCoupon.discount}
                                placeholder="Enter Discount"
                                class="form-control"
                                id="discount"
                              />
                            </div>
                            <div class="mb-3 form-check">
                              <input
                                type="checkbox"
                                class="form-check-input"
                                id="exampleCheck1"
                                name="active"
                                onChange={handleCouponChange}
                                checked={createCoupon.active}
                                
                              />
                              <label
                                class="form-check-label"
                                for="exampleCheck1"
                              >
                                Active
                              </label>
                            </div>
                            <button type="submit" class="btn btn-primary">
                              Create Coupon
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Coupon;
