import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import apiInstance from "../../utils/axios";
import UserData from "../plugin/UserData";

function Settings() {
  const [profile, setProfile] = useState({});
  const userData = UserData();
  const fetchProfileData = () => {
    apiInstance.get(`user/profile/${userData?.user_id}/`).then((response) => {
      setProfile(response.data);
    });
  };
  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleInputChange = (event) => {
    setProfile({
      ...profile,
      [event.target.name]: event.target.value,
    });
  };
  const handleImageChange = (event) =>{
    setProfile({
        ...profile,
        [event.target.name]:event.target.files[0]

    })
  }
  const handleFormSubmit = async (e) =>{
    e.preventDefault()

    const formdata = new FormData()
    const res = await apiInstance.get(`user/profile/${userData?.user_id}/`)
    if(profile.image && profile.image != res.data.image){
        formdata.append('image',profile.image)
    }
    formdata.append('full_name',profile.full_name)
    formdata.append('country',profile.country)
    formdata.append('state',profile.state)
    formdata.append('city',profile.city)
    formdata.append('address',profile.address)

    try{
      await apiInstance.patch(`user/profile/${userData?.user_id}/`,formdata,{
        headers:{
          'Content-Type':'multipart/form-data',
        } 
      })
      fetchProfileData();

    }catch(error){
      console.log(error)
    }

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
                        {" "}
                        <i className="fas fa-gear fa-spin" /> Settings{" "}
                      </h3>
                      <form encType="multipart/form-data" onSubmit={handleFormSubmit}>
                        <div className="row">
                          <div className="col-lg-12">
                            <label
                              htmlFor="exampleInputEmail1"
                              className="form-label"
                            >
                              Profile Image
                            </label>
                            <input
                              type="file"
                              className="form-control"
                              aria-describedby="emailHelp"
                              name="image"
                              onChange={handleImageChange}
                            />
                          </div>
                          <div className="col-lg-12">
                            <label
                              htmlFor="exampleInputEmail1"
                              className="form-label"
                            >
                              Full Name
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              aria-describedby="emailHelp"
                              value={profile?.full_name}
                              name="full_name"
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="col-lg-6 mt-3">
                            <label
                              htmlFor="exampleInputEmail1"
                              className="form-label"
                            >
                              Email address
                            </label>
                            <input
                              type="email"
                              className="form-control"
                              aria-describedby="emailHelp"
                              value={profile?.user?.email}
                              name="email"
                              readOnly
                            />
                          </div>
                          <div className="col-lg-6 mt-3">
                            <label
                              htmlFor="exampleInputEmail1"
                              className="form-label"
                            >
                              Mobile
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              aria-describedby="emailHelp"
                              value={profile?.user?.phone}
                              name="mobile"
                              readOnly
                            />
                          </div>
                        </div>
                        <br />
                        <div className="row">
                          <div className="col-lg-6">
                            <label
                              htmlFor="exampleInputEmail1"
                              className="form-label"
                            >
                              Address
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              aria-describedby="emailHelp"
                              value={profile?.address}
                              name="address"
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="col-lg-6 mt-3">
                            <label
                              htmlFor="exampleInputEmail1"
                              className="form-label"
                            >
                              City
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              aria-describedby="emailHelp"
                              value={profile?.city}
                              name="city"
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="col-lg-6 mt-3">
                            <label
                              htmlFor="exampleInputEmail1"
                              className="form-label"
                            >
                              State
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              aria-describedby="emailHelp"
                              value={profile?.state}
                              name="state"
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="col-lg-6 mt-3">
                            <label
                              htmlFor="exampleInputEmail1"
                              className="form-label"
                            >
                              Country
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              aria-describedby="emailHelp"
                              value={profile?.country}
                              name="country"
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <button type="submit" className="btn btn-primary mt-5">
                          Save Changes
                        </button>
                      </form>
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

export default Settings;
