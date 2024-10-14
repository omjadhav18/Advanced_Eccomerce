import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import apiInstance from "../../utils/axios";
import UserData from "../plugin/UserData";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2'

function Product() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    apiInstance
      .get(`vendor/products/${UserData()?.vendor_id}/`)
      .then((response) => {
        setProducts(response.data);
      });
  }, []);

  const handleDeleteProduct = async (product_pid) =>{
     await apiInstance.delete(`vendor-delete-product/${UserData()?.vendor_id}/${product_pid}/`)
     await apiInstance
      .get(`vendor/products/${UserData()?.vendor_id}/`)
      .then((response) => {
        setProducts(response.data);
      });
      Swal.fire({
        icon:"success",
        title:"Deleted Successfully"
      })
      
  }
  return (
    <div className="container-fluid" id="main">
      <div className="row row-offcanvas row-offcanvas-left h-100">
        <Sidebar />
        <div className="col-md-9 col-lg-10 main mt-4">
          <div className="row mb-3 container">
            <h4>
              <i className="bi bi-grid" /> All Products
            </h4>
            <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle btn-sm mt-3 mb-4"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Filter <i className="fas fa-sliders" />
              </button>
              <ul
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton1"
              >
                <li>
                  <a className="dropdown-item" href="#">
                    Status: Live
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Status: In-active
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Status: In-review
                  </a>
                </li>
                <hr />
                <li>
                  <a className="dropdown-item" href="#">
                    Date: Latest
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Date: Oldest
                  </a>
                </li>
              </ul>
            </div>
            <table className="table">
              <thead className="table-dark">
                <tr>
                  <th scope="col">Img</th>
                  <th scope="col">Name</th>
                  <th scope="col">Price</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Orders</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {products?.map((product, index) => (
                  <tr key={index}>
                    <th scope="row">
                      <img
                        src={product.image}
                        style={{
                          width: "100px",
                          height: "70px",
                          objectFit: "cover",
                          borderRadius: "15px",
                        }}
                      />
                    </th>
                    <td>{product.title}</td>
                    <td>{product.price}</td>
                    <td>{product.stock_qty}</td>
                    <td>{product.orders}</td>
                    <td>{product.status}</td>
                    <td>
                      <Link to={`/detail/${product.slug}/`} className="btn btn-primary mb-1">
                        <i className="fas fa-eye" />
                      </Link>
                      <Link to={`/vendor/product/update/${product.pid}/`} className="btn btn-success mb-1">
                        <i className="fas fa-edit" />
                      </Link>
                      <button onClick={()=>handleDeleteProduct(product.pid)} className="btn btn-danger mb-1">
                        <i className="fas fa-trash" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;
