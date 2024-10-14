import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import apiInstance from "../../utils/axios";
import UserData from "../plugin/UserData";
// import Swal from "sweetalert2";
import moment from 'moment';

function CustomerNotification() {
  const [notifications, setNotifications] = useState([]);
  const userData = UserData();

  const fetchNotification = () => {
    apiInstance
      .get(`customer/notification/${userData?.user_id}/`)
      .then((response) => {
        setNotifications(response.data);
      });
  };
  useEffect(() => {
    fetchNotification();
  }, []);

  const MarkNotiAsSeen =  async (user_id,noti_id) =>{
    await apiInstance
    .get(`customer/notification/${user_id}/${noti_id}/`)
    .then((response) => {
    });
    fetchNotification();
    // Swal.fire({
    //     icon:"success",
    //     title:"Seen"
    // })
  }

  return (
    <main className="mt-5">
      <div className="container">
        <section className="">
          <div className="row">
            <Sidebar />

            <div className="col-lg-9 mt-1">
              <section className="">
                <main className="mb-5" style={{}}>
                  <div className="container px-4">
                    <section className="">
                      <h3 className="mb-3">
                        <i className="fas fa-bell" /> Notifications{" "}
                      </h3>
                      <div className="list-group">
                        {notifications.map((notification, index) => (
                          <a
                            href="#"
                            className="list-group-item list-group-item-action"
                          >
                            <div className="d-flex w-100 justify-content-between">
                              <h5 className="mb-1">Order Confirmed</h5>
                              <small className="text-muted">{moment(notification.date).format("MMM,DD,YYYY")}</small>
                            </div>
                            <p className="mb-1">
                              Your Order has been cofirmed.
                            </p>
                            <button onClick={()=>MarkNotiAsSeen(userData?.user_id,notification.id)} className="btn btn-success mt-3"><i className="fas fa-eye"></i></button>
                          </a>
                        ))}
                        {notifications.length < 1 && 
                          <h4 className="text-center">You are all cought up</h4>
                        }
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

export default CustomerNotification;
