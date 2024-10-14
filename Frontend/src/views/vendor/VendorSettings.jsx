import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import UserData from "../plugin/UserData";
import apiInstance from "../../utils/axios";
import { Link } from "react-router-dom";
import moment from "moment";

function VendorSettings() {

    const [profileData,setProfileData] = useState([])
    const [profileImage,setProfileImage] = useState('')
    const [vendorData,setVendorData] = useState([])
    const [vendorImage,setVendorImage] = useState('')



    
    const fetchProfileData = () =>{
        apiInstance.get(`vendor-settings/${UserData()?.user_id}/`).then((response)=>{
            setProfileData(response.data)
            setProfileImage(response.data.image)
        })
    }

    const fetchVendorData = () =>{
      apiInstance.get(`vendor-shop-settings/${UserData()?.user_id}/`).then((response)=>{
        setVendorData(response.data)
        setVendorImage(response.data.image)
      })
    }

    useEffect(()=>{
        fetchProfileData();
        fetchVendorData();
    },[])

    const handleInputChange = (event) =>{
        setProfileData({
            ...profileData,
            [event.target.name]:event.target.value,
        })

    }

    const handleVendorInputChange = (event) =>{
      setVendorData({
        ...vendorData,
        [event.target.name]:event.target.value,
      })
    }

    const handeVendorImageChange = (event) =>{
      setVendorData({
        ...vendorData,
        [event.target.name]:event.target.files[0]
      })
    }
    

    const handleImageChange = (event) =>{
        setProfileData({
            ...profileData,
            [event.target.name]:event.target.files[0]
    
        })
      }

    const handleProfileSubmit = async (e) =>{
        e.preventDefault();
        const formdata = new FormData()
        const res = await apiInstance.get(`vendor-settings/${UserData()?.user_id}/`)
        if(profileData.image != res.data.image){
            formdata.append('image',profileData.image)
        }
        formdata.append("full_name",profileData.full_name)
        formdata.append("about",profileData.about)
        
        await apiInstance.patch(`vendor-settings/${UserData()?.user_id}/`,formdata,{
            headers:{
              'Content-Type':'multipart/form-data',
            } 
          })
        fetchProfileData()

    }
    const handleVendorSubmit = async (e) =>{
        e.preventDefault();
        const formdata = new FormData()
        const res = await apiInstance.get(`vendor-shop-settings/${UserData()?.vendor_id}/`)
        if(vendorData.image != res.data.image){
            formdata.append('image',vendorData.image)
        }
        formdata.append("name",vendorData.name)
        formdata.append("description",vendorData.description)
        
        await apiInstance.patch(`vendor-shop-settings/${UserData()?.vendor_id}/`,formdata,{
            headers:{
              'Content-Type':'multipart/form-data',
            } 
          })
          fetchVendorData();

    }
  return (
    <div className="container-fluid" id="main">
      <div className="row row-offcanvas row-offcanvas-left h-100">
        <Sidebar />
        <div className="col-md-9 col-lg-10 main mt-4">
          <div className="container">
            <div className="main-body">
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
                    Profile
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
                    Shop
                  </button>
                </li>
              </ul>
              <div className="tab-content" id="pills-tabContent">
                <div
                  className="tab-pane fade show active"
                  id="pills-home"
                  role="tabpanel"
                  aria-labelledby="pills-home-tab"
                >
                  <div className="row gutters-sm shadow p-4 rounded">
                    <div className="col-md-4 mb-3">
                      <div className="card h-100">
                        <div className="card-body">
                          <div className="d-flex flex-column align-items-center text-center">
                            <img
                              src={profileImage}
                              style={{
                                width: 160,
                                height: 160,
                                objectFit: "cover", 
                              }}
                              alt="Admin"
                              className="rounded-circle"
                              width={150}                            
                            />
                            <div className="mt-3">
                              <h4 className="text-dark">{profileData?.full_name}</h4>
                              <p className="text-secondary mb-1">
                                {profileData?.about}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-8">
                      <div className="card mb-3">
                        <div className="card-body">
                          <form
                            className="form-group"
                            method="POST"
                            noValidate=""
                            onSubmit={handleProfileSubmit}
                            encType="multipart/form-data"
                          >
                            <div className="row text-dark">
                              <div className="col-lg-6 mb-2">
                                <label htmlFor="" className="mb-2">
                                  Profile Image
                                </label>
                                <input
                                  type="file"
                                  onChange={handleImageChange}
                                  className="form-control"
                                  name="image"
                                  id=""
                                />
                              </div>
                              <div className="col-lg-6 mb-2 ">
                                <label htmlFor="" className="mb-2">
                                  Full Name
                                </label>
                                <input
                                  type="text"
                                  name="full_name"
                                  onChange={handleInputChange}
                                  value={profileData?.full_name}
                                  className="form-control"
                                  id=""
                                />
                              </div>
                              <div className="col-lg-6 mb-2">
                                <label htmlFor="" className="mb-2">
                                  Email
                                </label>
                                <input
                                  type="text"
                                  value={profileData?.user?.email}
                                  className="form-control"
                                  readOnly
                                  name=""
                                  id=""
                                />
                              </div>
                              <div className="col-lg-6 mb-2">
                                <label htmlFor="" className="mb-2">
                                  Phone Number
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={profileData?.user?.phone}
                                  readOnly
                                  name=""
                                  id=""
                                />
                              </div>
                              <div className="col-lg-12 mb-2">
                                <label htmlFor="" className="mb-2">
                                  About Me
                                </label>
                                <textarea
                                  type="text"
                                  name="about"
                                  onChange={handleInputChange}
                                  value={profileData?.about}
                                  className="form-control"
                                  id=""
                                />
                              </div>
                              <div className="col-lg-6 mt-4 mb-3">
                                <button
                                  className="btn btn-success"
                                  type="submit"
                                >
                                  Update Profile{" "}
                                  <i className="fas fa-check-circle" />{" "}
                                </button>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="pills-profile"
                  role="tabpanel"
                  aria-labelledby="pills-profile-tab"
                >
                  <div className="row gutters-sm shadow p-4 rounded">
                    <div className="col-md-4 mb-3">
                      <div className="card h-100">
                        <div className="card-body">
                          <div className="d-flex flex-column align-items-center text-center">
                            <img
                              src={vendorImage}
                              style={{
                                width: 160,
                                height: 160,
                                objectFit: "cover",
                              }}
                              alt="Admin"
                              className="rounded-circle"
                              width={150}
                            />
                            <div className="mt-3">
                              <h4 className="text-dark">{vendorData?.name}</h4>
                              <p className="text-secondary mb-1">
                                {vendorData?.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-8">
                      <div className="card mb-3">
                        <div className="card-body">
                          <form
                            className="form-group"
                            method="POST"
                            noValidate=""
                            onSubmit={handleVendorSubmit}
                            encType="multipart/form-data"
                          >
                            <div className="row text-dark">
                              <div className="col-lg-12 mb-2">
                                <label htmlFor="" className="mb-2">
                                  Shop Image
                                </label>
                                <input
                                  type="file"
                                  className="form-control"
                                  onChange={handeVendorImageChange}
                                  name="image"
                                  id=""
                                />
                              </div>
                              <div className="col-lg-12 mb-2 ">
                                <label htmlFor="" className="mb-2">
                                  Shop Name
                                </label>
                                <input
                                  type="text"
                                  name="name"
                                  onChange={handleVendorInputChange}
                                  value={vendorData?.name}
                                  className="form-control"
                                  id=""
                                />
                              </div>
                              <div className="col-lg-6 mb-2">
                                <label htmlFor="" className="mb-2">
                                  Email
                                </label>
                                <input
                                  type="text"
                                  onChange={handleVendorInputChange}
                                  value={vendorData?.user?.email}
                                  className="form-control"
                                  readOnly
                                  name=""
                                  id=""
                                />
                              </div>
                              <div className="col-lg-12 mb-2">
                                <label htmlFor="" className="mb-2">
                                  Description
                                </label>
                                <textarea
                                  type="text"
                                  name="description"
                                  onChange={handleVendorInputChange}
                                  value={vendorData?.description}
                                  className="form-control"
                                  id=""
                                />
                              </div>
                              <div className="col-lg-6 mt-4 mb-3">
                                <button
                                  className="btn btn-success"
                                  type="submit"                                >
                                  Update Shop{" "}
                                  <i className="fas fa-check-circle" />{" "}
                                </button>
                                <Link
                                  className="btn btn-primary"
                                  to={`/vendor/${vendorData?.slug}/`}
                                >
                                  View Shop <i className="fas fa-shop" />{" "}
                                </Link>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorSettings;
