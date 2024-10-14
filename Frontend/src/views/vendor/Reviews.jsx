import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import UserData from "../plugin/UserData";
import apiInstance from "../../utils/axios";
import { Link } from "react-router-dom";
import moment from "moment";

function Reviews() {
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    apiInstance
      .get(`vendor-reviews/${UserData()?.vendor_id}/`)
      .then((response) => {
        setReviews(response.data);
      });
  }, []);

  return (
    <div className="container-fluid" id="main">
      <div className="row row-offcanvas row-offcanvas-left h-100">
        <Sidebar />
        <div className="col-md-9 col-lg-10 main mt-4">
          <h4>
            <i className="fas fa-star" /> Reviews and Rating
          </h4>

          <section
            className="p-4 p-md-5 text-center text-lg-start shadow-1-strong rounded"
            style={{
              backgroundImage:
                "url(https://mdbcdn.b-cdn.net/img/Photos/Others/background2.webp)",
            }}
          >
            <div className="row d-flex justify-content-center align-items-center">
              <div className="col-md-10">
                {reviews.map((review, index) => (
                  <div className="card mt-3 mb-3" key={index}>
                    <div className="card-body m-3">
                      <div className="row">
                        <div className="col-lg-4 d-flex justify-content-center align-items-center mb-4 mb-lg-0">
                          <img
                            src={review.profile.image}
                            className="rounded-circle img-fluid shadow-1"
                            alt="woman avatar"
                            width={200}
                            height={200}
                          />
                        </div>
                        <div className="col-lg-8">
                          <p className="text-dark fw-bold mb-4">
                            Review: <i>{review.review}</i>
                          </p>
                          <p className="fw-bold text-dark mb-2">
                            <strong>Name:{review.profile.full_name}</strong>
                          </p>
                          <p className="fw-bold text-muted mb-0">
                            Product:{review?.product.title}
                          </p>
                          <p className="fw-bold text-muted mb-0">
                            Rating: {review.rating}
                            {review.rating === 1 && (
                              <i className="fas fa-star" />
                            )}
                            {review.rating == 2 && (
                              <>
                                <i className="fas fa-star" />
                                <i className="fas fa-star" />
                              </>
                            )}
                            {review.rating == 3 && (
                              <>
                                <i className="fas fa-star" />
                                <i className="fas fa-star" />
                                <i className="fas fa-star" />
                              </>
                            )}
                            {review.rating == 4 && (
                              <>
                                <i className="fas fa-star" />
                                <i className="fas fa-star" />
                                <i className="fas fa-star" />
                                <i className="fas fa-star" />
                              </>
                            )}
                            {review.rating == 5 && (
                              <>
                                <i className="fas fa-star" />
                                <i className="fas fa-star" />
                                <i className="fas fa-star" />
                                <i className="fas fa-star" />
                                <i className="fas fa-star" />
                              </>
                            )}
                          </p>
                          <div className="d-flex mt-3">
                            <p className="fw-bold text-muted mb-0">
                              <Link to={`${review.id}/`} className="btn btn-primary">
                                Reply <i className="fas fa-pen" />
                              </Link>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Reviews;
