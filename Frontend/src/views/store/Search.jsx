import React, { useEffect, useState } from "react";
import { Link,useSearchParams } from "react-router-dom";
import apiInstance from "../../utils/axios";
import GetCurrentAddress from "../plugin/UserCountry";
import UserData from "../plugin/UserData";
import CartID from "../plugin/CartId";
import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
});

function Search() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const currentAddress = GetCurrentAddress();
  const userData = UserData();
  const cart_id = CartID();

  const [searchParams] = useSearchParams()
  const query = searchParams.get("query")

  const [colorValue, setColorValue] = useState("No Color");
  const [sizeValue, setSizeValue] = useState("NO Size");
  const [qtyValue, setQtyValue] = useState();
  const [selectedProduct, setSelectedProduct] = useState({});
  const [selectedColors, setSelectedColors] = useState({});
  const [selectedSize, setSelectedSize] = useState({});
  // const [selectedQty,setSelectedQty] = useState({})

  const handleColorButtonClick = (e, product_id, colorName) => {
    setColorValue(colorName);
    setSelectedProduct(product_id);
    setSelectedColors((prevSelectedColors) => ({
      ...prevSelectedColors,
      [product_id]: colorName,
    }));
  };
  // console.log(selectedColors)

  const handleSizeButtonClick = (event, product_id, sizeName) => {
    setSizeValue(sizeName);
    setSelectedProduct(product_id);

    setSelectedSize((prevSelectedSize) => ({
      ...prevSelectedSize,
      [product_id]: sizeName,
    }));
  };

  const handleQtyChange = (event, product_id) => {
    setQtyValue(event.target.value);
    setSelectedProduct(product_id);
  };

  // console.log(selectedQty)

  const handleAddToCart = async (product_id, price, shipping_amount) => {
    const formdata = new FormData();

    formdata.append("product_id", product_id);
    formdata.append("user_id", userData?.user_id);
    formdata.append("qty", qtyValue);
    formdata.append("price", price);
    formdata.append("shipping_amount", shipping_amount);
    formdata.append("country", currentAddress.country);
    formdata.append("size", selectedSize[product_id]);
    formdata.append("color", selectedColors[product_id]);
    formdata.append("cart_id", cart_id);
    const response = await apiInstance.post("cart-view/", formdata);
    // console.log(response.data)
    Toast.fire({
      icon: "success",
      title: response.data.message,
    });
  };

  useEffect(() => {
    apiInstance.get(`search/?query=${query}`).then((response) => {
      setProducts(response.data);
    });
  }, [query]);

  useEffect(() => {
    apiInstance.get(`category/`).then((response) => {
      setCategory(response.data);
    });
  }, []);

  return (
    <div>
      <main className="mt-5">
        <div className="container">
          <section className="text-center">
            <div className="row">
              {products?.map((p, index) => (
                <div className="col-lg-4 col-md-12 mb-4" key={index}>
                  <div className="card">
                    <div
                      className="bg-image hover-zoom ripple"
                      data-mdb-ripple-color="light"
                    >
                      <Link to={`/detail/${p.slug}/`}>
                        <img
                          src={p.image}
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
                              backgroundColor: "rgba(251, 251, 251, 0.15)",
                            }}
                          />
                        </div>
                      </a>
                    </div>
                    <div className="card-body">
                      <a href="" className="text-reset">
                        <h5 className="card-title mb-3">{p.title}</h5>
                      </a>
                      <a href="" className="text-reset">
                        <p>{p.category?.title}</p>
                      </a>
                      <h6 className="mb-3">Rs.{p.price}</h6>
                      <div className="btn-group">
                        <button
                          className="btn btn-primary dropdown-toggle"
                          type="button"
                          id="dropdownMenuClickable"
                          data-bs-toggle="dropdown"
                          data-bs-auto-close="false"
                          aria-expanded="false"
                        >
                          Variation
                        </button>
                        <ul
                          className="dropdown-menu"
                          aria-labelledby="dropdownMenuClickable"
                        >
                          <div className="d-flex flex-column mt-3">
                            <li className="p-1">
                              <b>Qty</b>
                            </li>
                            <div className="p-1 mt-0 pt-0 d-flex flex-wrap">
                              <li>
                                <input
                                  type="number"
                                  className="form-control"
                                  onChange={(event) =>
                                    handleQtyChange(event, p.id)
                                  }
                                />
                              </li>
                            </div>
                          </div>
                          {p.size.length > 0 && (
                            <div className="d-flex flex-column">
                              <li className="p-1">
                                <b>Size</b>:{selectedSize[p.id] || "No Size"}
                              </li>
                              <div className="p-1 mt-0 pt-0 d-flex flex-wrap">
                                {p.size.map((elem, ind) => (
                                  <li key={ind}>
                                    <button
                                      onClick={(event) =>
                                        handleSizeButtonClick(
                                          event,
                                          p.id,
                                          elem.name
                                        )
                                      }
                                      className="btn btn-secondary btn-sm me-2 mb-1"
                                    >
                                      {elem.name}
                                    </button>
                                  </li>
                                ))}
                              </div>
                            </div>
                          )}
                          {p.color.length > 0 && (
                            <div className="d-flex flex-column mt-3">
                              <li className="p-1">
                                <b>COlor</b>:
                                {selectedColors[p.id] || "No Color"}
                              </li>
                              <div className="p-1 mt-0 pt-0 d-flex flex-wrap">
                                {p.color.map((elem, ind) => (
                                  <li key={ind}>
                                    <button
                                      onClick={(e) =>
                                        handleColorButtonClick(
                                          e,
                                          p.id,
                                          elem.name
                                        )
                                      }
                                      className="btn btn-sm me-2 mb-1 p-3"
                                      style={{
                                        backgroundColor: `${elem.name}`,
                                      }}
                                    />
                                  </li>
                                ))}
                              </div>
                            </div>
                          )}
                          <div className="d-flex mt-3 p-1">
                            <button
                              type="button"
                              onClick={() =>
                                handleAddToCart(
                                  p.id,
                                  p.price,
                                  p.shipping_amount
                                )
                              }
                              className="btn btn-primary me-1 mb-1"
                            >
                              <i className="fas fa-shopping-cart" />
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger px-3 me-1 mb-1 ms-2"
                            >
                              <i className="fas fa-heart" />
                            </button>
                          </div>
                        </ul>
                        <button
                          type="button"
                          className="btn btn-danger px-3 me-1 ms-2"
                        >
                          <i className="fas fa-heart" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="row">
                {category?.map((element, index) => (
                  <div className="col-lg-2" key={index}>
                    <img
                      src={element.image}
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                      alt=""
                    />
                    <h6>{element.title}</h6>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Search;
