import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import apiInstance from "../../utils/axios";
import UserData from "../plugin/UserData";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const userData = UserData();

  const fetchWishList = () => {
    apiInstance
      .get(`customer/wishlist/${userData?.user_id}/`)
      .then((response) => {
        setWishlist(response.data);
      });
  };
  useEffect(() => {
    fetchWishList();
  }, []);
  const addToWishlist = async (productID, userID) => {
    try {
      const formdata = new FormData();
      formdata.append("product_id", productID);
      formdata.append("user_id", userID);
      const response = await apiInstance.post(
        `customer/wishlist/${userID}/`,
        formdata
      );
      Swal.fire({
        icon: "success",
        title: response.data.message,
        text: response.data.message,
      });
      fetchWishList();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="mt-5">
      <div className="container">
        <section className="">
          <div className="row">
            {/* Sidebar Here */}
            <Sidebar />
            <div className="col-lg-9 mt-1">
              <section className="">
                <main className="mb-5" style={{}}>
                  <div className="container">
                    <section className="">
                      <div className="row">
                        <h3 className="mb-3">
                          <i className="fas fa-heart text-danger" /> Wishlist
                        </h3>
                        {wishlist?.map((w, index) => (
                          <div className="col-lg-4 col-md-12 mb-4" key={index}>
                            <div className="card">
                              <div
                                className="bg-image hover-zoom ripple"
                                data-mdb-ripple-color="light"
                              >
                                <Link to={`/detail/${w.product?.slug}/`}>
                                  <img
                                    src={w.product?.image}
                                    className="w-100"
                                    style={{
                                      height: "250px",
                                      width: "100%",
                                      objectFit: "cover",
                                    }}
                                  />
                                </Link>
                                <a href="#!">
                                  <div className="mask">
                                    <div className="d-flex justify-content-start align-items-end h-100">
                                      <h5>
                                        <span className="badge badge-primary ms-2">
                                          New
                                        </span>
                                      </h5>
                                    </div>
                                  </div>
                                  <div className="hover-overlay">
                                    <div
                                      className="mask"
                                      style={{
                                        backgroundColor:
                                          "rgba(251, 251, 251, 0.15)",
                                      }}
                                    />
                                  </div>
                                </a>
                              </div>
                              <div className="card-body">
                                <a href="" className="text-reset">
                                  <h5 className="card-title mb-3">
                                    {w.product?.title}
                                  </h5>
                                </a>
                                <a href="" className="text-reset">
                                  <p>{w.product?.category?.title}</p>
                                </a>
                                <h6 className="mb-3">Rs.{w.product?.price}</h6>
                                <div className="btn-group">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      addToWishlist(
                                        w.product?.id,
                                        userData?.user_id
                                      )
                                    }
                                    className="btn btn-danger px-3 me-1 ms-2"
                                  >
                                    <i className="fas fa-heart" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Show This if there are no item in wishlist */}
                        {wishlist?.length == 0 && (
                          <h6 className="container">Your wishlist is Empty </h6>
                        )}
                      </div>
                    </section>
                  </div>
                </main>
              </section>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Wishlist;
