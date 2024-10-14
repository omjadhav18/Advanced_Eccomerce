import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import UserData from "../plugin/UserData";
import apiInstance from "../../utils/axios";
import { Link } from "react-router-dom";
import moment from 'moment';

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    apiInstance
      .get(`vendor/orders/${UserData()?.vendor_id}/`)
      .then((response) => {
        setOrders(response.data);
      });
  }, []);

  const handleFilterOrders = async (filter) =>{

    const response = await apiInstance.get(`vendor/orders/${UserData()?.vendor_id}/filter?filter=${filter}`)
    setOrders(response.data)

  }


  return (
    <div className="container-fluid" id="main">
      <div className="row row-offcanvas row-offcanvas-left h-100">
        <Sidebar />
        <div className="col-md-9 col-lg-10 main mt-4">
          <div className="row mb-3 container">
            <h4>
              <i className="bi bi-grid" /> All Orders
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
                  <a className="dropdown-item" onClick={()=>handleFilterOrders("paid")}>
                    payment_status: paid
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" onClick={()=>handleFilterOrders("pending")}>
                  payment_status: pending
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" onClick={()=>handleFilterOrders("processing")}>
                  payment_status: processing
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" onClick={()=>handleFilterOrders("cancelled")}>
                  payment_status: cancelled
                  </a>
                </li>
                <hr />
                <li>
                  <a className="dropdown-item" onClick={()=>handleFilterOrders("latest")}>
                    Date: Latest
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" onClick={()=>handleFilterOrders("oldest")}>
                    Date: Oldest
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" onClick={()=>handleFilterOrders("Pending")}>
                  Order_status: Pending
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" onClick={()=>handleFilterOrders("FulFilled")}>
                  Order_status: FulFilled
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" onClick={()=>handleFilterOrders("Cancelled")}>
                  Order_status: Cancelled
                  </a>
                </li>
              </ul>
            </div>
            <table className="table">
              <thead className="table-dark">
                <tr>
                  <th scope="col">#OrderID</th>
                  <th scope="col">Total</th>
                  <th scope="col">Payment Status</th>
                  <th scope="col">Delivery Status</th>
                  <th scope="col">Date</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders?.map((orders, index) => (
                  <tr key={index}>
                    <th scope="row">{orders?.oid}</th>
                    <td>{orders.total}</td>
                    <td>{orders.payment_status}</td>
                    <td>{orders.order_status}</td>
                    <td>{moment(orders.date).format("MMM,DD,YYYY")}</td>
                    <td>
                      <Link to={`/vendor/orders/${orders.oid}/`} className="btn btn-primary">
                        <i className="fas fa-eye" />
                      </Link>
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

export default Orders;
