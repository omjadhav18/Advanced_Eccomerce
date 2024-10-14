import React from "react";
import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import apiInstance from "../../utils/axios";
import GetCurrentAddress from "../plugin/UserCountry";
import UserData from "../plugin/UserData";
import CartID from "../plugin/CartId";
import moment from "moment";
import { CartContext } from "../plugin/Context";

function ProductDetail() {
  const [detail, setDetail] = useState({});
  const [specifications, setSpecifications] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [color, setColor] = useState([]);
  const [size, setSize] = useState([]);

  const [reviews, setReviews] = useState([]);
  const [createReview, setCreateReview] = useState({
    user_id: 0,
    product_id: detail?.id,
    review: "",
    rating: 0,
  });

  const [colorValue, setColorValue] = useState("No Color");
  const [sizeValue, setSizeValue] = useState("No size");
  const [quantityValue, setQuantityValue] = useState(1);

  const [cartCount, setCartCount] = useContext(CartContext);

  const param = useParams();
  const slug = param["slug"];
  const currentAddress = GetCurrentAddress();
  const userData = UserData();
  const cart_id = CartID();

  useEffect(() => {
    apiInstance.get(`product/${slug}/`).then((response) => {
      setDetail(response.data);
      setSpecifications(response.data.specification);
      setGallery(response.data.gallery);
      setColor(response.data.color);
      setSize(response.data.size);
    });
  }, []);
  // console.log(gallery)

  const handleColorButtonClick = (e) => {
    const colorNameInput = e.target
      .closest(".color_button")
      .parentNode.querySelector(".color_name");
    setColorValue(colorNameInput.value);
  };

  const handleSizeButtonClick = (e) => {
    const sizeNameInput = e.target
      .closest(".size_button")
      .parentNode.querySelector(".size_name");
    setSizeValue(sizeNameInput.value);
  };

  const handleAddToCart = async () => {
    try {
      const formdata = new FormData();

      formdata.append("product_id", detail.id);
      formdata.append("user_id", userData.user_id);
      formdata.append("qty", quantityValue);
      formdata.append("price", detail.price);
      formdata.append("shipping_amount", detail.shipping_amount);
      formdata.append("country", currentAddress.country);
      formdata.append("size", sizeValue);
      formdata.append("color", colorValue);
      formdata.append("cart_id", cart_id);

      await apiInstance.post("cart-view/", formdata);

      const url = userData.user_id
        ? `cart-list/${cart_id}/${userData?.user_id}/`
        : `cart-list/${cart_id}/`;
      apiInstance.get(url).then((res) => {
        setCartCount(res.data.length);
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleReviewFetching = async () => {
    if (detail !== null || detail !== undefined ) {
     await apiInstance.get(`reviews/${detail?.id}/`).then((response) => {
        setReviews(response.data);
        // console.log(response.data)
      });
    }
  };

  // useEffect(() => {
  //   fetchReviewData();
  // }, []);

  const handleReviewChange = (event) => {
    setCreateReview({
      ...createReview,
      [event.target.name]: event.target.value,
    });
  };

  const hanldeReviewSubmit = (e) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append("user_id", userData?.user_id);
    formdata.append("product_id", detail?.id);
    formdata.append("review", createReview.review);
    formdata.append("rating", createReview.rating);

    apiInstance.post(`reviews/${detail?.id}/`, formdata).then((response) => {
      // console.log(response.data)
      fetchReviewData();
    });
  };

  return (
    <>
      <main className="mb-4 mt-4">
        <div className="container">
          {/* Section: Product details */}
          <section className="mb-9">
            <div className="row gx-lg-5">
              <div className="col-md-6 mb-4 mb-md-0">
                {/* Gallery */}
                <div className="">
                  <div className="row gx-2 gx-lg-3">
                    <div className="col-12 col-lg-12">
                      <div className="lightbox">
                        <img
                          src={detail["image"]}
                          style={{
                            width: "100%",
                            height: 500,
                            objectFit: "cover",
                            borderRadius: 10,
                          }}
                          alt="Gallery image 1"
                          className="ecommerce-gallery-main-img active w-100 rounded-4"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 d-flex">
                    {gallery?.map((element, index) => (
                      <div className="p-3" key={index}>
                        <img
                          src={element.image}
                          style={{
                            width: 100,
                            height: 100,
                            objectFit: "cover",
                            borderRadius: 10,
                          }}
                          alt="Gallery image 1"
                          className="ecommerce-gallery-main-img active w-100 rounded-4"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                {/* Gallery */}
              </div>
              <div className="col-md-6 mb-4 mb-md-0">
                {/* Details */}
                <div>
                  <h1 className="fw-bold mb-3">{detail["title"]}</h1>
                  <div className="d-flex text-primary just align-items-center">
                    <ul
                      className="mb-3 d-flex p-0"
                      style={{ listStyle: "none" }}
                    >
                      <li>
                        <i
                          className="fas fa-star fa-sm text-warning ps-0"
                          title="Bad"
                        />
                        <i
                          className="fas fa-star fa-sm text-warning ps-0"
                          title="Bad"
                        />
                        <i
                          className="fas fa-star fa-sm text-warning ps-0"
                          title="Bad"
                        />
                        <i
                          className="fas fa-star fa-sm text-warning ps-0"
                          title="Bad"
                        />
                        <i
                          className="fas fa-star fa-sm text-warning ps-0"
                          title="Bad"
                        />
                      </li>

                      <li style={{ marginLeft: 10, fontSize: 13 }}>
                        <a href="" className="text-decoration-none">
                          <strong className="me-2">4/5</strong>(2 reviews)
                        </a>
                      </li>
                    </ul>
                  </div>
                  <h5 className="mb-3">
                    <s className="text-muted me-2 small align-middle">
                      {detail["old_price"]}
                    </s>
                    <span className="align-middle">{detail.price}</span>
                  </h5>
                  <p className="text-muted">{detail["description"]}</p>
                  <div className="table-responsive">
                    <table className="table table-sm table-borderless mb-0">
                      <tbody>
                        <tr>
                          <th className="ps-0 w-25" scope="row">
                            <strong>Category</strong>
                          </th>
                          <td>{detail.category?.title}</td>
                        </tr>
                        {specifications?.map((element, index) => (
                          <tr key={index}>
                            <th className="ps-0 w-25" scope="row">
                              <strong>{element.title}</strong>
                            </th>
                            <td>{element.content}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <hr className="my-5" />
                  <div>
                    <div className="row flex-column">
                      {/* Quantity */}
                      <div className="col-md-6 mb-4">
                        <div className="form-outline">
                          <label className="form-label" htmlFor="typeNumber">
                            <b>Quantity</b>
                          </label>
                          <input
                            type="number"
                            id="typeNumber"
                            className="form-control quantity"
                            min={1}
                            onChange={(e) => {
                              setQuantityValue(e.target.value);
                            }}
                            value={quantityValue}
                          />
                        </div>
                      </div>

                      {/* Size */}
                      {size.length > 0 && (
                        <div className="col-md-6 mb-4">
                          <div className="form-outline">
                            <label className="form-label" htmlFor="typeNumber">
                              <b>
                                Size:<span>{sizeValue}</span>
                              </b>
                            </label>
                          </div>
                          <div className="d-flex">
                            <div className="me-2 d-flex">
                              {size?.map((element, index) => (
                                <div>
                                  <input
                                    type="text"
                                    className="size_name"
                                    value={element.name}
                                    hidden
                                    readOnly
                                  />
                                  <button
                                    type="button"
                                    onClick={handleSizeButtonClick}
                                    className="btn btn-secondary  p-3 size_button mx-1"
                                    key={index}
                                  >
                                    {element.name}
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Colors */}

                      {color.length > 0 && (
                        <div className="col-md-6 mb-4">
                          <div className="form-outline">
                            <label className="form-label" htmlFor="typeNumber">
                              <b>Color:</b> <span>{colorValue}</span>
                            </label>
                          </div>
                          <div className="d-flex">
                            {color?.map((element, index) => (
                              <div>
                                <input
                                  type="text"
                                  className="color_name"
                                  value={element.name}
                                  name=""
                                  id=""
                                  hidden
                                  readOnly
                                />
                                <button
                                  type="button"
                                  onClick={handleColorButtonClick}
                                  className="btn  p-3 m-1 color_button"
                                  style={{
                                    backgroundColor: `${element.color_code}`,
                                    margin: "5px",
                                  }}
                                  key={index}
                                ></button>
                              </div>
                            ))}
                          </div>
                          <hr />
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="btn btn-primary btn-rounded me-2"
                    >
                      <i className="fas fa-cart-plus me-2" /> Add to cart
                    </button>
                    <button
                      href="#!"
                      type="button"
                      className="btn btn-danger btn-floating"
                      data-mdb-toggle="tooltip"
                      title="Add to wishlist"
                    >
                      <i className="fas fa-heart" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <hr />
          <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className="nav-link active"
                id="pills-home-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-home"
                type="button"
                role="tab"
                aria-controls="pills-home"
                aria-selected="true"
              >
                Specifications
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="pills-profile-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-profile"
                type="button"
                role="tab"
                aria-controls="pills-profile"
                aria-selected="false"
              >
                Vendor
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                onClick={handleReviewFetching}
                className="nav-link"
                id="pills-contact-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-contact"
                type="button"
                role="tab"
                aria-controls="pills-contact"
                aria-selected="false"
              >
                Review
              </button>
            </li>
          </ul>
          <div className="tab-content" id="pills-tabContent">
            <div
              className="tab-pane fade show active"
              id="pills-home"
              role="tabpanel"
              aria-labelledby="pills-home-tab"
              tabIndex={0}
            >
              <div className="table-responsive">
                <table className="table table-sm table-borderless mb-0">
                  <tbody>
                    <tr>
                      <th className="ps-0 w-25" scope="row">
                        {" "}
                        <strong>Category</strong>
                      </th>
                      <td>Technologes</td>
                    </tr>
                    <tr>
                      <th className="ps-0 w-25" scope="row">
                        {" "}
                        <strong>Vat</strong>
                      </th>
                      <td>$1.9</td>
                    </tr>
                    <tr>
                      <th className="ps-0 w-25" scope="row">
                        {" "}
                        <strong>Model</strong>
                      </th>
                      <td>Shirt 5407X</td>
                    </tr>
                    <tr>
                      <th className="ps-0 w-25" scope="row">
                        {" "}
                        <strong>Material</strong>
                      </th>
                      <td>Cotton 80%</td>
                    </tr>
                    <tr>
                      <th className="ps-0 w-25" scope="row">
                        {" "}
                        <strong>Colors</strong>
                      </th>
                      <td>Green, Yellow</td>
                    </tr>
                    <tr>
                      <th className="ps-0 w-25" scope="row">
                        {" "}
                        <strong>Size</strong>
                      </th>
                      <td>XL, ML, SSL</td>
                    </tr>
                    <tr>
                      <th className="ps-0 w-25" scope="row">
                        {" "}
                        <strong>Delivery</strong>
                      </th>
                      <td>USA, Europe</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="pills-profile"
              role="tabpanel"
              aria-labelledby="pills-profile-tab"
              tabIndex={0}
            >
              <div className="card mb-3" style={{ maxWidth: 400 }}>
                <div className="row g-0">
                  <div className="col-md-4">
                    <img
                      src="https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"
                      style={{
                        height: "100%",
                        width: "100%",
                        objectFit: "cover",
                      }}
                      alt="User Image"
                      className="img-fluid"
                    />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <h5 className="card-title">John Doe</h5>
                      <p className="card-text">Frontend Developer</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="pills-contact"
              role="tabpanel"
              aria-labelledby="pills-contact-tab"
              tabIndex={0}
            >
              <div className="container mt-5">
                <div className="row">
                  {/* Column 1: Form to create a new review */}
                  <div className="col-md-6">
                    <h2>Create a New Review</h2>
                    <div className="mb-3">
                      <label htmlFor="username" className="form-label">
                        Rating
                      </label>
                      <select
                        name="rating"
                        onChange={handleReviewChange}
                        className="form-select"
                        id=""
                      >
                        <option value="1">1 Star</option>
                        <option value="2">2 Star</option>
                        <option value="3">3 Star</option>
                        <option value="4">4 Star</option>
                        <option value="5">5 Star</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="reviewText" className="form-label">
                        Review
                      </label>
                      <textarea
                        className="form-control"
                        id="reviewText"
                        onChange={handleReviewChange}
                        rows={4}
                        name="review"
                        placeholder="Write your review"
                      />
                    </div>
                    <button
                      type="submit"
                      onClick={hanldeReviewSubmit}
                      className="btn btn-primary"
                    >
                      Submit Review
                    </button>
                  </div>
                  {/* Column 2: Display existing reviews */}
                  <div className="col-md-6">
                    <h2>Existing Reviews</h2>
                    {reviews?.map((review, index) => (
                      <div className="card mb-3" key={index}>
                        <div className="row g-0">
                          <div className="col-md-3">
                            <img
                              src={review.profile.image}
                              alt="User Image"
                              className="img-fluid"
                            />
                          </div>
                          <div className="col-md-9">
                            <div className="card-body">
                              <h5 className="card-title">
                                {review.profile.full_name}
                              </h5>
                              <p className="card-text">
                                {moment(review.date).format("MMM,ddd,yyyy")}
                              </p>
                              <p className="card-text">{review.review}</p>
                              <i className="fas fa-start">
                                Rating:{review.rating}
                              </i>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="pills-disabled"
              role="tabpanel"
              aria-labelledby="pills-disabled-tab"
              tabIndex={0}
            >
              <div className="container mt-5">
                <div className="row">
                  {/* Column 1: Form to submit new questions */}
                  <div className="col-md-6">
                    <h2>Ask a Question</h2>
                    <form>
                      <div className="mb-3">
                        <label htmlFor="askerName" className="form-label">
                          Your Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="askerName"
                          placeholder="Enter your name"
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="questionText" className="form-label">
                          Question
                        </label>
                        <textarea
                          className="form-control"
                          id="questionText"
                          rows={4}
                          placeholder="Ask your question"
                          defaultValue={""}
                        />
                      </div>
                      <button type="submit" className="btn btn-primary">
                        Submit Question
                      </button>
                    </form>
                  </div>
                  {/* Column 2: Display existing questions and answers */}
                  <div className="col-md-6">
                    <h2>Questions and Answers</h2>
                    <div className="card mb-3">
                      <div className="card-body">
                        <h5 className="card-title">User 1</h5>
                        <p className="card-text">August 10, 2023</p>
                        <p className="card-text">
                          What are the available payment methods?
                        </p>
                        <h6 className="card-subtitle mb-2 text-muted">
                          Answer:
                        </h6>
                        <p className="card-text">
                          We accept credit/debit cards and PayPal as payment
                          methods.
                        </p>
                      </div>
                    </div>
                    <div className="card mb-3">
                      <div className="card-body">
                        <h5 className="card-title">User 2</h5>
                        <p className="card-text">August 15, 2023</p>
                        <p className="card-text">
                          How long does shipping take?
                        </p>
                        <h6 className="card-subtitle mb-2 text-muted">
                          Answer:
                        </h6>
                        <p className="card-text">
                          Shipping usually takes 3-5 business days within the
                          US.
                        </p>
                      </div>
                    </div>
                    {/* More questions and answers can be added here */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default ProductDetail;
